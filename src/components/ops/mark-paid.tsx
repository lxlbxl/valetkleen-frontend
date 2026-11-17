"use client";

import { useState } from "react";
import { markWeekPaid } from "@/lib/api/actions";

export function MarkPaid() {
  const [state, setState] = useState<"idle" | "confirm" | "busy" | "done">("idle");
  if (state === "done")
    return (
      <p role="status" style={{ marginTop: 20, color: "#7fe0e0" }}>
        Week marked as paid and logged.
      </p>
    );
  return (
    <div className="row" style={{ marginTop: 22 }}>
      {state === "confirm" ? (
        <>
          <span className="mut">Mark every line as paid? This is logged.</span>
          <button
            className="btn p"
            onClick={async () => {
              setState("busy");
              await markWeekPaid();
              setState("done");
            }}
          >
            Yes, mark paid
          </button>
          <button className="btn g" onClick={() => setState("idle")}>
            Cancel
          </button>
        </>
      ) : (
        <button className="btn p" disabled={state === "busy"} onClick={() => setState("confirm")}>
          Mark week as paid
        </button>
      )}
    </div>
  );
}
