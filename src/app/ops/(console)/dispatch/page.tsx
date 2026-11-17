import type { Metadata } from "next";
import { DispatchBoard } from "@/components/ops/dispatch-board";
import { listDrivers, listOrders } from "@/lib/api";

export const metadata: Metadata = { title: "Dispatch" };

/** A5 · Dispatch */
export default async function DispatchPage({ searchParams }: { searchParams: { tab?: string } }) {
  const [orders, drivers] = await Promise.all([listOrders(), listDrivers()]);
  const pickups = orders.filter((o) => o.status === "booked" || o.status === "driver_en_route");
  const returns = orders.filter((o) => o.status === "charged" || o.status === "out_for_delivery");
  return <DispatchBoard pickups={pickups} returns={returns} drivers={drivers} initialTab={searchParams.tab === "returns" ? "returns" : "pickups"} />;
}
