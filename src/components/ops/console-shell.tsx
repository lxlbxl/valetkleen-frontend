"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState, type ReactNode } from "react";
import { Icon, type IconName } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const NAV: { href: string; label: string; icon: IconName }[] = [
  { href: "/ops", label: "Dashboard", icon: "dashboard" },
  { href: "/ops/orders", label: "Orders", icon: "orders" },
  { href: "/ops/dispatch", label: "Dispatch", icon: "dispatch" },
  { href: "/ops/partners", label: "Partners", icon: "partners" },
  { href: "/ops/zones", label: "Zones", icon: "zones" },
  { href: "/ops/pricing", label: "Pricing", icon: "pricing" },
  { href: "/ops/claims", label: "Claims", icon: "claims" },
  { href: "/ops/payouts", label: "Payouts", icon: "payouts" },
];

export function ConsoleShell({ children, staff }: { children: ReactNode; staff: { name: string; role: string } }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [q, setQ] = useState("");
  useEffect(() => setOpen(false), [pathname]);
  const initials = staff.name.slice(0, 2).toUpperCase();
  const today = new Date().toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", timeZone: "America/New_York" });

  return (
    <div className="console">
      <div className="mtop">
        <button type="button" className="ib" aria-label="Open navigation" aria-expanded={open} onClick={() => setOpen(true)}>
          <Icon name="menu" />
        </button>
        <Image src="/brand/logo-white.png" alt="ValetKleen" width={132} height={20} />
        <span className="sp" />
        <span className="av">{initials}</span>
      </div>
      <aside className={cn("side", open && "open")} aria-label="Console">
        {open && (
          <button type="button" className="ib" aria-label="Close navigation" style={{ position: "absolute", right: 18, top: 18 }} onClick={() => setOpen(false)}>
            <Icon name="close" />
          </button>
        )}
        <Link href="/ops" aria-label="Console home">
          <Image src="/brand/logo-white.png" alt="ValetKleen" width={145} height={22} />
        </Link>
        <div className="sl">Operations</div>
        <nav>
          {NAV.map((n) => {
            const on = n.href === "/ops" ? pathname === "/ops" : pathname.startsWith(n.href);
            return (
              <Link key={n.href} href={n.href} className={cn(on && "on")} aria-current={on ? "page" : undefined}>
                <Icon name={n.icon} />
                {n.label}
              </Link>
            );
          })}
        </nav>
        <div className="who">
          <span className="av">{initials}</span>
          <span>
            <b>{staff.name}</b>
            <br />
            {staff.role} · audit log on
          </span>
        </div>
      </aside>
      <main id="main" className="cmain">
        <div className="topbar">
          <form
            className="srch"
            role="search"
            onSubmit={(e) => {
              e.preventDefault();
              router.push(`/ops/orders?q=${encodeURIComponent(q)}`);
            }}
          >
            <Icon name="search" />
            <label htmlFor="ops-search" className="sr-only">
              Search orders, tags, customers
            </label>
            <input id="ops-search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search orders, tags, customers" style={{ background: "transparent", border: 0, outline: 0, color: "inherit", font: "inherit", flex: 1, minWidth: 0 }} />
          </form>
          <span className="sp" />
          <span className="dchip">{today}</span>
          <Link className="ib" href="/ops" aria-label="Alerts">
            <Icon name="bell" />
            <i />
          </Link>
          <span className="av" aria-hidden="true">
            {initials}
          </span>
        </div>
        {children}
      </main>
    </div>
  );
}
