import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Badge, ButtonLink, Card, CardTitle, Kv, Timeline } from "@/components/ui/primitives";
import { getOrder, listDrivers, listPartners } from "@/lib/api";
import { dayLabel, longDate, money, timeOf, windowLabel } from "@/lib/format";
import { STATUS_LABEL, STATUS_TONE, isAfter } from "@/lib/status";
import type { HandoffType } from "@/lib/types";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const o = await getOrder(params.id);
  return { title: o ? `Order ${o.number}` : "Order" };
}

const HANDOFF_LABEL: Record<HandoffType, string> = { pickup: "Picked up", partner_intake: "Received at partner", ready: "Ready", delivered: "Delivered" };

/** A4 · Order detail */
export default async function OpsOrderPage({ params }: { params: { id: string } }) {
  const [order, drivers, partners] = await Promise.all([getOrder(params.id), listDrivers(), listPartners()]);
  if (!order) notFound();
  const driver = (id: string | null) => drivers.find((d) => d.id === id)?.name ?? "not assigned";
  const partner = partners.find((p) => p.id === order.partnerId);
  const at = (t: HandoffType) => order.handoffs.find((h) => h.type === t);

  const steps = [
    { label: "Booked", detail: `${longDate(order.createdAt)} ${timeOf(order.createdAt)} · Customer · web`, done: true },
    ...(["pickup", "partner_intake"] as const).map((t) => {
      const h = at(t);
      return { label: HANDOFF_LABEL[t], detail: h ? `${longDate(h.at)} ${timeOf(h.at)} · Recorded by Ops (${h.recordedBy}) · photo ${h.photoUrl ? "✓" : "missing"} · ${h.by}` : undefined, done: !!h };
    }),
    {
      label: order.final ? `Weighed · ${order.final.weightLbs} lbs, ${order.final.itemCount} items` : "Weighed",
      detail: order.status === "weighed" ? "Awaiting charge confirmation" : order.final?.chargedAt ? `Charged ${money(order.final.total)}` : undefined,
      done: !!order.final?.chargedAt,
      now: order.status === "weighed",
    },
    { label: "Ready", done: isAfter(order.status, "charged") || order.status === "charged", detail: undefined },
    { label: "Delivered", done: order.status === "delivered", detail: at("delivered") ? `${timeOf(at("delivered")!.at)} · photo ✓` : undefined },
  ];
  const firstTodo = steps.findIndex((s) => !s.done);

  return (
    <>
      <div className="chead">
        <h1>
          Order {order.number} <Badge tone={STATUS_TONE[order.status]}>{STATUS_LABEL[order.status]}</Badge>
        </h1>
        <Link className="btn g" href="/ops/orders" style={{ padding: "12px 22px" }}>
          Back to board
        </Link>
      </div>
      <div className="split" style={{ marginTop: 0 }}>
        <div className="stack" data-stg>
          <Card>
            <CardTitle>Timeline and handoffs</CardTitle>
            <Timeline
              steps={steps.map((s, i) => ({
                label: s.label,
                detail: s.detail,
                state: s.done ? "done" : ("now" in s && s.now) || i === firstTodo ? "now" : "todo",
              }))}
            />
          </Card>
          <Card>
            <CardTitle>Order</CardTitle>
            {order.lines.map((l) => (
              <Kv key={l.label} label={`${l.qty} × ${l.label}`} value={money(l.qty * l.unit)} />
            ))}
            <Kv label="Pickup" value={`${dayLabel(order.pickupWindow.date)} · ${windowLabel(order.pickupWindow)}`} />
            <Kv label="Estimate" value={money(order.estimate.total)} />
            {order.careNotes && <Kv label="Care notes" value={order.careNotes} />}
          </Card>
        </div>
        <div className="aside stack">
          <Card>
            <CardTitle>Customer</CardTitle>
            <Kv label="Name" value={order.customer.name} />
            <Kv label="Address" value={order.address} />
            <Kv label="Door notes" value={order.doorNotes || "—"} />
            <Kv label="Card" value={`${order.card.brand} •••• ${order.card.last4} (saved)`} />
          </Card>
          <Card variant="sub">
            <div className="row sb">
              <CardTitle>Internal only</CardTitle>
              <span className="badge warn">Never shown to customers</span>
            </div>
            <Kv label="Partner" value={partner ? `${partner.label} · Zone ${order.zoneId}` : "Not routed"} />
            <Kv label="Trips" value={`Trip 1: ${driver(order.trips.pickup)} · Trip 2: ${driver(order.trips.return)}`} />
            <Kv label="Tag" value={order.tag ?? "—"} />
          </Card>
          <Card>
            <CardTitle>Actions</CardTitle>
            <div className="opts" style={{ marginTop: 12 }}>
              <Link className="opt" href={`/ops/orders/${order.id}/handoff`}>
                Record handoff
              </Link>
              <Link className="opt" href={`/ops/orders/${order.id}/weigh-in`}>
                Weigh-in
              </Link>
              <Link className="opt" href="/ops/dispatch">
                Assign trip
              </Link>
              <Link className="opt" href="/ops/claims">
                Refund
              </Link>
              <a className="opt" href={`sms:${order.customer.phone}`}>
                Message customer
              </a>
            </div>
            {order.status === "weighed" && (
              <ButtonLink href={`/ops/orders/${order.id}/weigh-in`} block style={{ marginTop: 18 }}>
                Review and charge
              </ButtonLink>
            )}
          </Card>
        </div>
      </div>
    </>
  );
}
