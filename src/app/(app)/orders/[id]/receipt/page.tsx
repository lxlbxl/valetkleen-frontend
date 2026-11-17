import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PrintButton } from "@/components/orders/print-button";
import { PageHeader } from "@/components/site/page-header";
import { Card, Kv } from "@/components/ui/primitives";
import { getOrder } from "@/lib/api";
import { longDate, money } from "@/lib/format";

export const metadata: Metadata = { title: "Receipt" };

export default async function ReceiptPage({ params }: { params: { id: string } }) {
  const order = await getOrder(params.id);
  if (!order?.final?.chargedAt) notFound();
  const f = order.final;
  return (
    <>
      <PageHeader back={{ href: `/orders/${order.id}`, label: "Order" }} eyebrow="Receipt" title={`Order ${order.number}`} lead={`Charged ${longDate(f.chargedAt!)}`} />
      <main id="main" className="wrap main-pad">
        <Card style={{ maxWidth: 640 }}>
          <Kv label="Customer" value={order.customer.name} />
          <Kv label="Address" value={order.address} />
          <Kv label="Weight and count" value={`${f.weightLbs} lbs · ${f.itemCount} items`} />
          {order.lines.map((l) => (
            <Kv key={l.label} label={`${l.qty} × ${l.label}`} value={money(l.qty * l.unit)} />
          ))}
          <Kv label="Pickup and delivery" value={order.estimate.delivery ? money(order.estimate.delivery) : "Free"} />
          <Kv total label={`${order.card.brand} •••• ${order.card.last4}`} value={money(f.total)} />
          <PrintButton />
        </Card>
      </main>
    </>
  );
}
