import type { Metadata } from "next";
import { ConsoleShell } from "@/components/ops/console-shell";

export const metadata: Metadata = { title: { default: "Ops console", template: "%s · Ops · ValetKleen" }, robots: { index: false } };

// TODO(backend): guard with the Auth.js session (role admin / super_admin) in middleware.ts.
export default function ConsoleLayout({ children }: { children: React.ReactNode }) {
  return <ConsoleShell staff={{ name: "Dana", role: "Ops" }}>{children}</ConsoleShell>;
}
