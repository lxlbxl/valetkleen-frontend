"use client";

import { useState } from "react";
import { z } from "zod";
import { Field } from "@/components/ui/primitives";
import { updateProfile } from "@/lib/api/actions";

const schema = z.object({
  name: z.string().min(2, "Enter your name."),
  email: z.string().email("Enter a valid email."),
  phone: z.string().regex(/^[\d\s()+-]{10,}$/, "Enter a valid phone number."),
});

type Profile = { name: string; email: string; phone: string; notifications: { email: boolean; sms: boolean } };

export function ProfileForm({ initial }: { initial: Profile }) {
  const [f, setF] = useState(initial);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<"" | "saving" | "saved">("");

  return (
    <form
      className="card"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const r = schema.safeParse(f);
        if (!r.success) return setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
        setErrors({});
        setStatus("saving");
        await updateProfile(f);
        setStatus("saved");
      }}
    >
      <h2 className="s">Contact</h2>
      <Field label="Name" htmlFor="pf-name" error={errors.name}>
        <input id="pf-name" autoComplete="name" value={f.name} aria-invalid={!!errors.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      </Field>
      <div className="grid2">
        <Field label="Email" htmlFor="pf-email" error={errors.email}>
          <input id="pf-email" type="email" autoComplete="email" value={f.email} aria-invalid={!!errors.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
        </Field>
        <Field label="Mobile" htmlFor="pf-phone" error={errors.phone}>
          <input id="pf-phone" type="tel" autoComplete="tel" value={f.phone} aria-invalid={!!errors.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} />
        </Field>
      </div>
      <h2 className="s" style={{ marginTop: 26 }}>Order updates</h2>
      <label className="check">
        <input type="checkbox" checked={f.notifications.sms} onChange={(e) => setF({ ...f, notifications: { ...f.notifications, sms: e.target.checked } })} />
        <span>Text me when the driver is on the way and when my order is weighed.</span>
      </label>
      <label className="check">
        <input type="checkbox" checked={f.notifications.email} onChange={(e) => setF({ ...f, notifications: { ...f.notifications, email: e.target.checked } })} />
        <span>Email me receipts and order updates.</span>
      </label>
      <div className="row" style={{ marginTop: 24 }}>
        <button className="btn p" disabled={status === "saving"}>{status === "saving" ? "Saving…" : "Save changes"}</button>
        {status === "saved" && <span role="status" style={{ color: "#7fe0e0", fontSize: 14 }}>Saved.</span>}
      </div>
    </form>
  );
}
