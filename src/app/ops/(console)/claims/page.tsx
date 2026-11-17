import type { Metadata } from "next";
import Link from "next/link";
import { ClaimDecision } from "@/components/ops/claim-decision";
import { Badge, Card, CardTitle, EmptyState, Photo } from "@/components/ui/primitives";
import { listClaims, listOrders } from "@/lib/api";
import { longDate, timeOf } from "@/lib/format";
import { cn } from "@/lib/cn";

export const metadata: Metadata = { title: "Claims" };

const KIND = { item_missing: "Item missing", damaged: "Damaged", other: "Other" };
const RES = { partial_refund: "Partial refund", credit: "Credit on account", rejected: "Rejected" };

/** A11 · Claims queue */
export default async function ClaimsPage({ searchParams }: { searchParams: { tab?: string } }) {
  const [claims, orders] = await Promise.all([listClaims(), listOrders()]);
  const tab = searchParams.tab === "closed" ? "closed" : "open";
  const shown = claims.filter((c) => c.status === tab);
  const open = claims.filter((c) => c.status === "open").length;
  return (
    <>
      <div className="chead">
        <h1>Claims</h1>
      </div>
      <div className="tabsbar" role="tablist">
        <Link role="tab" aria-selected={tab === "open"} className={cn(tab === "open" && "on")} href="/ops/claims">
          Open ({open})
        </Link>
        <Link role="tab" aria-selected={tab === "closed"} className={cn(tab === "closed" && "on")} href="/ops/claims?tab=closed">
          Closed
        </Link>
      </div>
      {shown.length === 0 && <EmptyState title={tab === "open" ? "No open claims" : "No closed claims yet"} />}
      <div className="stack">
        {shown.map((c) => {
          const order = orders.find((o) => o.number === c.orderNumber);
          const age = (Date.now() - new Date(c.openedAt).getTime()) / 3_600_000;
          const photo = (t: string) => order?.handoffs.find((h) => h.type === t);
          return (
            <Card key={c.id}>
              <div className="row sb">
                <CardTitle>
                  {order ? <Link href={`/ops/orders/${order.id}`}>{c.orderNumber}</Link> : c.orderNumber} · {KIND[c.kind]}
                </CardTitle>
                {c.status === "open" ? <Badge tone={age > 24 ? "bad" : "warn"}>{age > 24 ? "24 h+" : `${Math.round(age)} h`}</Badge> : <Badge tone="ok">{c.resolution ? RES[c.resolution] : "Closed"}</Badge>}
              </div>
              <p className="mut" style={{ maxWidth: 760 }}>
                {c.summary}
              </p>
              <div className="grid3" style={{ marginTop: 20 }}>
                {(["pickup", "partner_intake", "delivered"] as const).map((t) => {
                  const h = photo(t);
                  const label = t === "pickup" ? "Pickup photo" : t === "partner_intake" ? "Intake photo" : "Delivery photo";
                  return <Photo key={t} src={h?.photoUrl} caption={h ? `${label} · ${longDate(h.at)} ${timeOf(h.at)}` : `${label} · not on file`} height={130} />;
                })}
              </div>
              {c.status === "open" && <ClaimDecision claimId={c.id} />}
            </Card>
          );
        })}
      </div>
    </>
  );
}
