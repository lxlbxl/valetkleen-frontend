import type { Metadata } from "next";
import Link from "next/link";
import { BoardFilters } from "@/components/ops/board-filters";
import { listDrivers, listOrders, listZones } from "@/lib/api";
import { dayLabel, windowLabel } from "@/lib/format";
import { BOARD_COLUMNS } from "@/lib/status";
import type { Order } from "@/lib/types";

export const metadata: Metadata = { title: "Order board" };

/** A3 · Order board */
export default async function OrderBoard({ searchParams }: { searchParams: { zone?: string; q?: string } }) {
  const [orders, drivers, zones] = await Promise.all([listOrders({ zoneId: searchParams.zone }), listDrivers(), listZones()]);
  const q = (searchParams.q ?? "").trim().toLowerCase();
  const shown = q ? orders.filter((o) => [o.number, o.tag ?? "", o.customer.name, o.address].some((s) => s.toLowerCase().includes(q))) : orders;
  const driverName = (id: string | null) => drivers.find((d) => d.id === id)?.name;

  const sub = (o: Order) => {
    switch (o.status) {
      case "booked":
        return `${dayLabel(o.pickupWindow.date)} ${windowLabel(o.pickupWindow)}${o.trips.pickup ? "" : " · No driver"}`;
      case "driver_en_route":
      case "picked_up":
        return `Trip 1 · ${driverName(o.trips.pickup) ?? "unassigned"}`;
      case "weighed":
        return "Weighed · to charge";
      case "at_partner":
        return "Cleaning";
      case "charged":
        return o.trips.return ? `Trip 2 · ${driverName(o.trips.return)}` : "Ready · no Trip 2";
      case "out_for_delivery":
        return `Trip 2 · ${driverName(o.trips.return) ?? "unassigned"}`;
      case "delivered":
        return o.handoffs.some((h) => h.type === "delivered") ? "Photo ✓" : "Delivered";
      default:
        return o.status;
    }
  };

  return (
    <>
      <div className="chead">
        <h1>Order board</h1>
        <BoardFilters zones={zones.filter((z) => z.live).map((z) => ({ id: z.id, name: z.name }))} />
      </div>
      {q && (
        <p className="mut" style={{ marginBottom: 16 }}>
          {shown.length} result{shown.length === 1 ? "" : "s"} for “{searchParams.q}”. <Link className="lnk" href="/ops/orders">Clear</Link>
        </p>
      )}
      <div className="cols">
        {BOARD_COLUMNS.map((c) => {
          const list = shown.filter((o) => c.statuses.includes(o.status));
          return (
            <section className="col" key={c.title} aria-label={c.title}>
              <h4>
                {c.title} <b>{list.length}</b>
              </h4>
              {list.map((o) => (
                <Link key={o.id} className="kc" href={`/ops/orders/${o.id}`} style={o.status === "booked" && !o.trips.pickup ? { borderColor: "#e8a317" } : undefined}>
                  <b>{o.number}</b>
                  {sub(o)}
                </Link>
              ))}
              {list.length === 0 && <p className="mut" style={{ padding: "0 4px" }}>None</p>}
            </section>
          );
        })}
      </div>
    </>
  );
}
