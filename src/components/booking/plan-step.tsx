"use client";

import { useRouter } from "next/navigation";
import type { PlanId } from "@/lib/types";
import { useBooking } from "./booking-store";
import { PlanPicker } from "./plan-picker";

/**
 * Suggestion shown on C6. The proposal calls for an AI plan suggestion that ops approves; until the
 * backend serves one, this simple rule stands in: 3+ bags suggests Family, otherwise Pass.
 */
export function suggestPlan(bags: number): PlanId {
  return bags >= 3 ? "family" : "pass";
}

/** C6 · Plans (inside booking) */
export function PlanStep() {
  const router = useRouter();
  const { draft, update } = useBooking();
  const suggested = suggestPlan(draft.bags);
  const label = draft.plan === "pass" ? "Add Pass to my order" : draft.plan === "family" ? "Add Family plan to my order" : "Continue, pay per order";
  return (
    <>
      <PlanPicker value={draft.plan} onChange={(plan) => update({ plan })} suggested={suggested} />
      <div className="row" style={{ marginTop: 34 }}>
        <button className="btn p" onClick={() => router.push("/book/checkout")}>
          {label} →
        </button>
        {draft.plan !== "per_order" && (
          <button
            className="btn g"
            onClick={() => {
              update({ plan: "per_order" });
              router.push("/book/checkout");
            }}
          >
            Not now, pay per order
          </button>
        )}
      </div>
    </>
  );
}
