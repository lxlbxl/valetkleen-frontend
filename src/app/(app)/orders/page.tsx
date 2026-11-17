import type { Metadata } from "next";
import Link from "next/link";
import { ReportProblem } from "@/components/orders/report-problem";
import { PageHeader } from "@/components/site/page-header";
import { Badge, ButtonLink, Card, CardTitle, EmptyState } from "@/components/ui/primitives";
import { getCurrentCustomer, listMyOrders } from "@/lib/api";
import { longDate, money, pluralize } from "@/lib/format";
import { CUSTOMER_STATUS_LABEL, STATUS_TONE } from "@/lib/status";

export const metadata: Metadata = { title: "Your orders" };

/** C12 · Orders, reorder and help */
export default async function OrdersPage({ searchParams }: { searchParams: { report?: string } }) {
  const [orders, me] = await Promise.all([listMyOrders(), getCurrentCustomer()]);
  const active = orders.filter((o) => !["delivered", "cancelled"].includes(o.status));
  const past = orders.filter((o) => ["delivered", "cancelled"].includes(o.status));
  const sub = me.subscription;

  return (
    <>
      <PageHeader
        eyebrow="Your account"
        title={
          <>
            Orders, reorder and <em>help</em>.
          </>
        }
        photo={{ src: "/img/iron-stack.webp", caption: "Always the ValetKleen standard" }}
      />
      <main id="main" className="wrap main-pad">
        <div className="split">
          <div className="stack" data-stg>
            {active.length > 0 && (
              <Card>
                <CardTitle>In progress</CardTitle>
                {active.map((o) => (
                  <div className="item" key={o.id}>
                    <div>
                      <b>
                        {o.number} <Badge tone={o.status === "charged" ? "ok" : ""}>{CUSTOMER_STATUS_LABEL[o.status]}</Badge>
                      </b>
                      <small>
                        Pickup {longDate(o.pickupWindow.date + "T12:00:00")} · est. {money(o.estimate.total)}
                      </small>
                    </div>
                    <Link className="lnk" href={`/orders/${o.id}`}>
                      Track
                    </Link>
                  </div>
                ))}
              </Card>
            )}
            <Card>
              <CardTitle>Past orders</CardTitle>
              {past.length === 0 && <p className="mut">No past orders yet.</p>}
              {past.map((o) => {
                const bags = o.lines.find((l) => l.label.startsWith("Standard Bag"))?.qty ?? 0;
                return (
                  <div className="item" key={o.id}>
                    <div>
                      <b>
                        <Link href={`/orders/${o.id}`}>{o.number}</Link> <Badge tone={STATUS_TONE[o.status]}>{CUSTOMER_STATUS_LABEL[o.status]}</Badge>
                      </b>
                      <small>
                        {longDate(o.createdAt)} · {pluralize(bags, "Standard Bag")} · {money(o.final?.total ?? o.estimate.total)}
                      </small>
                    </div>
                    <div className="row">
                      <ButtonLink variant="g" href="/book" style={{ padding: "11px 18px" }}>
                        Reorder
                      </ButtonLink>
                      {o.status === "delivered" && (
                        <Link className="lnk" href={`/orders?report=${o.id}#report`}>
                          Report a problem
                        </Link>
                      )}
                    </div>
                  </div>
                );
              })}
            </Card>
            {orders.length === 0 && (
              <EmptyState title="No orders yet">
                <ButtonLink href="/book">Book your first pickup</ButtonLink>
              </EmptyState>
            )}
            <ReportProblem orders={past.filter((o) => o.status === "delivered").map((o) => ({ id: o.id, number: o.number }))} initial={searchParams.report} />
          </div>
          <aside className="aside card dk">
            <CardTitle>Your plan</CardTitle>
            {sub ? (
              <>
                <p style={{ font: "var(--hw) 36px/1.1 var(--hf)", color: "#fff", margin: "8px 0" }}>{sub.plan === "pass" ? "Pass" : "Family plan"}</p>
                <p style={{ opacity: 0.85 }}>
                  {sub.pickupsUsed} of {sub.pickupsIncluded} pickups used this month
                </p>
                <div aria-hidden="true" style={{ height: 4, background: "#ffffff30", marginTop: 14 }}>
                  <div style={{ height: 4, width: `${(sub.pickupsUsed / sub.pickupsIncluded) * 100}%`, background: "#36C5CC" }} />
                </div>
              </>
            ) : (
              <p style={{ opacity: 0.85, marginTop: 8 }}>You pay per order. A plan could save you delivery fees.</p>
            )}
            <ButtonLink variant="g" href="/plans" style={{ marginTop: 22 }}>
              Manage plan
            </ButtonLink>
          </aside>
        </div>
      </main>
    </>
  );
}
