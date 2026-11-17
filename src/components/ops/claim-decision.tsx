"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { OptionGroup } from "@/components/ui/controls";
import { Field } from "@/components/ui/primitives";
import { resolveClaim } from "@/lib/api/actions";
import type { Claim } from "@/lib/types";

type Choice = NonNullable<Claim["resolution"]> | "ask_partner";

export function ClaimDecision({ claimId }: { claimId: string }) {
  const router = useRouter();
  const [choice, setChoice] = useState<Choice | null>(null);
  const [note, setNote] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  return (
    <div style={{ marginTop: 22 }}>
      <h3 className="s" style={{ fontSize: 20 }}>
        Decide
      </h3>
      <OptionGroup
        label="Decision"
        value={choice}
        onChange={setChoice}
        options={[
          { value: "partial_refund", label: "Partial refund" },
          { value: "credit", label: "Credit on account" },
          { value: "rejected", label: "Reject with reason" },
          { value: "ask_partner", label: "Ask partner (internal)" },
        ]}
      />
      {choice && (
        <Field label={choice === "rejected" ? "Reason (sent to customer)" : choice === "ask_partner" ? "Question for the partner" : "Note to customer"} htmlFor={`cn-${claimId}`} error={error}>
          <textarea id={`cn-${claimId}`} value={note} onChange={(e) => setNote(e.target.value)} />
        </Field>
      )}
      <div className="row" style={{ marginTop: 16 }}>
        <button
          className="btn p"
          disabled={!choice || busy}
          onClick={async () => {
            if (choice === "rejected" && note.trim().length < 5) return setError("Give the customer a reason.");
            setError("");
            setBusy(true);
            if (choice && choice !== "ask_partner") await resolveClaim(claimId, choice, note);
            router.refresh();
            setBusy(false);
          }}
        >
          {choice === "ask_partner" ? "Send to partner" : "Confirm decision"}
        </button>
        <span className="mut">Customer is told the result in the order.</span>
      </div>
    </div>
  );
}
