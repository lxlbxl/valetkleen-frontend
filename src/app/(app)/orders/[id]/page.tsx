import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CancelOrder } from "@/components/orders/cancel-order";
import { RateOrder } from "@/components/orders/rate-order";
import { PageHeader } from "@/components/site/page-header";
import { ButtonLink, Card, CardTitle, Kv, Photo, Timeline } from "@/components/ui/primitives";
import { getOrder, getPriceBook } from "@/lib/api";
import { dayLabel, longDate, money, timeOf, windowLabel } from "@/lib/format";
import { CUSTOMER_STEPS, stepIndex } from "@/lib/status";
import type { Order } from "@/lib/types";

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const o = await getOrder(params.id);
  return { title: o ? `Order ${o.number}` : "Order" };
}

/**
 * One page per order whose content follows its status:
 *   booked / driver_en_route / picked_up / at_partner / weighed → C9 tracking
 *   charged / out_for_delivery                                  → C10 weighed and charged
 *   delivered                                                   → C11 delivered and rate
 */
export default async function OrderPage({ params }: { params: { id: string } }) {
  const [order, book] = await Promise.all([getOrder(params.id), getPriceBook()]);
  if (!order) notFound();

  const idx = stepIndex(order.status);
  const steps = CUSTOMER_STEPS.map((s, i) => ({
    label: s.label,
    state: (order.status === "delivered" || i < idx ? "done" : i === idx ? "now" : "todo") as "done" | "now" | "todo",
    detail: i === idx && s.key === "driver_en_route" ? "Your ValetKleen driver" : undefined,
  }));

  if (order.status === "delivered") return <Delivered order={order} steps={steps} />;
  if (order.status === "charged" || order.status === "out_for_delivery") return <Charged order={order} bagPrice={book.bagPrice} steps={steps} />;
  if (order.status === "cancelled")
    return (
      <>
        <PageHeader back={{ href: "/orders", label: "Orders" }} eyebrow={`Order ${order.number}`} title="This order was cancelled." lead="You were not charged." />
        <main id="main" className="wrap main-pad">
          <ButtonLink href="/book">Book a new pickup</ButtonLink>
        </main>
      </>
    );

  const head = HEADLINES[order.status] ?? HEADLINES.booked!;
  return (
    <>
      <PageHeader
        back={{ href: "/orders", label: "Orders" }}
        eyebrow={`Order ${order.number}`}
        title={head.title}
        lead={order.status === "driver_en_route" && order.eta ? `Arriving ${order.eta}.` : head.lead(order)}
        photo={{ src: "/img/handoff.webp", caption: "Your valet, on the way" }}
      />
      <main id="main" className="wrap main-pad">
        <div className="split">
          <div className="stack" data-stg>
            <Card style={{ padding: 0, overflow: "hidden" }}>
              <RouteMap moving={order.status === "driver_en_route"} />
              <div className="row sb" style={{ padding: "22px 28px" }}>
                <div>
                  <b style={{ color: "var(--hc)" }}>{order.status === "driver_en_route" && order.eta ? `Driver arriving ${order.eta}` : `Pickup ${dayLabel(order.pickupWindow.date)} · ${windowLabel(order.pickupWindow)}`}</b>
                  <div className="mut">Your ValetKleen driver</div>
                </div>
                <ButtonLink variant="g" href="/help#contact">
                  Message ValetKleen
                </ButtonLink>
              </div>
            </Card>
            <Card>
              <CardTitle>Your order</CardTitle>
              {order.lines.map((l) => (
                <Kv key={l.label} label={`${l.qty} × ${l.label}`} value={money(l.unit * l.qty)} />
              ))}
              <Kv label="Pickup and delivery" value={order.estimate.delivery ? money(order.estimate.delivery) : "Free"} />
              <Kv total label="Estimated total" value={money(order.estimate.total)} />
              <p className="mut" style={{ marginTop: 8 }}>
                Charged to {order.card.brand} {order.card.last4} after weigh-in.
              </p>
            </Card>
            {order.status === "booked" && (
              <Card variant="sub" id="manage">
                <CardTitle>Change or cancel</CardTitle>
                <p className="mut">You can cancel free of charge until the driver is on the way.</p>
                <div className="row" style={{ marginTop: 16 }}>
                  <ButtonLink variant="g" href="/help#contact">
                    Change pickup time
                  </ButtonLink>
                  <CancelOrder orderId={order.id} />
                </div>
              </Card>
            )}
          </div>
          <aside className="aside card">
            <CardTitle>Status</CardTitle>
            <Timeline steps={steps} />
          </aside>
        </div>
      </main>
    </>
  );
}

const HEADLINES: Partial<Record<Order["status"], { title: React.ReactNode; lead: (o: Order) => string }>> = {
  booked: {
    title: (
      <>
        Your pickup is <em>booked</em>.
      </>
    ),
    lead: (o) => `${dayLabel(o.pickupWindow.date)} · ${windowLabel(o.pickupWindow)}. We will text you when the driver is on the way.`,
  },
  driver_en_route: {
    title: (
      <>
        Your driver is <em>on the way</em>.
      </>
    ),
    lead: () => "Arriving within your window.",
  },
  picked_up: {
    title: (
      <>
        Collected. <em>In good hands.</em>
      </>
    ),
    lead: () => "Your bag is on its way to be cleaned.",
  },
  at_partner: {
    title: (
      <>
        ValetKleen is <em>cleaning it</em>.
      </>
    ),
    lead: () => "Typically 24–48 hours. We weigh and count everything before we charge.",
  },
  weighed: {
    title: (
      <>
        Weighed and <em>counted</em>.
      </>
    ),
    lead: () => "We are confirming the final price. You will get a receipt as soon as it is charged.",
  },
};

function RouteMap({ moving }: { moving: boolean }) {
  return (
    <div className="ph map" style={{ minHeight: 260, border: 0, borderRadius: 0, padding: 0 }} role="img" aria-label="Map of your driver's route">
      <svg viewBox="0 0 600 260" preserveAspectRatio="xMidYMid slice" style={{ position: "absolute", inset: 0, width: "100%", height: "100%", stroke: "none", margin: 0 }}>
        <path d="M0 200C100 190 130 90 240 120S400 170 600 60" stroke="#ffffff" strokeOpacity=".5" strokeWidth="22" fill="none" />
        <path d="M0 60C120 90 200 230 360 200S520 120 600 170" stroke="#ffffff" strokeOpacity=".3" strokeWidth="12" fill="none" />
        <path d="M0 200C100 190 130 90 240 120S300 130 330 125" stroke="#36C5CC" strokeWidth="4" strokeDasharray="3 10" strokeLinecap="round" fill="none" />
      </svg>
      <div style={{ position: "absolute", left: "52%", top: "42%", width: 48, height: 48, borderRadius: "50%", background: "#005C9F", display: "grid", placeItems: "center", boxShadow: moving ? "0 0 0 12px #005c9f40" : "none" }}>
        <Image src="/brand/van.png" alt="" width={28} height={13} style={{ filter: "brightness(0) invert(1)" }} />
      </div>
      {/* TODO(backend): replace with Google Maps once live driver location is available. */}
    </div>
  );
}

type Steps = { label: string; state: "done" | "now" | "todo" }[];

function Charged({ order, bagPrice, steps }: { order: Order; bagPrice: number; steps: Steps }) {
  const f = order.final!;
  const bags = Math.max(1, Math.round((f.total - order.estimate.delivery) / bagPrice));
  return (
    <>
      <PageHeader
        back={{ href: "/orders", label: "Orders" }}
        eyebrow={`Order ${order.number}`}
        title={
          <>
            Your order is <em>weighed</em>.
          </>
        }
        lead={order.status === "out_for_delivery" ? "Charged. Receipt sent. Your order is on its way back." : "Charged. Receipt sent. Your order is ready to return."}
        photo={{ src: "/img/pressing.webp", caption: "Weighed, cleaned, pressed" }}
      />
      <main id="main" className="wrap main-pad">
        <div className="split">
          <div className="stack" data-stg>
            <Card>
              <div className="row sb">
                <CardTitle>Receipt</CardTitle>
                <span className="badge ok">✓ Charged</span>
              </div>
              <Kv label="Weight" value={`${f.weightLbs} lbs · ${f.itemCount} items`} />
              <Kv label={`${bags} Standard Bag${bags > 1 ? "s" : ""}`} value={money(bags * bagPrice)} />
              {order.estimate.items > 0 && <Kv label="Dry-cleaning items" value={money(order.estimate.items)} />}
              <Kv label="Delivery" value={order.estimate.delivery ? money(order.estimate.delivery) : "Free"} />
              <Kv total label={`Charged to ${order.card.brand} ${order.card.last4}`} value={money(f.total)} />
              {f.total === order.estimate.total ? (
                <p className="mut">Same as your estimate.</p>
              ) : (
                <p className="mut">Your estimate was {money(order.estimate.total)}. The final price follows the weight and count above.</p>
              )}
              <div className="row" style={{ marginTop: 20 }}>
                <ButtonLink href="#status">Track delivery →</ButtonLink>
                <ButtonLink variant="g" href={`/orders/${order.id}/receipt`}>
                  View receipt
                </ButtonLink>
              </div>
            </Card>
            <Card variant="sub">
              <Kv label="Delivery window" value={order.deliveryWindow ? `${dayLabel(order.deliveryWindow.date)} · ${windowLabel(order.deliveryWindow)}` : "We will text you"} />
            </Card>
            <Photo src="/img/studio-fold.webp" caption="Photo of your folded order" height={220} />
          </div>
          <aside className="aside card" id="status">
            <CardTitle>Status</CardTitle>
            <Timeline steps={steps} />
          </aside>
        </div>
      </main>
    </>
  );
}

function Delivered({ order, steps }: { order: Order; steps: Steps }) {
  const proof = order.handoffs.find((h) => h.type === "delivered");
  return (
    <>
      <PageHeader
        back={{ href: "/orders", label: "Orders" }}
        eyebrow={`Order ${order.number}`}
        title={<em>Delivered.</em>}
        lead={proof ? `Delivered ${longDate(proof.at)}, ${timeOf(proof.at)}.` : "Your order was delivered."}
        photo={{ src: "/img/family-home.webp", caption: "Delivered. Evening back." }}
      />
      <main id="main" className="wrap main-pad">
        <div className="split">
          <div className="stack" data-stg>
            <Photo src={proof?.photoUrl ?? null} caption="Proof of delivery photo" height={240} />
            <Card variant="sub">
              <div className="row sb">
                <span className="mut">Something not right?</span>
                <Link className="lnk" href={`/orders?report=${order.id}#report`}>
                  Report a problem
                </Link>
              </div>
            </Card>
            {order.final && (
              <Card>
                <Kv label="Charged" value={money(order.final.total)} />
                <Kv label="Weight" value={`${order.final.weightLbs} lbs · ${order.final.itemCount} items`} />
              </Card>
            )}
          </div>
          <aside className="aside">
            <RateOrder orderId={order.id} existing={order.rating} />
            <details className="card sub" style={{ marginTop: 18 }}>
              <summary className="mut" style={{ cursor: "pointer" }}>
                Order timeline
              </summary>
              <Timeline steps={steps} />
            </details>
          </aside>
        </div>
      </main>
    </>
  );
}
