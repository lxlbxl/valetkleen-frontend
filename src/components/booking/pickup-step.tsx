"use client";

import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { OptionGroup } from "@/components/ui/controls";
import { Field } from "@/components/ui/primitives";
import { getPickupWindows } from "@/lib/api/actions";
import { dayLabel, windowLabel } from "@/lib/format";
import type { PickupWindow } from "@/lib/types";
import { useBooking } from "./booking-store";

/** C5 · Pickup and delivery windows */
export function PickupStep() {
  const router = useRouter();
  const { draft, update, ready } = useBooking();
  const [windows, setWindows] = useState<PickupWindow[] | null>(null);
  const [day, setDay] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ window?: string; address?: string }>({});

  useEffect(() => {
    if (!ready) return;
    getPickupWindows(draft.zip).then((w) => {
      setWindows(w);
      const current = w.find((x) => x.id === draft.windowId);
      setDay(current?.date ?? w.find((x) => x.status !== "full")?.date ?? null);
    });
    // Load once per zip.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, draft.zip]);

  const days = useMemo(() => Array.from(new Set((windows ?? []).map((w) => w.date))), [windows]);
  const dayWindows = (windows ?? []).filter((w) => w.date === day);

  function next() {
    const e: typeof errors = {};
    if (!draft.windowId || !windows?.some((w) => w.id === draft.windowId && w.status !== "full")) e.window = "Choose a pickup window.";
    if (draft.address.trim().length < 6) e.address = "Enter the pickup address.";
    setErrors(e);
    if (!Object.keys(e).length) router.push("/book/plan");
  }

  return (
    <div className="split">
      <div className="stack" data-stg>
        <div className="card">
          <h2 className="s">Pickup day</h2>
          {!windows ? (
            <p className="mut" style={{ marginTop: 12 }} aria-busy="true">
              Loading windows…
            </p>
          ) : (
            <>
              <OptionGroup label="Pickup day" className="mt-3" value={day} onChange={setDay} options={days.map((d) => ({ value: d, label: dayLabel(d, { relative: true }) }))} />
              <h2 className="s" style={{ marginTop: 28 }}>
                Pickup window
              </h2>
              <OptionGroup
                label="Pickup window"
                className="mt-3"
                value={dayWindows.some((w) => w.id === draft.windowId) ? draft.windowId : null}
                onChange={(id) => update({ windowId: id })}
                options={dayWindows.map((w) => ({
                  value: w.id,
                  label: windowLabel(w),
                  hint: w.status === "full" ? "Full" : w.status === "few_left" ? "Few left" : "Available",
                  disabled: w.status === "full",
                }))}
              />
              {errors.window && (
                <p role="alert" style={{ color: "#ff9b93", fontSize: 13, marginTop: 10 }}>
                  {errors.window}
                </p>
              )}
            </>
          )}
        </div>
        <div className="card">
          <h2 className="s">Address and door notes</h2>
          <Field label="Address" htmlFor="addr" error={errors.address}>
            <input id="addr" autoComplete="street-address" placeholder="Street, apartment, city" value={draft.address} aria-invalid={!!errors.address} onChange={(e) => update({ address: e.target.value })} />
          </Field>
          <Field label="Door notes" htmlFor="door" hint="Gate code, where to leave the bag, anything the driver should know.">
            <input id="door" value={draft.doorNotes} onChange={(e) => update({ doorNotes: e.target.value })} />
          </Field>
        </div>
      </div>
      <aside className="aside card sub">
        <h2 className="s">Back to you in</h2>
        <p style={{ font: "var(--hw) 44px/1.1 var(--hf)", color: "var(--hc)", margin: "8px 0 10px" }}>{draft.express ? "24 hours" : "24–48 hours"}</p>
        <p className="mut">We will confirm your delivery window once your order is ready.</p>
        <button className="btn p block" style={{ marginTop: 22 }} onClick={next}>
          Continue →
        </button>
        <button className="btn g block" style={{ marginTop: 10 }} onClick={() => router.push("/book")}>
          Back to service
        </button>
      </aside>
    </div>
  );
}
