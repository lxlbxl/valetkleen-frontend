"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field } from "@/components/ui/primitives";
import { addZip } from "@/lib/api/actions";

export function AddZipForm({ zones }: { zones: { id: string; name: string }[] }) {
  const router = useRouter();
  const [zip, setZip] = useState("");
  const [zoneId, setZoneId] = useState(zones[0]?.id ?? "");
  const [msg, setMsg] = useState("");
  return (
    <form
      className="card sub"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!/^\d{5}$/.test(zip)) return setMsg("Enter a 5-digit ZIP.");
        await addZip({ zip, zoneId });
        setMsg(`${zip} added.`);
        setZip("");
        router.refresh();
      }}
    >
      <h2 className="s">Add ZIP</h2>
      <div className="grid2">
        <Field label="ZIP" htmlFor="az-zip">
          <input id="az-zip" inputMode="numeric" maxLength={5} value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, ""))} />
        </Field>
        <Field label="Zone" htmlFor="az-zone">
          <select id="az-zone" value={zoneId} onChange={(e) => setZoneId(e.target.value)}>
            {zones.map((z) => (
              <option key={z.id} value={z.id}>
                {z.name}
              </option>
            ))}
          </select>
        </Field>
      </div>
      <div className="row" style={{ marginTop: 16 }}>
        <button className="btn p">Add ZIP</button>
        {msg && (
          <span role="status" className="mut">
            {msg}
          </span>
        )}
      </div>
    </form>
  );
}
