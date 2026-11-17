"use client";

import { useId, useState, type ReactNode } from "react";
import { cn } from "@/lib/cn";

/** Quantity stepper (.ctr). */
export function Counter({ value, onChange, min = 0, max = 99, label }: { value: number; onChange: (n: number) => void; min?: number; max?: number; label: string }) {
  return (
    <div className="ctr" role="group" aria-label={label}>
      <button type="button" aria-label={`Fewer ${label}`} disabled={value <= min} onClick={() => onChange(Math.max(min, value - 1))}>
        −
      </button>
      <b aria-live="polite">{value}</b>
      <button type="button" aria-label={`More ${label}`} disabled={value >= max} onClick={() => onChange(Math.min(max, value + 1))}>
        +
      </button>
    </div>
  );
}

export interface Option<T extends string> {
  value: T;
  label: ReactNode;
  hint?: ReactNode;
  disabled?: boolean;
}

/** Single-choice pill group (.opts/.opt) with radio semantics and arrow-key support. */
export function OptionGroup<T extends string>({ options, value, onChange, label, className }: { options: Option<T>[]; value: T | null; onChange: (v: T) => void; label: string; className?: string }) {
  const name = useId();
  const enabled = options.filter((o) => !o.disabled);
  return (
    <div
      className={cn("opts", className)}
      role="radiogroup"
      aria-label={label}
      onKeyDown={(e) => {
        if (!["ArrowRight", "ArrowLeft", "ArrowDown", "ArrowUp"].includes(e.key)) return;
        e.preventDefault();
        const i = enabled.findIndex((o) => o.value === value);
        const d = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : -1;
        const next = enabled[(i + d + enabled.length) % enabled.length];
        if (next) {
          onChange(next.value);
          (e.currentTarget.querySelector(`[data-v="${next.value}"]`) as HTMLElement | null)?.focus();
        }
      }}
    >
      {options.map((o) => {
        const on = o.value === value;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            name={name}
            data-v={o.value}
            aria-checked={on}
            aria-disabled={o.disabled || undefined}
            tabIndex={on || (!value && o === enabled[0]) ? 0 : -1}
            className={cn("opt", on && "on", o.disabled && "off")}
            onClick={() => !o.disabled && onChange(o.value)}
          >
            {o.label}
            {o.hint && <small>{o.hint}</small>}
          </button>
        );
      })}
    </div>
  );
}

export function Stars({ value, onChange, label }: { value: number; onChange: (n: number) => void; label: string }) {
  const [hover, setHover] = useState(0);
  return (
    <div className="stars" role="radiogroup" aria-label={label} onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <span
          key={n}
          role="radio"
          aria-checked={value === n}
          aria-label={`${n} star${n > 1 ? "s" : ""}`}
          tabIndex={value === n || (!value && n === 1) ? 0 : -1}
          className={cn((hover || value) >= n && "on")}
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") onChange(Math.min(5, value + 1));
            if (e.key === "ArrowLeft") onChange(Math.max(1, value - 1));
            if (e.key === " " || e.key === "Enter") onChange(n);
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/** Photo picker that opens the camera on phones (capture="environment") and previews locally. */
export function PhotoInput({ label, required, onChange }: { label: string; required?: boolean; onChange?: (files: File[]) => void }) {
  const id = useId();
  const [previews, setPreviews] = useState<string[]>([]);
  return (
    <div>
      <label htmlFor={id} className="drop" style={{ display: "block", cursor: "pointer" }}>
        {previews.length ? `${previews.length} photo${previews.length > 1 ? "s" : ""} added · tap to change` : label}
        {required && <span className="sr-only"> (required)</span>}
      </label>
      <input
        id={id}
        type="file"
        accept="image/*"
        capture="environment"
        multiple
        required={required}
        className="sr-only"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          previews.forEach((u) => URL.revokeObjectURL(u));
          setPreviews(files.map((f) => URL.createObjectURL(f)));
          onChange?.(files);
        }}
      />
      {previews.length > 0 && (
        <div className="pthumbs" style={{ marginTop: 10 }}>
          {previews.map((u) => (
            // eslint-disable-next-line @next/next/no-img-element -- local blob preview
            <img key={u} src={u} alt="" />
          ))}
        </div>
      )}
    </div>
  );
}
