"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { OptionGroup, PhotoInput } from "@/components/ui/controls";
import { Field, Note } from "@/components/ui/primitives";
import { recordHandoff } from "@/lib/api/actions";
import type { HandoffType } from "@/lib/types";

const EFFECT: Record<HandoffType, string> = {
  pickup: "Saving moves the order to “Picked up” for the customer.",
  partner_intake: "Saving moves the order to “ValetKleen is cleaning it” for the customer.",
  ready: "Saving moves the order to “Out for delivery” once Trip 2 is assigned.",
  delivered: "Saving marks the order delivered and sends the proof photo to the customer.",
};

export function HandoffForm({ orderId, defaultType, defaultTag, people }: { orderId: string; defaultType: HandoffType; defaultTag: string; people: string[] }) {
  const router = useRouter();
  const [type, setType] = useState<HandoffType>(defaultType);
  const [tag, setTag] = useState(defaultTag);
  const [by, setBy] = useState(people[0] ?? "");
  const [photos, setPhotos] = useState<File[]>([]);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  return (
    <form
      className="card"
      noValidate
      onSubmit={async (e) => {
        e.preventDefault();
        if (!/^VK-T-\d{3,}$/i.test(tag.trim())) return setError("Enter the bag tag, e.g. VK-T-5821.");
        if (!photos.length) return setError("A photo is required for every handoff.");
        setError("");
        setBusy(true);
        // TODO(backend): upload the photo to object storage (MinIO signed URL) and pass its key.
        await recordHandoff(orderId, { type, tag: tag.trim().toUpperCase(), by, photoUrl: "/img/handoff.webp", source: "ops" });
        router.push(`/ops/orders/${orderId}`);
        router.refresh();
      }}
    >
      <h2 className="s">Handoff</h2>
      <div style={{ marginTop: 12 }}>
        <OptionGroup
          label="Handoff type"
          value={type}
          onChange={setType}
          options={[
            { value: "pickup", label: "Pickup" },
            { value: "partner_intake", label: "Partner intake" },
            { value: "ready", label: "Ready" },
            { value: "delivered", label: "Delivered" },
          ]}
        />
      </div>
      <div className="grid2">
        <Field label="Bag tag" htmlFor="ho-tag">
          <input id="ho-tag" value={tag} placeholder="VK-T-0000" onChange={(e) => setTag(e.target.value)} />
        </Field>
        <Field label="Handed over by" htmlFor="ho-by">
          <select id="ho-by" value={by} onChange={(e) => setBy(e.target.value)}>
            {people.map((p) => (
              <option key={p}>{p}</option>
            ))}
          </select>
        </Field>
      </div>
      <div className="field">
        <span style={{ display: "block", fontSize: 12, letterSpacing: ".1em", textTransform: "uppercase", color: "var(--mut)", marginBottom: 8, fontWeight: 600 }}>Photo (required)</span>
        <PhotoInput label="Upload or take photo" required onChange={setPhotos} />
      </div>
      {error && (
        <p role="alert" style={{ color: "#ff9b93", fontSize: 14, marginTop: 14 }}>
          {error}
        </p>
      )}
      <div style={{ marginTop: 20 }}>
        <Note>{EFFECT[type]}</Note>
      </div>
      <button className="btn p" style={{ marginTop: 22 }} disabled={busy}>
        {busy ? "Saving…" : "Save handoff"}
      </button>
    </form>
  );
}
