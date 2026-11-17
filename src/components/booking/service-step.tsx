"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Counter } from "@/components/ui/controls";
import { money, priceRange } from "@/lib/format";
import { DEFAULT_PRICE_BOOK, SERVICE_LABEL, getCatalogItem } from "@/lib/pricing";
import type { CatalogItem, ServiceType } from "@/lib/types";
import { cn } from "@/lib/cn";
import { useBooking } from "./booking-store";
import { EstimateCard } from "./estimate-card";

const POPULAR = ["dry_cleaning:dress-shirt", "dry_cleaning:2pc-suit", "dry_cleaning:dress", "dry_cleaning:queen-comforter"];

/** C4 · Choose your service */
export function ServiceStep({ catalog }: { catalog: CatalogItem[] }) {
  const router = useRouter();
  const { draft, update, setItem, totals } = useBooking();
  const [browse, setBrowse] = useState(false);
  const [service, setService] = useState<ServiceType>("dry_cleaning");
  const [q, setQ] = useState("");
  const book = DEFAULT_PRICE_BOOK;

  const chosen = Object.keys(draft.items).filter((id) => !POPULAR.includes(id));
  const list = useMemo(() => {
    const term = q.trim().toLowerCase();
    return catalog.filter((i) => i.service === service && (!term || i.name.toLowerCase().includes(term) || i.category.toLowerCase().includes(term)));
  }, [catalog, service, q]);

  const empty = draft.bags === 0 && Object.keys(draft.items).length === 0;

  return (
    <div className="split">
      <div className="stack" data-stg>
        <div className="card">
          <div className="item">
            <div className="ithr">
              <Image className="ith" src="/img/bag.webp" alt="" width={52} height={52} style={{ objectPosition: "50% 30%" }} />
              <div>
                <b>Standard Bag</b>
                <small>
                  Wash, dry and fold. Up to {book.bagMaxLbs} lbs. {money(book.bagPrice)} each
                </small>
              </div>
            </div>
            <Counter label="Standard Bags" value={draft.bags} max={10} onChange={(n) => update({ bags: n })} />
          </div>

          <h2 className="s" style={{ marginTop: 26 }}>
            Dry-cleaning items
          </h2>
          <p className="mut">Priced per item, from the ValetKleen price list.</p>
          {[...POPULAR, ...chosen].map((id) => {
            const it = getCatalogItem(id);
            return it ? <ItemRow key={id} item={it} qty={draft.items[id] ?? 0} onChange={(n) => setItem(id, n)} /> : null;
          })}

          {!browse ? (
            <button type="button" className="lnk" style={{ marginTop: 16 }} onClick={() => setBrowse(true)}>
              Full item list · {catalog.length} items
            </button>
          ) : (
            <div style={{ marginTop: 22 }}>
              <div className="tabsbar" role="tablist" aria-label="Service">
                {(Object.keys(SERVICE_LABEL) as ServiceType[]).map((s) => (
                  <button key={s} role="tab" aria-selected={service === s} className={cn(service === s && "on")} onClick={() => setService(s)}>
                    {SERVICE_LABEL[s]}
                  </button>
                ))}
              </div>
              <label htmlFor="item-search" className="sr-only">
                Search items
              </label>
              <input id="item-search" className="inp" placeholder="Search, e.g. blazer or comforter" value={q} onChange={(e) => setQ(e.target.value)} />
              <div style={{ maxHeight: 520, overflowY: "auto", marginTop: 8 }}>
                {list.map((it) => (
                  <ItemRow key={it.id} item={it} qty={draft.items[it.id] ?? 0} onChange={(n) => setItem(it.id, n)} showService={service !== "dry_cleaning"} />
                ))}
                {list.length === 0 && <p className="mut" style={{ padding: "16px 0" }}>No items match “{q}”.</p>}
              </div>
            </div>
          )}
        </div>

        <div className="card">
          <div className="item">
            <div>
              <b>Express 24 hours</b>
              <small>+{money(book.expressFee)} where available</small>
            </div>
            <button type="button" className={cn("opt", draft.express && "on")} aria-pressed={draft.express} onClick={() => update({ express: !draft.express })}>
              {draft.express ? "Added" : "Add"}
            </button>
          </div>
          <div className="field">
            <label htmlFor="care">Care notes (optional)</label>
            <textarea id="care" maxLength={500} placeholder="e.g. Cold wash for the grey sweater" value={draft.careNotes} onChange={(e) => update({ careNotes: e.target.value })} />
          </div>
        </div>
      </div>

      <EstimateCard>
        <button className="btn p block" style={{ marginTop: 14 }} disabled={empty} onClick={() => router.push("/book/pickup")}>
          Continue →
        </button>
        <p className="mut" style={{ marginTop: 12, textAlign: "center" }}>
          {empty ? "Add a bag or at least one item." : totals.freeDelivery ? "Delivery is free on this order." : `Delivery is added at checkout. Free from ${money(book.freeDeliveryFrom)}.`}
        </p>
      </EstimateCard>
    </div>
  );
}

function ItemRow({ item, qty, onChange, showService }: { item: CatalogItem; qty: number; onChange: (n: number) => void; showService?: boolean }) {
  return (
    <div className="item">
      <div className="ithr">
        {item.image ? <Image className="ith" src={item.image} alt="" width={52} height={52} /> : <span className="ith" />}
        <div>
          <b>{item.name}</b>
          <small>
            {priceRange(item.priceMin, item.priceMax)}
            {showService ? ` · ${SERVICE_LABEL[item.service]}` : ""}
            {item.priceMin !== item.priceMax ? " · final price set at intake" : ""}
          </small>
        </div>
      </div>
      <Counter label={item.name} value={qty} onChange={onChange} />
    </div>
  );
}
