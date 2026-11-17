import type { Metadata } from "next";
import { Badge, Card, CardTitle } from "@/components/ui/primitives";
import { listPartners, listZones } from "@/lib/api";
import { money } from "@/lib/format";

export const metadata: Metadata = { title: "Partners" };

const pct = (n: number | null) => (n === null ? "—" : `${Math.round(n * 100)}%`);
const STATUS = { active: ["Active", "ok"], near_full: ["Near full", "warn"], onboarding: ["Onboarding", ""], paused: ["Paused", "bad"] } as const;

/** A8 · Partner directory (internal) */
export default async function PartnersPage() {
  const [partners, zones] = await Promise.all([listPartners(), listZones()]);
  const zone = (id: string) => zones.find((z) => z.id === id)?.name ?? id;
  return (
    <>
      <div className="chead">
        <h1>Partners (internal)</h1>
        <a className="btn p" href="mailto:ops@valetkleen.com?subject=New%20partner" style={{ padding: "12px 22px" }}>
          Add partner
        </a>
      </div>
      <Card>
        <div className="tbl-wrap">
          <table className="tbl">
            <caption className="sr-only">Cleaning partners</caption>
            <thead>
              <tr>
                {["ID", "Zone", "Capacity today", "Rate", "On time", "Re-clean", "Status"].map((h) => (
                  <th key={h} scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {partners.map((p) => {
                const [label, tone] = STATUS[p.status];
                const load = p.capacityLbs ? p.usedLbs / p.capacityLbs : 0;
                return (
                  <tr key={p.id} className={p.status === "near_full" ? "hl" : undefined}>
                    <td>
                      <b>{p.label}</b>
                    </td>
                    <td>{zone(p.zoneId)}</td>
                    <td>
                      {p.usedLbs} / {p.capacityLbs} lbs
                      <div aria-hidden="true" style={{ height: 3, background: "#ffffff1f", marginTop: 6, width: 120 }}>
                        <div style={{ height: 3, width: `${load * 100}%`, background: load > 0.9 ? "#e8a317" : "#36C5CC" }} />
                      </div>
                    </td>
                    <td>{p.ratePerLb ? `${money(p.ratePerLb)}/lb` : "—"}</td>
                    <td>{pct(p.onTimeRate)}</td>
                    <td>{pct(p.recleanRate)}</td>
                    <td>
                      <Badge tone={tone}>{label}</Badge>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
      <div className="grid2" style={{ marginTop: 22 }}>
        <Card variant="sub">
          <CardTitle>Routing rule</CardTitle>
          <p className="mut">Zone first, then the partner with spare capacity and the best on-time score. Ops can override with a reason.</p>
        </Card>
        <Card variant="sub">
          <CardTitle>Order sheet</CardTitle>
          <p className="mut">Emailed or texted: tag, service, care notes, due time. No customer details.</p>
        </Card>
      </div>
    </>
  );
}
