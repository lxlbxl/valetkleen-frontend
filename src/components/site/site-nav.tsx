"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/icons";
import { cn } from "@/lib/cn";

const LINKS = [
  { href: "/", label: "Home", match: (p: string) => p === "/" },
  { href: "/orders", label: "Orders", match: (p: string) => p.startsWith("/orders") },
  { href: "/plans", label: "Plans", match: (p: string) => p.startsWith("/plans") },
  { href: "/account", label: "Account", match: (p: string) => p.startsWith("/account") },
];

export function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => setOpen(false), [pathname]);

  return (
    <nav className="nav site" aria-label="Main">
      <Link href="/" aria-label="ValetKleen home">
        <Image className="lw" src="/brand/logo-white.png" alt="ValetKleen" width={158} height={24} priority />
      </Link>
      <span className="sp" />
      <div className={cn("navlinks", open && "open")} id="site-menu">
        {LINKS.map((l) => (
          <Link key={l.href} className={cn("l", l.match(pathname) && "on")} href={l.href} aria-current={l.match(pathname) ? "page" : undefined}>
            {l.label}
          </Link>
        ))}
      </div>
      <Link className="btn p" href="/book">
        Book a pickup
      </Link>
      <button type="button" className="menu-btn" aria-expanded={open} aria-controls="site-menu" aria-label={open ? "Close menu" : "Open menu"} onClick={() => setOpen((o) => !o)}>
        <Icon name={open ? "close" : "menu"} width={22} height={22} />
      </button>
    </nav>
  );
}
