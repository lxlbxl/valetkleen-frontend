import type { Metadata } from "next";
import { AuthShell } from "@/components/auth/auth-shell";
import { ForgotForm } from "@/components/auth/forgot-form";

export const metadata: Metadata = { title: "Reset your password" };

export default function Page() {
  return (
    <AuthShell
      eyebrow="The laundry concierge"
      title={<>Forgotten it? Happens.</>}
      lead="Enter the email on your account and we will send a reset link."
      features={[{ title: "Charged after weigh-in", text: "Never at booking" }, { title: "24–48 hours", text: "Back at your door" }, { title: "Live tracking", text: "Every step, every bag" }]}
    >
      <h2 className="s" style={{ fontSize: 28 }}>
        Reset your password
      </h2>
      <ForgotForm />
    </AuthShell>
  );
}
