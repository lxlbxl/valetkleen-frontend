import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { SignUpForm } from "@/components/auth/sign-up-form";

export const metadata: Metadata = { title: "Create your account" };

export default function Page() {
  return (
    <AuthShell
      eyebrow="The laundry concierge"
      title={<>Two minutes to set up.</>}
      lead="Save your address and card once. Every pickup after that takes seconds."
      features={[{ title: "Charged after weigh-in", text: "Never at booking" }, { title: "24–48 hours", text: "Back at your door" }, { title: "Live tracking", text: "Every step, every bag" }]}
    >
      <h2 className="s" style={{ fontSize: 28 }}>
        Create your account
      </h2>
      <SignUpForm />
    </AuthShell>
  );
}
