import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { HandoffForm } from "@/components/ops/handoff-form";
import { getOrder, listDrivers } from "@/lib/api";
import { longDate, timeOf } from "@/lib/format";
import type { HandoffType } from "@/lib/types";

export const metadata: Metadata = { title: "Record handoff" };

const LABEL: Record<HandoffType, string> = { pickup: "Pickup", partner_intake: "Partner intake", ready: "Ready", delivered: "Delivered" };

/** A6 · Record a handoff */
export default async function HandoffPage({ params }: { params: { id: string } }) {
  const [order, drivers] = await Promise.all([getOrder(params.id), listDrivers()]);
  if (!order) notFound();
  const next: HandoffType = !order.handoffs.some((h) => h.type === "pickup")
    ? "pickup"
    : !order.handoffs.some((h) => h.type === "partner_intake")
      ? "partner_intake"
      : !order.handoffs.some((h) => h.type === "ready")
        ? "ready"
        : "delivered";
  return (
    <>
      <div className="chead">
        <h1>Record handoff · {order.number}</h1>
        <Link className="btn g" href={`/ops/orders/${order.id}`} style={{ padding: "12px 22px" }}>
          Cancel
        </Link>
      </div>
      <div className="split" style={{ marginTop: 0 }}>
        <HandoffForm orderId={order.id} defaultType={next} defaultTag={order.tag ?? ""} people={[...drivers.map((d) => d.name), "Partner staff", "Customer"]} />
        <aside className="aside card">
          <h2 className="s">Log for this order</h2>
          <p className="mut">Entries cannot be edited, only corrected by a new entry.</p>
          {order.handoffs.length === 0 && <p className="mut" style={{ marginTop: 14 }}>No handoffs yet.</p>}
          {order.handoffs.map((h) => (
            <div className="item" key={h.id}>
              <div>
                <b>
                  {LABEL[h.type]} · {longDate(h.at)} {timeOf(h.at)}
                </b>
                <small>
                  Tag {h.tag} · photo {h.photoUrl ? "✓" : "missing"} · Source: {h.source.replace("_", " ")} · logged by {h.recordedBy}
                </small>
              </div>
            </div>
          ))}
        </aside>
      </div>
    </>
  );
}
