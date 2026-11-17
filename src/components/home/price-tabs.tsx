"use client";

import Image from "next/image";
import { useState } from "react";
import { priceRange } from "@/lib/format";
import type { CatalogItem } from "@/lib/types";
import { cn } from "@/lib/cn";

export interface PriceTab {
  key: string;
  label: string;
  count: number;
  items: CatalogItem[];
}

export function PriceTabs({ tabs }: { tabs: PriceTab[] }) {
  const [active, setActive] = useState(tabs[0]?.key);
  return (
    <div>
      <div className="tabs" role="tablist" aria-label="Price list">
        {tabs.map((t) => (
          <button
            key={t.key}
            role="tab"
            id={`tab-${t.key}`}
            aria-selected={active === t.key}
            aria-controls={`pane-${t.key}`}
            className={cn(active === t.key && "on")}
            onClick={() => setActive(t.key)}
          >
            {t.label}
            <small>{t.count} items</small>
          </button>
        ))}
      </div>
      {tabs.map((t) => (
        <div key={t.key} className="prows" role="tabpanel" id={`pane-${t.key}`} aria-labelledby={`tab-${t.key}`} hidden={active !== t.key}>
          {t.items.map((it) => (
            <div className="prow" key={it.id}>
              {it.image && <Image src={it.image} alt="" width={64} height={64} />}
              <b>{it.name}</b>
              <span className="ld" aria-hidden="true" />
              <span className="pz">{priceRange(it.priceMin, it.priceMax)}</span>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
