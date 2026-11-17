"use client";

import type { ReactNode } from "react";
import { money } from "@/lib/format";
import { useBooking } from "./booking-store";

export function EstimateCard({ children, withDelivery }: { children?: ReactNode; withDelivery?: boolean }) {
  const { totals, draft } = useBooking();
  return (
    <aside className="aside card" aria-label="Estimate">
      <h2 className="s">Estimate</h2>
      <div className="kv">
        <span>{draft.bags === 1 ? "1 Standard Bag" : `${draft.bags} Standard Bags`}</span>
        <b>{money(totals.bags)}</b>
      </div>
      <div className="kv">
        <span>Dry-cleaning items</span>
        <b>{money(totals.items)}</b>
      </div>
      <div className="kv">
        <span>Express</span>
        <b>{money(totals.express)}</b>
      </div>
      {withDelivery && (
        <div className="kv">
          <span>Pickup and delivery</span>
          <b>{totals.delivery === 0 ? "Free" : money(totals.delivery)}</b>
        </div>
      )}
      <div className="kv tot" aria-live="polite">
        <span>Estimate</span>
        <b>{money(withDelivery ? totals.total : totals.total - totals.delivery)}</b>
      </div>
      {children}
    </aside>
  );
}
