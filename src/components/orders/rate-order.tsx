"use client";

import Link from "next/link";
import { useState } from "react";
import { Stars } from "@/components/ui/controls";
import { rateOrder } from "@/lib/api/actions";

export function RateOrder({ orderId, existing }: { orderId: string; existing: { order: number; driver: number; comment: string } | null }) {
  const [order, setOrder] = useState(existing?.order ?? 0);
  const [driver, setDriver] = useState(existing?.driver ?? 0);
  const [comment, setComment] = useState(existing?.comment ?? "");
  const [state, setState] = useState<"idle" | "saving" | "done">(existing ? "done" : "idle");

  if (state === "done")
    return (
      <div className="card">
        <h2 className="s">Thank you.</h2>
        <p className="mut">Your rating helps us keep every order to the ValetKleen standard.</p>
        <Link className="btn p block" href="/book" style={{ marginTop: 20 }}>
          Book again
        </Link>
      </div>
    );

  return (
    <form
      className="card"
      onSubmit={async (e) => {
        e.preventDefault();
        setState("saving");
        await rateOrder(orderId, { order, driver, comment });
        setState("done");
      }}
    >
      <h2 className="s">How was your order?</h2>
      <Stars label="Rate your order" value={order} onChange={setOrder} />
      <div className="field">
        <label htmlFor="rate-comment">Add a comment (optional)</label>
        <textarea id="rate-comment" maxLength={600} value={comment} onChange={(e) => setComment(e.target.value)} />
      </div>
      <h2 className="s" style={{ marginTop: 22 }}>
        How was your driver?
      </h2>
      <Stars label="Rate your driver" value={driver} onChange={setDriver} />
      <button className="btn p block" style={{ marginTop: 22 }} disabled={!order || state === "saving"}>
        {state === "saving" ? "Sending…" : "Submit and book again"}
      </button>
    </form>
  );
}
