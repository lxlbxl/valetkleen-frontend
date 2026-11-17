"use client";

import Link from "next/link";
import { useState } from "react";
import { Field } from "@/components/ui/primitives";
import { requestPasswordReset } from "@/lib/api/actions";

export function ForgotForm() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  if (sent)
    return (
      <p role="status" style={{ marginTop: 16, color: "var(--hc)" }}>
        If {email} has an account, a reset link is on its way. <Link className="lnk" href="/sign-in">Back to sign in</Link>
      </p>
    );
  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        if (!/^\S+@\S+\.\S+$/.test(email)) return setError("Enter a valid email.");
        setError("");
        await requestPasswordReset(email);
        setSent(true);
      }}
    >
      <Field label="Email" htmlFor="fp-email" error={error}>
        <input id="fp-email" type="email" autoComplete="email" value={email} aria-invalid={!!error} onChange={(e) => setEmail(e.target.value)} />
      </Field>
      <button className="btn p block" style={{ marginTop: 26 }}>Send reset link</button>
      <p className="mut" style={{ marginTop: 16, textAlign: "center" }}>
        <Link className="lnk" href="/sign-in">Back to sign in</Link>
      </p>
    </form>
  );
}
