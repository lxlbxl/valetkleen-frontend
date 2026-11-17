import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ButtonLink, Card, CardTitle, Kv } from "@/components/ui/primitives";
import { getOrder } from "@/lib/api";
import { dayLabel, money, windowLabel } from "@/lib/format";

export const metadata: Metadata = { title: "Booking confirmed" };

/** C8 · Booking confirmed */
export default async function ConfirmedPage({ searchParams }: { searchParams: { order?: string } }) {
  const order = searchParams.order ? await getOrder(searchParams.order) : null;
  if (!order) notFound();
  return (
    <main id="main" className="wrap main-pad" style={{ paddingTop: 80 }}>
      <div style={{ textAlign: "center", maxWidth: 680, margin: "0 auto" }}>
        <div
          aria-hidden="true"
          style={{ width: 84, height: 84, margin: "0 auto 26px", borderRadius: "50%", background: "var(--ac)", display: "grid", placeItems: "center", fontSize: 40, color: "#10324A", boxShadow: "0 0 0 14px var(--ring)" }}
        >
          ✓
        </div>
        <div className="eyebrow" style={{ justifyContent: "center" }}>
          Booked
        </div>
        <h1 className="t">
          Your pickup is <em>booked</em>.
        </h1>
        <p className="lead" style={{ marginLeft: "auto", marginRight: "auto" }}>
          Order {order.number}. A confirmation is on its way by email and text.
        </p>
      </div>
      <div className="grid2" style={{ marginTop: 44 }} data-stg>
        <Card>
          <Kv label="Pickup" value={`${dayLabel(order.pickupWindow.date)} · ${windowLabel(order.pickupWindow)}`} />
          <Kv label="Address" value={order.address} />
          <Kv label="Estimated total" value={money(order.estimate.total)} />
          <div className="row" style={{ marginTop: 22 }}>
            <ButtonLink href={`/orders/${order.id}`}>Track my order</ButtonLink>
            <ButtonLink variant="g" href={`/orders/${order.id}#manage`}>
              Change or cancel
            </ButtonLink>
          </div>
        </Card>
        <Card variant="sub">
          <CardTitle>What happens next</CardTitle>
          {["Driver collects your clothes in a ValetKleen bag", "We clean and weigh them", "Delivered back, charged after weigh-in"].map((s, i) => (
            <div key={s} className="kv" style={{ justifyContent: "flex-start", gap: 18 }}>
              <span style={{ color: "var(--ac2)", fontWeight: 700 }}>{i + 1}</span>
              <b style={{ fontWeight: 500 }}>{s}</b>
            </div>
          ))}
        </Card>
      </div>
    </main>
  );
}
