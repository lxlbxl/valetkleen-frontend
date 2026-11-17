import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignInForm } from "@/components/auth/sign-in-form";

export const metadata: Metadata = { title: "Sign in" };

export default function Page() {
  return (
    <AuthShell
      eyebrow="The laundry concierge"
      title={<>Welcome back.</>}
      lead="Track orders, reorder in one tap and manage your plan."
      features={[{ title: "Charged after weigh-in", text: "Never at booking" }, { title: "24–48 hours", text: "Back at your door" }, { title: "Live tracking", text: "Every step, every bag" }]}
    >
      <h2 className="s" style={{ fontSize: 28 }}>
        Sign in
      </h2>
      <SignInForm />
    </AuthShell>
  );
}
