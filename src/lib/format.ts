import type { Cents, PickupWindow } from "./types";

const usd = new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" });

export const money = (c: Cents) => usd.format(c / 100);

/** "$19.99" → "$19.99", whole dollars drop cents: 16900 → "$169" */
export const moneyShort = (c: Cents) =>
  c % 100 === 0 ? `$${(c / 100).toLocaleString("en-US")}` : money(c);

export const priceRange = (min: Cents, max: Cents) =>
  min === max ? money(min) : `${money(min)}–${money(max)}`;

const TZ = "America/New_York";

export function dayLabel(isoDate: string, opts: { relative?: boolean } = {}) {
  const d = new Date(`${isoDate}T12:00:00`);
  if (opts.relative) {
    const today = new Date();
    const t = new Date(today.toLocaleDateString("en-CA", { timeZone: TZ }) + "T12:00:00");
    const diff = Math.round((d.getTime() - t.getTime()) / 86_400_000);
    if (diff === 0) return "Today";
    if (diff === 1) return "Tomorrow";
  }
  return d.toLocaleDateString("en-US", { weekday: "short", day: "numeric" });
}

export function longDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: TZ,
  });
}

export function timeOf(iso: string) {
  return new Date(iso)
    .toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit", timeZone: TZ })
    .toLowerCase();
}

function hour(h: string) {
  const [hh = 0, mm = 0] = h.split(":").map(Number);
  const suffix = hh >= 12 ? "pm" : "am";
  const h12 = hh % 12 === 0 ? 12 : hh % 12;
  return { text: mm ? `${h12}:${String(mm).padStart(2, "0")}` : `${h12}`, suffix };
}

/** "10:00"–"12:00" → "10 am – 12 pm"; "12:00"–"14:00" → "12 – 2 pm" */
export function windowLabel(w: Pick<PickupWindow, "start" | "end">) {
  const a = hour(w.start);
  const b = hour(w.end);
  return a.suffix === b.suffix ? `${a.text} – ${b.text} ${b.suffix}` : `${a.text} ${a.suffix} – ${b.text} ${b.suffix}`;
}

export const pluralize = (n: number, one: string, many = `${one}s`) => `${n} ${n === 1 ? one : many}`;
