import Link from "next/link";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/cn";

type BtnVariant = "p" | "g";

export function Button({ variant = "p", block, className, ...props }: ComponentProps<"button"> & { variant?: BtnVariant; block?: boolean }) {
  return <button className={cn("btn", variant, block && "block", className)} {...props} />;
}

export function ButtonLink({ variant = "p", block, className, ...props }: ComponentProps<typeof Link> & { variant?: BtnVariant; block?: boolean }) {
  return <Link className={cn("btn", variant, block && "block", className)} {...props} />;
}

export function Card({ variant, className, ...props }: ComponentProps<"div"> & { variant?: "sub" | "dk" }) {
  return <div className={cn("card", variant, className)} {...props} />;
}

export function CardTitle({ className, ...props }: ComponentProps<"h2">) {
  return <h2 className={cn("s", className)} {...props} />;
}

export function Badge({ tone, children }: { tone?: "ok" | "warn" | "bad" | ""; children: ReactNode }) {
  return <span className={cn("badge", tone)}>{children}</span>;
}

export function Kv({ label, value, total }: { label: ReactNode; value: ReactNode; total?: boolean }) {
  return (
    <div className={cn("kv", total && "tot")}>
      <span>{label}</span>
      <b>{value}</b>
    </div>
  );
}

export function Note({ children, icon = "ⓘ" }: { children: ReactNode; icon?: string }) {
  return (
    <div className="note" role="note">
      <span aria-hidden="true" style={{ fontSize: 20 }}>
        {icon}
      </span>
      <span>{children}</span>
    </div>
  );
}

export function Field({ label, htmlFor, error, hint, children }: { label: string; htmlFor: string; error?: string; hint?: string; children: ReactNode }) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && !error && (
        <p className="mut" style={{ marginTop: 6, fontSize: 13 }}>
          {hint}
        </p>
      )}
      {error && (
        <p role="alert" style={{ marginTop: 6, fontSize: 13, color: "#ff9b93" }}>
          {error}
        </p>
      )}
    </div>
  );
}

export function Steps({ current }: { current: 1 | 2 | 3 | 4 }) {
  const labels = ["Service", "Pickup", "Plan", "Checkout"];
  return (
    <ol className="steps" aria-label="Booking progress" style={{ listStyle: "none" }}>
      {labels.map((l, i) => {
        const n = i + 1;
        return (
          <li key={l} className={cn(n === current && "on", n < current && "done")} aria-current={n === current ? "step" : undefined}>
            {n} · {l}
          </li>
        );
      })}
    </ol>
  );
}

export function Timeline({ steps }: { steps: { label: string; detail?: ReactNode; state: "done" | "now" | "todo" }[] }) {
  return (
    <ol className="tl">
      {steps.map((s) => (
        <li key={s.label} className={cn(s.state === "done" && "d", s.state === "now" && "n")} aria-current={s.state === "now" ? "step" : undefined}>
          <i aria-hidden="true">{s.state === "done" ? "✓" : ""}</i>
          <div>
            {s.label}
            {s.detail && <small>{s.detail}</small>}
          </div>
        </li>
      ))}
    </ol>
  );
}

export function Photo({ src, caption, height = 150 }: { src?: string | null; caption: string; height?: number }) {
  return (
    <figure className={cn("ph", src && "loaded")} style={{ minHeight: height, backgroundImage: src ? `url(${src})` : undefined }}>
      <div>
        <svg viewBox="0 0 24 24" aria-hidden="true">
          <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
          <circle cx="12" cy="13" r="3.5" />
        </svg>
        {caption}
      </div>
      {src && <figcaption className="sr-only">{caption}</figcaption>}
    </figure>
  );
}

export function EmptyState({ title, children }: { title: string; children?: ReactNode }) {
  return (
    <div className="card sub" style={{ textAlign: "center", padding: 44 }}>
      <h2 className="s">{title}</h2>
      {children && <div className="mut" style={{ marginTop: 8 }}>{children}</div>}
    </div>
  );
}
