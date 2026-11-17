import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { WeighInForm } from "@/components/ops/weigh-in-form";
import { getOrder, getPriceBook } from "@/lib/api";

export const metadata: Metadata = { title: "Weigh-in" };

/** A7 · Weigh-in and charge */
export default async function WeighInPage({ params }: { params: { id: string } }) {
  const [order, book] = await Promise.all([getOrder(params.id), getPriceBook()]);
  if (!order) notFound();
  return (
    <>
      <div className="chead">
        <h1>Weigh-in · {order.number}</h1>
        <Link className="btn g" href={`/ops/orders/${order.id}`} style={{ padding: "12px 22px" }}>
          Back
        </Link>
      </div>
      <WeighInForm order={order} book={book} />
    </>
  );
}
