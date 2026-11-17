import type { Metadata } from "next";
import Link from "next/link";
import { Icon, type IconName } from "@/components/ui/icons";
import { ButtonLink, Card, CardTitle } from "@/components/ui/primitives";
import { opsDashboard } from "@/lib/api";

export const metadata: Metadata = { title: "Today" };

/** A2 · Today dashboard */
export default async function OpsDashboard() {
  const { stats, alerts } = await opsDashboard();
  const today = new Date().toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", timeZone: "America/New_York" });
  const tiles: { n: number; label: string; icon: IconName; href: string }[] = [
    { n: stats.ordersToday, label: "Orders today", icon: "orders", href: "/ops/orders" },
    { n: stats.awaitingPickup, label: "Awaiting pickup", icon: "dispatch", href: "/ops/dispatch" },
    { n: stats.atPartner, label: "At partner", icon: "partners", href: "/ops/orders" },
    { n: stats.readyToReturn, label: "Ready to return", icon: "bag", href: "/ops/dispatch?tab=returns" },
  ];
  return (
    <>
      <div className="chead">
        <h1>Today · {today}</h1>
        <ButtonLink href="/book" style={{ padding: "12px 22px" }}>
          New order
        </ButtonLink>
      </div>
      <div className="grid4" data-stg>
        {tiles.map((t) => (
          <Link key={t.label} href={t.href} className="card stat">
            <span className="si">
              <Icon name={t.icon} />
            </span>
            <b>{t.n}</b>
            <span>{t.label}</span>
          </Link>
        ))}
      </div>
      <Card style={{ marginTop: 22 }}>
        <CardTitle>Needs attention</CardTitle>
        <ul className="list-reset">
          {alerts.map((a) => (
            <li className="alert" key={a.text}>
              <span>{a.text}</span>
              <Link className="lnk" href={a.href}>
                {a.action}
              </Link>
            </li>
          ))}
        </ul>
      </Card>
    </>
  );
}
