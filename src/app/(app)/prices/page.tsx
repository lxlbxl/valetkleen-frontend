import type { Metadata } from "next";
import Image from "next/image";
import { PageHeader } from "@/components/site/page-header";
import { ButtonLink, Card, CardTitle, Kv } from "@/components/ui/primitives";
import { getCatalog, getPriceBook } from "@/lib/api";
import { money, priceRange } from "@/lib/format";
import { SERVICE_LABEL } from "@/lib/pricing";
import type { CatalogItem, ServiceType } from "@/lib/types";

export const metadata: Metadata = { title: "Prices", description: "Every ValetKleen price: wash & fold bags, dry cleaning, press only and hang dry, per item." };

export default async function PricesPage() {
  const [catalog, book] = await Promise.all([getCatalog(), getPriceBook()]);
  const services: ServiceType[] = ["dry_cleaning", "press_only", "hang_dry"];
  return (
    <>
      <PageHeader
        eyebrow="The price list"
        title={<>Every price, <em>up front</em>.</>}
        lead={`${catalog.length} priced items, plus the Standard Bag. Your card is charged after weigh-in, never at booking.`}
        photo={{ src: "/img/pressing.webp", caption: "Pressed and returned on hangers" }}
      >
        <nav className="row" aria-label="Jump to service" style={{ marginTop: 26 }}>
          {services.map((s) => (
            <a key={s} className="btn g" href={`#${s}`} style={{ padding: "11px 18px" }}>{SERVICE_LABEL[s]}</a>
          ))}
        </nav>
      </PageHeader>
      <main id="main" className="wrap main-pad">
        <div className="grid3" style={{ marginTop: 40 }} data-stg>
          <Card>
            <CardTitle>Standard Bag</CardTitle>
            <Kv label={`Wash, dry and fold, up to ${book.bagMaxLbs} lbs`} value={money(book.bagPrice)} />
          </Card>
          <Card>
            <CardTitle>Delivery</CardTitle>
            <Kv label={`Free from ${money(book.freeDeliveryFrom)}`} value={money(book.deliveryFee)} />
          </Card>
          <Card>
            <CardTitle>Express 24 hours</CardTitle>
            <Kv label="Where partner capacity allows" value={`+${money(book.expressFee)}`} />
          </Card>
        </div>
        {services.map((s) => {
          const items = catalog.filter((i) => i.service === s);
          const groups = items.reduce<Record<string, CatalogItem[]>>((acc, i) => ((acc[i.category] ??= []).push(i), acc), {});
          return (
            <section key={s} id={s} style={{ marginTop: 70, scrollMarginTop: 100 }} aria-labelledby={`h-${s}`}>
              <div className="eyebrow">{items.length} items</div>
              <h2 id={`h-${s}`} className="t" style={{ fontFamily: "var(--hf)", fontWeight: 300, fontSize: 40, color: "#fff" }}>{SERVICE_LABEL[s]}</h2>
              {Object.entries(groups).map(([cat, list]) => (
                <Card key={cat} style={{ marginTop: 22 }}>
                  <CardTitle>{cat}</CardTitle>
                  <div className="grid2" style={{ columnGap: 40, rowGap: 0 }}>
                    {list.map((it) => (
                      <div className="item" key={it.id}>
                        <div className="ithr">
                          {it.image && <Image className="ith" src={it.image} alt="" width={52} height={52} />}
                          <b>{it.name}</b>
                        </div>
                        <span style={{ font: "300 20px var(--hf)", color: "var(--ice, #9fd8f5)" }}>{priceRange(it.priceMin, it.priceMax)}</span>
                      </div>
                    ))}
                  </div>
                </Card>
              ))}
            </section>
          );
        })}
        <div className="row" style={{ marginTop: 50 }}>
          <ButtonLink href="/book">Book a pickup →</ButtonLink>
        </div>
      </main>
    </>
  );
}
