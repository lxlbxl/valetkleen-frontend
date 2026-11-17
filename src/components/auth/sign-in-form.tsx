"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { Field } from "@/components/ui/primitives";
import { signIn } from "@/lib/api/actions";

const base = z.object({ email: z.string().email("Enter a valid email."), password: z.string().min(8, "Passwords are at least 8 characters.") });
const ops = base.extend({ code: z.string().regex(/^\d{6}$/, "Enter the 6-digit code.") });

/**
 * Customer and staff sign-in. `variant="ops"` adds the authenticator code (TOTP MFA for staff).
 * TODO(backend): call Auth.js signIn() from the backend instead of the mock action.
 */
export function SignInForm({ variant = "customer", next = "/orders" }: { variant?: "customer" | "ops"; next?: string }) {
  const router = useRouter();
  const [f, setF] = useState({ email: "", password: "", code: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const r = (variant === "ops" ? ops : base).safeParse(f);
        if (!r.success) return setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
        setErrors({});
        setBusy(true);
        const res = await signIn(f);
        if (!res.ok) {
          setErrors({ form: res.error });
          setBusy(false);
          return;
        }
        router.push(next);
      }}
    >
      <Field label={variant === "ops" ? "Work email" : "Email"} htmlFor="si-email" error={errors.email}>
        <input id="si-email" type="email" autoComplete="email" value={f.email} aria-invalid={!!errors.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      </Field>
      <Field label="Password" htmlFor="si-pw" error={errors.password}>
        <input id="si-pw" type="password" autoComplete="current-password" value={f.password} aria-invalid={!!errors.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
      </Field>
      {variant === "ops" && (
        <Field label="Authenticator code" htmlFor="si-code" error={errors.code}>
          <input id="si-code" inputMode="numeric" autoComplete="one-time-code" maxLength={6} placeholder="6-digit code" value={f.code} aria-invalid={!!errors.code} onChange={(e) => setF({ ...f, code: e.target.value.replace(/\D/g, "") })} />
        </Field>
      )}
      {errors.form && (
        <p role="alert" style={{ color: "#ff9b93", fontSize: 14, marginTop: 14 }}>
          {errors.form}
        </p>
      )}
      <button className="btn p block" style={{ marginTop: 26 }} disabled={busy}>
        {busy ? "Signing in…" : "Sign in"}
      </button>
      {variant === "customer" ? (
        <p className="mut" style={{ marginTop: 16, textAlign: "center" }}>
          <Link className="lnk" href="/forgot-password">Forgot password?</Link> · New here? <Link className="lnk" href="/sign-up">Create an account</Link>
        </p>
      ) : (
        <p className="mut" style={{ marginTop: 16, textAlign: "center" }}>Lost your device? Ask a super admin to reset it.</p>
      )}
    </form>
  );
}
