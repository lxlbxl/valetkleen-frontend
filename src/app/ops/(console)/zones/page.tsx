import type { Metadata } from "next";
import { AddZipForm } from "@/components/ops/add-zip-form";
import { Card, CardTitle } from "@/components/ui/primitives";
import { getLaunchGate, listZones } from "@/lib/api";

export const metadata: Metadata = { title: "Zones and waitlist" };

/** A9 · Zones and market gate */
export default async function ZonesPage() {
  const [zones, gate] = await Promise.all([listZones(), getLaunchGate()]);
  const range = (z: string[]) => (z.length > 2 ? `${z[0]}–${z[z.length - 1]}` : z.join(", "));
  return (
    <>
      <div className="chead">
        <h1>Zones and waitlist</h1>
      </div>
      <div className="split" style={{ marginTop: 0 }}>
        <div className="stack">
          <Card>
            <div className="tbl-wrap">
              <table className="tbl">
                <thead>
                  <tr>
                    {["Zone", "ZIPs", "Live", "Partners", "Waitlist"].map((h) => (
                      <th key={h} scope="col">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {zones.map((z) => (
                    <tr key={z.id} className={z.live ? undefined : "hl"}>
                      <td>
                        <b>{z.live ? z.name : `${z.name} (not live)`}</b>
                      </td>
                      <td>{range(z.zips)}</td>
                      <td>{z.live ? "✓" : "—"}</td>
                      <td>{z.partners}</td>
                      <td>{z.waitlist || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
          <AddZipForm zones={zones.map((z) => ({ id: z.id, name: z.name }))} />
        </div>
        <aside className="aside card">
          <CardTitle>Launch gate: {gate.zoneName}</CardTitle>
          {gate.checks.map((c) => (
            <div className="kv" key={c.label}>
              <span>{c.label}</span>
              <b style={{ color: c.ok === true ? "#7fe0e0" : c.ok === false ? "#ffd27a" : undefined }}>{c.value}</b>
            </div>
          ))}
          <a className="btn g block" href="/api/waitlist.csv" style={{ marginTop: 18 }} download>
            Export waitlist CSV
          </a>
        </aside>
      </div>
    </>
  );
}
