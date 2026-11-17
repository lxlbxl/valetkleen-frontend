"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { cancelOrder } from "@/lib/api/actions";

export function CancelOrder({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [confirm, setConfirm] = useState(false);
  const [busy, setBusy] = useState(false);
  if (!confirm)
    return (
      <button className="btn g" onClick={() => setConfirm(true)}>
        Cancel pickup
      </button>
    );
  return (
    <div className="row" role="group" aria-label="Confirm cancellation">
      <span className="mut">Cancel this pickup?</span>
      <button
        className="btn p"
        disabled={busy}
        onClick={async () => {
          setBusy(true);
          await cancelOrder(orderId);
          router.refresh();
        }}
      >
        {busy ? "Cancelling…" : "Yes, cancel"}
      </button>
      <button className="btn g" onClick={() => setConfirm(false)}>
        Keep it
      </button>
    </div>
  );
}
