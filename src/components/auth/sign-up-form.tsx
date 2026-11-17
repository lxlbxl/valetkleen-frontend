"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { z } from "zod";
import { Field } from "@/components/ui/primitives";
import { signUp } from "@/lib/api/actions";

const schema = z.object({
  name: z.string().min(2, "Enter your name."),
  email: z.string().email("Enter a valid email."),
  password: z.string().min(8, "Use at least 8 characters."),
  terms: z.literal(true, { errorMap: () => ({ message: "Accept the Terms to continue." }) }),
});

export function SignUpForm() {
  const router = useRouter();
  const [f, setF] = useState({ name: "", email: "", password: "", terms: false });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  return (
    <form
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        const r = schema.safeParse(f);
        if (!r.success) return setErrors(Object.fromEntries(r.error.issues.map((i) => [String(i.path[0]), i.message])));
        setErrors({});
        setBusy(true);
        await signUp(f);
        router.push("/book");
      }}
    >
      <Field label="Name" htmlFor="su-name" error={errors.name}>
        <input id="su-name" autoComplete="name" value={f.name} aria-invalid={!!errors.name} onChange={(e) => setF({ ...f, name: e.target.value })} />
      </Field>
      <Field label="Email" htmlFor="su-email" error={errors.email}>
        <input id="su-email" type="email" autoComplete="email" value={f.email} aria-invalid={!!errors.email} onChange={(e) => setF({ ...f, email: e.target.value })} />
      </Field>
      <Field label="Password" htmlFor="su-pw" error={errors.password} hint="At least 8 characters.">
        <input id="su-pw" type="password" autoComplete="new-password" value={f.password} aria-invalid={!!errors.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
      </Field>
      <label className="check">
        <input type="checkbox" checked={f.terms} onChange={(e) => setF({ ...f, terms: e.target.checked })} />
        <span>
          I agree to the <Link className="lnk" href="/terms">Terms</Link> and <Link className="lnk" href="/privacy">Privacy policy</Link>.
        </span>
      </label>
      {errors.terms && <p role="alert" style={{ color: "#ff9b93", fontSize: 13, marginTop: 6 }}>{errors.terms}</p>}
      <button className="btn p block" style={{ marginTop: 26 }} disabled={busy}>{busy ? "Creating…" : "Create account"}</button>
      <p className="mut" style={{ marginTop: 16, textAlign: "center" }}>
        Already have an account? <Link className="lnk" href="/sign-in">Sign in</Link>
      </p>
    </form>
  );
}
