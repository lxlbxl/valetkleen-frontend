import type { Metadata } from "next";
import { MarkPaid } from "@/components/ops/mark-paid";
import { Card, CardTitle, Kv } from "@/components/ui/primitives";
import { listPayouts } from "@/lib/api";
import { money } from "@/lib/format";

export const metadata: Metadata = { title: "Payouts and economics" };

/** A12 · Payouts and economics */
export default async function PayoutsPage() {
  const payouts = await listPayouts();
  const total = payouts.reduce((a, p) => a + p.owed, 0);
  const csv = "data:text/csv;charset=utf-8," + encodeURIComponent(["payee,kind,basis,owed", ...payouts.map((p) => `${p.payee},${p.kind},"${p.basis}",${(p.owed / 100).toFixed(2)}`)].join("\n"));
  return (
    <>
      <div className="chead">
        <h1>Payouts and economics</h1>
        <a className="btn g" href={csv} download="payouts.csv" style={{ padding: "12px 22px" }}>
          Export CSV
        </a>
      </div>
      <div className="split" style={{ marginTop: 0 }}>
        <Card>
          <CardTitle>Week ending {new Date(Date.now() - 2 * 86_400_000).toLocaleDateString("en-US", { day: "numeric", month: "short" })}</CardTitle>
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  {["Payee", "Basis", "Owed"].map((h) => (
                    <th key={h} scope="col">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr key={p.payee}>
                    <td>
                      <b>{p.payee}</b> <span className="mut">({p.kind})</span>
                    </td>
                    <td>{p.basis}</td>
                    <td>{money(p.owed)}</td>
                  </tr>
                ))}
                <tr className="hl">
                  <td>
                    <b>Total</b>
                  </td>
                  <td />
                  <td>
                    <b>{money(total)}</b>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <MarkPaid />
        </Card>
        <aside className="aside card dk">
          <CardTitle>VK-10482 (example)</CardTitle>
          <Kv label="Customer paid" value="$59.98" />
          <Kv label="Partner · 18.4 lbs × $1.10" value="−$20.24" />
          <Kv label="Driver · 2 trips × $8.80" value="−$17.60" />
          <Kv label="Card fee" value="−$2.04" />
          <Kv total label="Contribution" value="$20.10" />
          <p style={{ marginTop: 14, fontSize: 13, opacity: 0.8 }}>Example figures use planning assumptions ($1.10/lb partner rate, $8.80 per trip). They are not client data.</p>
        </aside>
      </div>
    </>
  );
}
