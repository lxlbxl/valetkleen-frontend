import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = { title: "Ops sign in", robots: { index: false } };

/** A1 · Sign in with code */
export default function OpsSignInPage() {
  return (
    <AuthShell
      eyebrow="ValetKleen operations"
      title={
        <>
          Run every order
          <br />
          from <em>one place.</em>
        </>
      }
      lead="Dispatch, handoffs, weigh-ins, charges, claims and payouts, in one console for the ValetKleen team."
      features={[
        { title: "Staff only", text: "No driver or partner logins" },
        { title: "Audit log", text: "Every action recorded" },
        { title: "2-step sign in", text: "Password and 6-digit code" },
      ]}
    >
      <h2 className="s" style={{ fontSize: 28 }}>
        Sign in
      </h2>
      <p className="mut">Use your work email, password and the 6-digit code from your authenticator app.</p>
      <SignInForm variant="ops" next="/ops" />
    </AuthShell>
  );
}
