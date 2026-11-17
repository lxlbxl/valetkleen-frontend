import type { Metadata } from "next";
import Image from "next/image";
import { AiSuggestionCard } from "@/components/ops/ai-suggestion";
import { Badge, Card, CardTitle } from "@/components/ui/primitives";
import { getCatalog, getPriceBook, listAiSuggestions } from "@/lib/api";
import { money, moneyShort } from "@/lib/format";

export const metadata: Metadata = { title: "Pricing and plans" };

/** A10 · Pricing and plans */
export default async function PricingPage({ searchParams }: { searchParams: { q?: string } }) {
  const [book, catalog, suggestions] = await Promise.all([getPriceBook(), getCatalog(), listAiSuggestions()]);
  const q = (searchParams.q ?? "").toLowerCase();
  const dc = catalog.filter((i) => i.service === "dry_cleaning" && (!q || i.name.toLowerCase().includes(q)));
  const press = new Map(catalog.filter((i) => i.service === "press_only").map((i) => [i.name, i]));
  const rows = [
    { item: "Standard Bag", price: money(book.bagPrice), rule: `Up to ${book.bagMaxLbs} lbs`, ok: true },
    { item: "Delivery", price: money(book.deliveryFee), rule: `Free from ${moneyShort(book.freeDeliveryFrom)}`, ok: true },
    { item: "Express", price: `+${money(book.expressFee)}`, rule: "Where partner capacity allows", ok: true },
    { item: "Pass", price: `${money(book.pass.monthly)}/mo`, rule: `${book.pass.pickups} pickups, extra ${money(book.pass.extraPickup)}`, ok: true },
    { item: "Family", price: `${moneyShort(book.family.monthly)}/mo`, rule: `${book.family.bags} bags, ${book.family.pickups} pickups`, ok: false },
  ];
  return (
    <>
      <div className="chead">
        <h1>Price book · v{book.version}</h1>
        {/* TODO(backend): editable draft → review → publish flow on the pricing engine. */}
        <button className="btn p" style={{ padding: "12px 22px" }} disabled title="Connect the pricing engine to edit">
          Draft change
        </button>
      </div>
      <Card>
        <div className="tbl-wrap">
          <table className="tbl">
            <thead>
              <tr>
                {["Item", "Price", "Rule", "Contribution"].map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.item}>
                  <td>
                    <b>{r.item}</b>
                  </td>
                  <td>{r.price}</td>
                  <td>{r.rule}</td>
                  <td>
                    <Badge tone={r.ok ? "ok" : "warn"}>{r.ok ? "Above floor" : "Thin"}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="split" style={{ marginTop: 22 }}>
        <Card>
          <div className="row sb">
            <CardTitle>Per-item prices · dry cleaning and press only</CardTitle>
            <span className="mut">{catalog.length} items · from price sheet</span>
          </div>
          <form role="search" style={{ marginTop: 10 }}>
            <label htmlFor="pq" className="sr-only">
              Filter items
            </label>
            <input id="pq" name="q" className="inp" placeholder="Filter items" defaultValue={searchParams.q} />
          </form>
          <div className="pbook">
            {dc.map((i) => (
              <div key={i.id}>
                {i.image && <Image src={i.image} alt="" width={120} height={120} />}
                <b>{i.name}</b>
                <span>
                  DC {money(i.priceMin)}
                  {press.get(i.name) ? ` · Press ${money(press.get(i.name)!.priceMin)}` : ""}
                </span>
              </div>
            ))}
          </div>
        </Card>
        <div className="aside stack">
          {suggestions.map((s) => (
            <AiSuggestionCard key={s.id} suggestion={s} />
          ))}
        </div>
      </div>
    </>
  );
}
