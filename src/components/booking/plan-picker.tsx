"use client";

import { moneyShort } from "@/lib/format";
import { DEFAULT_PRICE_BOOK } from "@/lib/pricing";
import type { PlanId } from "@/lib/types";
import { cn } from "@/lib/cn";

const book = DEFAULT_PRICE_BOOK;

export const PLANS: { id: PlanId; name: string; price: string; unit: string; text: string }[] = [
  { id: "pass", name: "ValetKleen Pass", price: moneyShort(book.pass.monthly), unit: "/mo", text: `Up to ${book.pass.pickups} pickups a month. Delivery included. ${book.pass.minBags}-bag minimum. Extra pickups ${moneyShort(book.pass.extraPickup)}.` },
  { id: "family", name: "Family plan", price: moneyShort(book.family.monthly), unit: "/mo", text: `${book.family.bags} bags a month, collected in ${book.family.pickups} pickups. Delivery included.` },
  { id: "per_order", name: "Pay per order", price: moneyShort(book.deliveryFee), unit: "delivery", text: `Delivery per order. Free from ${moneyShort(book.freeDeliveryFrom)}.` },
];

/** Three plan cards (C6). `suggested` shows the AI plan suggestion badge. */
export function PlanPicker({ value, onChange, suggested }: { value: PlanId; onChange: (p: PlanId) => void; suggested?: PlanId }) {
  return (
    <div className="grid3" role="radiogroup" aria-label="Plan" style={{ marginTop: 36, alignItems: "stretch" }} data-stg>
      {PLANS.map((p) => (
        <button
          key={p.id}
          type="button"
          role="radio"
          aria-checked={value === p.id}
          className={cn("card opt", value === p.id && "on")}
          style={{ padding: 30, cursor: "pointer", textAlign: "left" }}
          onClick={() => onChange(p.id)}
        >
          {suggested === p.id ? <span className="badge ok">Suggested</span> : <span style={{ display: "block", height: 22 }} />}
          <h2 className="s" style={{ marginTop: 16 }}>
            {p.name}
          </h2>
          <p style={{ font: "var(--hw) 42px/1 var(--hf)", color: "var(--hc)", margin: "14px 0" }}>
            {p.price}
            <small style={{ font: "400 14px var(--font-inter)" }}> {p.unit}</small>
          </p>
          <p className="mut">{p.text}</p>
        </button>
      ))}
    </div>
  );
}
