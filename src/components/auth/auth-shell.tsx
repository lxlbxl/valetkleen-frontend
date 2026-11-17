import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";

/** Split sign-in layout from A1: brand art on the left, form card on the right. */
export function AuthShell({ eyebrow, title, lead, features, children }: { eyebrow: string; title: ReactNode; lead: string; features: { title: string; text: string }[]; children: ReactNode }) {
  return (
    <div className="auth">
      <div className="auth-art">
        <Link href="/" aria-label="ValetKleen home" className="aw" style={{ display: "block" }}>
          <Image src="/brand/logo-white.png" alt="ValetKleen" width={171} height={26} priority />
        </Link>
        <div>
          <div className="eyebrow">{eyebrow}</div>
          <h1 className="t">{title}</h1>
          <p className="lead">{lead}</p>
        </div>
        <div className="feat">
          {features.map((f) => (
            <span key={f.title}>
              <b>{f.title}</b>
              {f.text}
            </span>
          ))}
        </div>
        <Image className="avan" src="/brand/van.png" alt="" width={440} height={201} />
      </div>
      <main id="main" className="auth-form">
        <div className="card">{children}</div>
      </main>
    </div>
  );
}
