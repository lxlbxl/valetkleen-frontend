"use client";

import { useState } from "react";
import { decideSuggestion } from "@/lib/api/actions";
import type { AiSuggestion } from "@/lib/types";

export function AiSuggestionCard({ suggestion }: { suggestion: AiSuggestion }) {
  const [status, setStatus] = useState(suggestion.status);
  return (
    <div className="card dk">
      <div className="row sb">
        <h2 className="s">AI suggestion</h2>
        <span className="badge">{status === "pending" ? "Awaiting approval" : status === "approved" ? "Approved" : "Rejected"}</span>
      </div>
      <p style={{ marginTop: 10, color: "#fff" }}>{suggestion.title}</p>
      <p style={{ marginTop: 10, opacity: 0.85, fontSize: 14 }}>
        <b>Reason:</b> {suggestion.reason}
      </p>
      <p style={{ marginTop: 6, opacity: 0.85, fontSize: 14 }}>
        <b>Effect:</b> {suggestion.effect}
      </p>
      {status === "pending" && (
        <div className="row" style={{ marginTop: 18 }}>
          <button
            className="btn p"
            onClick={async () => {
              await decideSuggestion(suggestion.id, "approved");
              setStatus("approved");
            }}
          >
            Approve
          </button>
          <button
            className="btn g"
            onClick={async () => {
              await decideSuggestion(suggestion.id, "rejected");
              setStatus("rejected");
            }}
          >
            Reject
          </button>
        </div>
      )}
    </div>
  );
}
