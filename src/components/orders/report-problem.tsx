"use client";

import { useState } from "react";
import { OptionGroup, PhotoInput } from "@/components/ui/controls";
import { Field } from "@/components/ui/primitives";
import { reportProblem } from "@/lib/api/actions";
import type { Claim } from "@/lib/types";

export function ReportProblem({ orders, initial }: { orders: { id: string; number: string }[]; initial?: string }) {
  const [orderId, setOrderId] = useState(initial && orders.some((o) => o.id === initial) ? initial : (orders[0]?.id ?? ""));
  const [kind, setKind] = useState<Claim["kind"]>("item_missing");
  const [details, setDetails] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [state, setState] = useState<"idle" | "saving" | "done">("idle");

  if (!orders.length) return null;

  return (
    <div className="card" id="report">
      <h2 className="s">Report a problem</h2>
      <p className="mut">Pick the order, choose what went wrong, add photos. We reply in the order.</p>
      {state === "done" ? (
        <p role="status" style={{ marginTop: 18, color: "var(--hc)" }}>
          Thanks. We have your report and will reply within one business day.
        </p>
      ) : (
        <form
          noValidate
          onSubmit={async (e) => {
            e.preventDefault();
            if (details.trim().length < 10) return setError("Tell us a little more (at least 10 characters).");
            setError("");
            setState("saving");
            // TODO(backend): upload `photos` to object storage and pass their keys.
            await reportProblem({ orderId, kind, details, photos: photos.length });
            setState("done");
          }}
        >
          <Field label="Order" htmlFor="rp-order">
            <select id="rp-order" value={orderId} onChange={(e) => setOrderId(e.target.value)}>
              {orders.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.number}
                </option>
              ))}
            </select>
          </Field>
          <div style={{ marginTop: 16 }}>
            <OptionGroup
              label="What went wrong"
              value={kind}
              onChange={setKind}
              options={[
                { value: "item_missing", label: "Item missing" },
                { value: "damaged", label: "Damaged" },
                { value: "other", label: "Other" },
              ]}
            />
          </div>
          <Field label="Tell us more" htmlFor="rp-details" error={error}>
            <textarea id="rp-details" value={details} aria-invalid={!!error} onChange={(e) => setDetails(e.target.value)} />
          </Field>
          <div className="field">
            <span style={{ display: "block", fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--mut)", marginBottom: 8, fontWeight: 600 }}>Photos</span>
            <PhotoInput label="Add photos" onChange={setPhotos} />
          </div>
          <button className="btn p" style={{ marginTop: 22 }} disabled={state === "saving"}>
            {state === "saving" ? "Sending…" : "Send to ValetKleen"}
          </button>
        </form>
      )}
    </div>
  );
}
