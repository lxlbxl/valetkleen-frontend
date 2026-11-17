"use client";

import Link from "next/link";
import { useState } from "react";
import { z } from "zod";
import { Field } from "@/components/ui/primitives";
import { joinWaitlist } from "@/lib/api/actions";

const schema = z.object({
  email: z.string().email("Enter a valid email."),
  zip: z.string().regex(/^\d{5}$/, "Enter a 5-digit ZIP code."),
  consent: z.literal(true, { errorMap: () => ({ message: "Tick the box so we can email you." }) }),
});

export function WaitlistForm({ zip: initialZip }: { zip: string }) {
  const [form, setForm] = useState({ email: "", zip: initialZip, consent: true });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [state, setState] = useState<"idle" | "saving" | "done">("idle");

  if (state === "done")
    return (
      <div style={{ marginTop: 16 }}>
        <p style={{ color: "var(--hc)", fontSize: 17 }}>You are on the list for {form.zip}.</p>
        <p className="mut" style={{ marginTop: 8 }}>
          We will email {form.email} when pickups open near you.
        </p>
        <Link className="btn g" href="/" style={{ marginTop: 22 }}>
          Check another ZIP
        </Link>
      </div>
    );

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const r = schema.safeParse(form);
        if (!r.success) return setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
        setErrors({});
        setState("saving");
        await joinWaitlist(r.data);
        setState("done");
      }}
    >
      <Field label="Email" htmlFor="wl-email" error={errors.email}>
        <input id="wl-email" type="email" autoComplete="email" value={form.email} aria-invalid={!!errors.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
      </Field>
      <Field label="ZIP code" htmlFor="wl-zip" error={errors.zip}>
        <input id="wl-zip" inputMode="numeric" maxLength={5} value={form.zip} aria-invalid={!!errors.zip} onChange={(e) => setForm({ ...form, zip: e.target.value.replace(/\D/g, "") })} />
      </Field>
      <label className="check">
        <input type="checkbox" checked={form.consent} onChange={(e) => setForm({ ...form, consent: e.target.checked })} />
        <span>I agree to receive an email when ValetKleen opens in my area.</span>
      </label>
      {errors.consent && (
        <p role="alert" style={{ color: "#ff9b93", fontSize: 13, marginTop: 6 }}>
          {errors.consent}
        </p>
      )}
      <div className="row" style={{ marginTop: 24 }}>
        <button className="btn p" type="submit" disabled={state === "saving"}>
          {state === "saving" ? "Joining…" : "Join the waitlist"}
        </button>
        <Link className="btn g" href="/">
          Check another ZIP
        </Link>
      </div>
    </form>
  );
}
