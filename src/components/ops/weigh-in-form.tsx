"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { PhotoInput } from "@/components/ui/controls";
import { Field } from "@/components/ui/primitives";
import { submitWeighIn } from "@/lib/api/actions";
import { money } from "@/lib/format";
import type { Order, PriceBook } from "@/lib/types";

/** Contribution floor used for the margin check. TODO(backend): read from the pricing engine. */
const MARGIN_FLOOR = 800;
const PARTNER_RATE = 110;
const TRIP_COST = 880;

export function WeighInForm({ order, book }: { order: Order; book: PriceBook }) {
  const router = useRouter();
  const [weight, setWeight] = useState(order.final ? String(order.final.weightLbs) : "");
  const [count, setCount] = useState(order.final ? String(order.final.itemCount) : "");
  const [notes, setNotes] = useState("");
  const [busy, setBusy] = useState<"" | "charge" | "hold">("");
  const [error, setError] = useState("");

  const lbs = Number(weight);
  const calc = useMemo(() => {
    if (!lbs || lbs <= 0) return null;
    const bags = Math.max(1, Math.ceil(lbs / book.bagMaxLbs));
    const sub = bags * book.bagPrice + order.estimate.items + order.estimate.express;
    const delivery = sub >= book.freeDeliveryFrom ? 0 : book.deliveryFee;
    const total = sub + delivery;
    const fee = Math.round(total * 0.029 + 30);
    const contribution = total - Math.round(lbs * PARTNER_RATE) - 2 * TRIP_COST - fee;
    return { bags, sub, delivery, total, contribution, ok: contribution >= MARGIN_FLOOR };
  }, [lbs, book, order.estimate]);

  async function submit(charge: boolean) {
    if (!calc) return setError("Enter the weight from the partner.");
    if (!Number(count)) return setError("Enter the item count.");
    setError("");
    setBusy(charge ? "charge" : "hold");
    await submitWeighIn(order.id, { weightLbs: lbs, itemCount: Number(count), notes, charge });
    router.push(`/ops/orders/${order.id}`);
    router.refresh();
  }

  return (
    <div className="split" style={{ marginTop: 0 }}>
      <div className="stack" data-stg>
        <div className="card">
          <div className="grid2">
            <Field label="Weight (lbs)" htmlFor="wi-w">
              <input id="wi-w" inputMode="decimal" value={weight} onChange={(e) => setWeight(e.target.value.replace(/[^\d.]/g, ""))} />
            </Field>
            <Field label="Items counted" htmlFor="wi-c">
              <input id="wi-c" inputMode="numeric" value={count} onChange={(e) => setCount(e.target.value.replace(/\D/g, ""))} />
            </Field>
          </div>
          <div className="field">
            <span style={{ display: "block", fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--mut)", marginBottom: 8, fontWeight: 600 }}>Inspection photos</span>
            <PhotoInput label="Upload or take photos" />
          </div>
          <Field label="Notes from partner" htmlFor="wi-n">
            <textarea id="wi-n" placeholder="e.g. Stain on grey sweater, treated" value={notes} onChange={(e) => setNotes(e.target.value)} />
          </Field>
        </div>
      </div>
      <aside className="aside card">
        <h2 className="s">Price</h2>
        <div className="kv">
          <span>
            {calc?.bags ?? 1} Standard Bag{(calc?.bags ?? 1) > 1 ? "s" : ""} (≤ {book.bagMaxLbs} lbs each)
          </span>
          <b>{money((calc?.bags ?? 1) * book.bagPrice)}</b>
        </div>
        {order.estimate.items > 0 && (
          <div className="kv">
            <span>Dry-cleaning items</span>
            <b>{money(order.estimate.items)}</b>
          </div>
        )}
        <div className="kv">
          <span>Pickup and delivery</span>
          <b>{calc ? (calc.delivery ? money(calc.delivery) : "Free") : "—"}</b>
        </div>
        <div className="kv">
          <span>Estimate at checkout</span>
          <b>{money(order.estimate.total)}</b>
        </div>
        <div className="kv tot">
          <span>Final total</span>
          <b>{calc ? money(calc.total) : "—"}</b>
        </div>
        {calc && (
          <p role="status" className="mut" style={{ color: calc.ok ? "#7fe0e0" : "#ffd27a" }}>
            {calc.total === order.estimate.total ? "✓ Same as estimate" : `Differs from estimate by ${money(Math.abs(calc.total - order.estimate.total))}`} ·{" "}
            {calc.ok ? "margin check passed" : `below margin floor (${money(calc.contribution)} contribution)`}
          </p>
        )}
        {error && (
          <p role="alert" style={{ color: "#ff9b93", fontSize: 14, marginTop: 10 }}>
            {error}
          </p>
        )}
        <button className="btn p block" style={{ marginTop: 16 }} disabled={!!busy || !calc} onClick={() => submit(true)}>
          {busy === "charge" ? "Charging…" : `Confirm and charge ${order.card.brand} ${order.card.last4}`}
        </button>
        <button className="btn g block" style={{ marginTop: 10 }} disabled={!!busy} onClick={() => submit(false)}>
          {busy === "hold" ? "Saving…" : "Hold and contact customer"}
        </button>
      </aside>
    </div>
  );
}
