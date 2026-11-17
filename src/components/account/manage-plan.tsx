"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { PlanPicker, PLANS } from "@/components/booking/plan-picker";
import { Note } from "@/components/ui/primitives";
import { updateSubscription } from "@/lib/api/actions";
import { longDate } from "@/lib/format";
import type { PlanId } from "@/lib/types";

export function ManagePlan({ current, renewsOn }: { current: PlanId; renewsOn: string | null }) {
  const router = useRouter();
  const [plan, setPlan] = useState<PlanId>(current);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState("");
  const changed = plan !== current;
  const name = PLANS.find((p) => p.id === plan)?.name;

  return (
    <>
      <PlanPicker value={plan} onChange={(p) => { setPlan(p); setDone(""); }} suggested={current === "per_order" ? "pass" : undefined} />
      <div className="row" style={{ marginTop: 34 }}>
        <button
          className="btn p"
          disabled={!changed || busy}
          onClick={async () => {
            setBusy(true);
            await updateSubscription(plan);
            setBusy(false);
            setDone(plan === "per_order" ? "Your plan is cancelled. You will pay per order from your next pickup." : `You are on ${name}. Delivery is included from your next pickup.`);
            router.refresh();
          }}
        >
          {busy ? "Saving…" : changed ? (plan === "per_order" ? "Cancel my plan" : `Switch to ${name}`) : "Your current plan"}
        </button>
      </div>
      <div style={{ marginTop: 22, maxWidth: 640 }}>
        {done ? (
          <p role="status" style={{ color: "#7fe0e0" }}>
            {done}
          </p>
        ) : (
          renewsOn && current !== "per_order" && <Note>Your plan renews on {longDate(renewsOn + "T12:00:00")}. Changes take effect from your next pickup.</Note>
        )}
      </div>
    </>
  );
}
