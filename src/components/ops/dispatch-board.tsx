"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Field } from "@/components/ui/primitives";
import { addDriver, assignTrip, sendOnTheWayText, suggestAssignments } from "@/lib/api/actions";
import { dayLabel, windowLabel } from "@/lib/format";
import type { Driver, Order } from "@/lib/types";
import { cn } from "@/lib/cn";

export function DispatchBoard({ pickups, returns, drivers, initialTab }: { pickups: Order[]; returns: Order[]; drivers: Driver[]; initialTab: "pickups" | "returns" }) {
  const router = useRouter();
  const [tab, setTab] = useState(initialTab);
  const [suggested, setSuggested] = useState<Record<string, string>>({});
  const [toast, setToast] = useState("");
  const [newDriver, setNewDriver] = useState({ name: "", phone: "" });
  const rows = tab === "pickups" ? pickups : returns;
  const trip = tab === "pickups" ? "pickup" : "return";

  const flash = (m: string) => {
    setToast(m);
    setTimeout(() => setToast(""), 2600);
  };

  return (
    <>
      <div className="chead">
        <h1>Dispatch</h1>
        <div className="seg" role="tablist" aria-label="Trip type">
          <button role="tab" aria-selected={tab === "pickups"} className={cn(tab === "pickups" && "on")} onClick={() => setTab("pickups")}>
            Pickups · {pickups.length}
          </button>
          <button role="tab" aria-selected={tab === "returns"} className={cn(tab === "returns" && "on")} onClick={() => setTab("returns")}>
            Returns · {returns.length}
          </button>
        </div>
      </div>
      <div className="split" style={{ marginTop: 0 }}>
        <div className="card">
          <div className="tbl-wrap">
            <table className="tbl">
              <thead>
                <tr>
                  <th scope="col">Window</th>
                  <th scope="col">Order</th>
                  <th scope="col">Trip</th>
                  <th scope="col">Zone</th>
                  <th scope="col">Driver</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((o) => {
                  const w = tab === "pickups" ? o.pickupWindow : (o.deliveryWindow ?? o.pickupWindow);
                  const current = o.trips[trip];
                  const sug = suggested[o.id];
                  return (
                    <tr key={o.id} className={cn(!current && "hl")}>
                      <td>
                        {dayLabel(w.date)} · {windowLabel(w)}
                      </td>
                      <td>
                        <Link href={`/ops/orders/${o.id}`}>
                          <b>{o.number}</b>
                        </Link>
                      </td>
                      <td>{tab === "pickups" ? "1 · pickup" : "2 · return"}</td>
                      <td style={{ textTransform: "capitalize" }}>{o.zoneId}</td>
                      <td>
                        <label className="sr-only" htmlFor={`drv-${o.id}`}>
                          Driver for {o.number}
                        </label>
                        <select
                          id={`drv-${o.id}`}
                          className="sel"
                          value={current ?? ""}
                          onChange={async (e) => {
                            await assignTrip(o.id, trip, e.target.value || null);
                            flash(`${o.number} assigned`);
                            router.refresh();
                          }}
                        >
                          <option value="">Unassigned</option>
                          {drivers.map((d) => (
                            <option key={d.id} value={d.id}>
                              {d.name}
                            </option>
                          ))}
                        </select>
                        {sug && !current && (
                          <button
                            className="lnk"
                            style={{ marginLeft: 10 }}
                            onClick={async () => {
                              await assignTrip(o.id, trip, sug);
                              flash(`${o.number} approved`);
                              router.refresh();
                            }}
                          >
                            Approve {drivers.find((d) => d.id === sug)?.name}
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={5} className="mut">
                      Nothing to dispatch.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          <div className="row" style={{ marginTop: 22 }}>
            <button className="btn p" onClick={async () => setSuggested(await suggestAssignments())}>
              Suggest assignments
            </button>
            <button
              className="btn g"
              onClick={async () => {
                const ids = rows.filter((o) => o.trips[trip]).map((o) => o.id);
                const r = await sendOnTheWayText(ids);
                flash(`On-the-way text sent to ${r.sent} customer${r.sent === 1 ? "" : "s"}`);
              }}
            >
              Send on-the-way text
            </button>
          </div>
          <p className="mut" style={{ marginTop: 14 }}>
            Suggested assignments are proposals; ops approves each one.
          </p>
        </div>
        <aside className="aside card">
          <h2 className="s">Drivers</h2>
          <p className="mut">Name and phone, no login.</p>
          {drivers.map((d) => (
            <div className="item" key={d.id}>
              <div>
                <b>{d.name}</b>
                <small>
                  <a href={`tel:${d.phone}`}>{d.phone}</a>
                </small>
              </div>
              <span className="mut">{d.tripsToday} trips today</span>
            </div>
          ))}
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              if (!newDriver.name || newDriver.phone.replace(/\D/g, "").length < 10) return flash("Enter a name and a 10-digit phone.");
              await addDriver(newDriver);
              setNewDriver({ name: "", phone: "" });
              flash("Driver added");
              router.refresh();
            }}
          >
            <Field label="New driver name" htmlFor="nd-name">
              <input id="nd-name" value={newDriver.name} onChange={(e) => setNewDriver({ ...newDriver, name: e.target.value })} />
            </Field>
            <Field label="Phone" htmlFor="nd-phone">
              <input id="nd-phone" type="tel" value={newDriver.phone} onChange={(e) => setNewDriver({ ...newDriver, phone: e.target.value })} />
            </Field>
            <button className="btn g" style={{ marginTop: 16 }}>
              Add driver
            </button>
          </form>
        </aside>
      </div>
      {toast && (
        <div className="toast" role="status">
          {toast}
        </div>
      )}
    </>
  );
}
