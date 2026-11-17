import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { NextWindows } from "@/components/check/next-windows";
import { WaitlistForm } from "@/components/check/waitlist-form";
import { PageHeader } from "@/components/site/page-header";
import { ButtonLink, Badge, Card, CardTitle, Kv } from "@/components/ui/primitives";
import { checkCoverage, getPriceBook } from "@/lib/api";
import { money } from "@/lib/format";

export const metadata: Metadata = { title: "Check your address" };

export default async function CheckPage({ searchParams }: { searchParams: { zip?: string } }) {
  const zip = (searchParams.zip ?? "").trim();
  if (!/^\d{5}$/.test(zip)) redirect("/#main");
  const [result, book] = await Promise.all([checkCoverage(zip), getPriceBook()]);

  if (!result.covered) {
    // C3 · Outside the area: waitlist
    return (
      <>
        <PageHeader
          back={{ href: "/" }}
          eyebrow="Not in your area yet"
          title={
            <>
              We are not at <em>{zip}</em> yet.
            </>
          }
          lead="Join the waitlist and we will email you when pickups open near you."
          photo={{ src: "/img/family-calendar.webp", caption: "Opening in more of Atlanta soon" }}
        />
        <main id="main" className="wrap main-pad">
          <div className="split" data-stg>
            <Card>
              <CardTitle>Join the waitlist</CardTitle>
              <WaitlistForm zip={zip} />
            </Card>
            <Card variant="dk" className="aside">
              <CardTitle>Where we are today</CardTitle>
              {result.liveZones.map((z) => (
                <Kv key={z.name} label={z.name} value={zipRange(z.zips)} />
              ))}
              <p className="mut" style={{ marginTop: 18, color: "inherit", opacity: 0.8 }}>
                More areas are opening as demand grows.
              </p>
            </Card>
          </div>
        </main>
      </>
    );
  }

  // C2 · Address is covered
  return (
    <>
      <PageHeader
        back={{ href: "/" }}
        eyebrow="Your address"
        title={
          <>
            Good news. We pick up at <em>{zip}</em>.
          </>
        }
        lead="Pickup from your door, delivered back clean in 24–48 hours."
        photo={{ src: "/img/tote-window.webp", caption: "Your bag, ready at the door" }}
      />
      <main id="main" className="wrap main-pad">
        <div className="split">
          <div className="stack" data-stg>
            <Card>
              <div className="row sb">
                <CardTitle>Your address</CardTitle>
                <Badge tone="ok">✓ We serve {zip}</Badge>
              </div>
              <Kv label="Standard Bag" value={money(book.bagPrice)} />
              <p className="mut" style={{ margin: "-4px 0 6px" }}>
                Wash &amp; fold, up to {book.bagMaxLbs} lbs. Dry-cleaning items priced per item.
              </p>
              <Kv label="Pickup and delivery" value={money(book.deliveryFee)} />
              <p className="mut">Free delivery from {money(book.freeDeliveryFrom)}.</p>
            </Card>
            <Card>
              <CardTitle>Next pickup windows</CardTitle>
              <NextWindows zip={zip} windows={result.nextWindows} />
            </Card>
          </div>
          <Card variant="dk" className="aside">
            <CardTitle>How it works</CardTitle>
            {["Pick a pickup window", "We collect your bag", "Delivered clean in 24–48 hours"].map((s, i) => (
              <div key={s} className="kv" style={{ justifyContent: "flex-start", gap: 18 }}>
                <span style={{ color: "var(--ac2)", fontWeight: 700 }}>{i + 1}</span>
                <b style={{ fontWeight: 500 }}>{s}</b>
              </div>
            ))}
            <p className="mut" style={{ marginTop: 18, color: "inherit", opacity: 0.8 }}>
              No store list, no store choice. ValetKleen takes care of it.
            </p>
            <ButtonLink variant="g" href="/prices" style={{ marginTop: 18 }}>
              See every price
            </ButtonLink>
          </Card>
        </div>
      </main>
    </>
  );
}

function zipRange(zips: string[]) {
  if (zips.length > 2) return `${zips[0]} – ${zips[zips.length - 1]}`;
  return zips.join(", ");
}
