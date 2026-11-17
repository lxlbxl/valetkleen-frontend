"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Note } from "@/components/ui/primitives";
import { applyPromo, createBooking, getPickupWindows } from "@/lib/api/actions";
import { dayLabel, money, windowLabel } from "@/lib/format";
import { getCatalogItem } from "@/lib/pricing";
import type { PickupWindow } from "@/lib/types";
import { useBooking } from "./booking-store";
import { PLANS } from "./plan-picker";

/** C7 · Checkout. Card is saved now and charged after weigh-in (Stripe SetupIntent in the backend). */
export function CheckoutStep() {
  const router = useRouter();
  const { draft, totals, update, reset, ready } = useBooking();
  const [win, setWin] = useState<PickupWindow | null>(null);
  const [promo, setPromo] = useState(draft.promoCode);
  const [promoMsg, setPromoMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (ready) getPickupWindows(draft.zip).then((ws) => setWin(ws.find((w) => w.id === draft.windowId) ?? null));
  }, [ready, draft.zip, draft.windowId]);

  const missing = !draft.windowId || !draft.address;
  const plan = PLANS.find((p) => p.id === draft.plan);

  async function book() {
    setSubmitting(true);
    setError("");
    try {
      const { orderId } = await createBooking(draft);
      reset();
      router.push(`/book/confirmed?order=${orderId}`);
    } catch {
      setError("We could not book this pickup. Please try again.");
      setSubmitting(false);
    }
  }

  return (
    <div className="split">
      <div className="stack" data-stg>
        <div className="card">
          <div className="row sb">
            <h2 className="s">Pickup</h2>
            <Link className="lnk" href="/book/pickup">
              Change
            </Link>
          </div>
          <div className="kv">
            <span>When</span>
            <b>{win ? `${dayLabel(win.date)} · ${windowLabel(win)}` : "Not chosen"}</b>
          </div>
          <div className="kv">
            <span>Where</span>
            <b>{draft.address || "Not entered"}</b>
          </div>
          {draft.doorNotes && (
            <div className="kv">
              <span>Door notes</span>
              <b>{draft.doorNotes}</b>
            </div>
          )}
        </div>

        <div className="card">
          <h2 className="s">Card</h2>
          {/* TODO(backend): mount Stripe Payment Element (SetupIntent) here. */}
          <div className="kv">
            <span>Visa •••• 4242</span>
            <span className="badge ok">Saved</span>
          </div>
          <div className="field">
            <label htmlFor="promo">Promo or referral code</label>
            <div className="row">
              <input id="promo" style={{ flex: 1, width: "auto" }} placeholder="Enter code" value={promo} onChange={(e) => setPromo(e.target.value)} />
              <button
                type="button"
                className="btn g"
                disabled={!promo.trim()}
                onClick={async () => {
                  const r = await applyPromo(promo);
                  setPromoMsg({ ok: r.valid, text: r.message });
                  if (r.valid) update({ promoCode: promo.trim().toUpperCase() });
                }}
              >
                Add
              </button>
            </div>
            {promoMsg && (
              <p role="status" style={{ marginTop: 8, fontSize: 13, color: promoMsg.ok ? "#7fe0e0" : "#ff9b93" }}>
                {promoMsg.text}
              </p>
            )}
          </div>
        </div>

        <Note>
          <b style={{ color: "var(--hc)" }}>You will not be charged yet.</b> We charge your card after your bag is weighed and counted, and send you a receipt.
        </Note>
      </div>

      <aside className="aside card">
        <h2 className="s">Order summary</h2>
        {draft.bags > 0 && (
          <div className="kv">
            <span>
              {draft.bags} Standard Bag{draft.bags > 1 ? "s" : ""} (up to 25 lbs)
            </span>
            <b>{money(totals.bags)}</b>
          </div>
        )}
        {Object.entries(draft.items).map(([id, qty]) => {
          const it = getCatalogItem(id);
          return it ? (
            <div className="kv" key={id}>
              <span>
                {qty} × {it.name}
              </span>
              <b>{money(it.priceMin * qty)}</b>
            </div>
          ) : null;
        })}
        {draft.express && (
          <div className="kv">
            <span>Express 24 hours</span>
            <b>{money(totals.express)}</b>
          </div>
        )}
        <div className="kv">
          <span>Pickup and delivery</span>
          <b>{totals.delivery ? money(totals.delivery) : "Free"}</b>
        </div>
        {plan && plan.id !== "per_order" && (
          <div className="kv">
            <span>{plan.name}</span>
            <b>
              {plan.price}
              {plan.unit}
            </b>
          </div>
        )}
        <div className="kv tot">
          <span>Estimated total</span>
          <b>{money(totals.total)}</b>
        </div>
        {error && (
          <p role="alert" style={{ color: "#ff9b93", fontSize: 14, marginTop: 8 }}>
            {error}
          </p>
        )}
        <button className="btn p block" style={{ marginTop: 14 }} disabled={missing || submitting} onClick={book}>
          {submitting ? (
            <>
              <span className="spin" aria-hidden="true" /> Booking…
            </>
          ) : (
            "Book my pickup"
          )}
        </button>
        {missing && (
          <p className="mut" style={{ marginTop: 10, textAlign: "center" }}>
            <Link className="lnk" href="/book/pickup">
              Choose a pickup window and address
            </Link>{" "}
            first.
          </p>
        )}
        <p className="mut" style={{ marginTop: 12, textAlign: "center" }}>
          By booking you agree to the{" "}
          <Link className="lnk" href="/terms">
            Terms
          </Link>
          .
        </p>
      </aside>
    </div>
  );
}
