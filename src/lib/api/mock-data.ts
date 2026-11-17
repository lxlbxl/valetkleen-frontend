// Seed data for the mock API. Shapes match src/lib/types.ts. Every figure here is a planning
// example from the mockups, not client data.
import type {
  AiSuggestion,
  Claim,
  Customer,
  Driver,
  LaunchGate,
  Order,
  Partner,
  PayoutLine,
  PickupWindow,
  Zone,
} from "../types";

const DAY = 86_400_000;
const isoDate = (offset: number) => new Date(Date.now() + offset * DAY).toLocaleDateString("en-CA", { timeZone: "America/New_York" });
const at = (offset: number, hhmm: string) => new Date(`${isoDate(offset)}T${hhmm}:00-05:00`).toISOString();

const seed_ZONES: Zone[] = [
  { id: "central", name: "Central", zips: ["30303", "30304", "30305", "30306", "30307", "30308", "30309", "30310", "30311", "30312"], live: true, partners: 1, waitlist: 0 },
  { id: "east", name: "East", zips: ["30316", "30317"], live: true, partners: 1, waitlist: 0 },
  { id: "north", name: "North", zips: ["30326", "30328"], live: true, partners: 1, waitlist: 0 },
  { id: "athens", name: "Athens", zips: ["30601"], live: false, partners: 0, waitlist: 212 },
];

const SLOTS: [string, string][] = [
  ["08:00", "10:00"],
  ["10:00", "12:00"],
  ["12:00", "14:00"],
  ["14:00", "16:00"],
  ["16:00", "18:00"],
];

export function windowsFor(days = 5): PickupWindow[] {
  const out: PickupWindow[] = [];
  for (let d = 0; d < days; d++) {
    SLOTS.forEach(([start, end], i) => {
      // Deterministic availability pattern so screens are stable between renders.
      const status = (d + i) % 5 === 4 ? "full" : (d + i) % 4 === 3 ? "few_left" : "available";
      if (d === 0 && i < 4) return; // earlier slots today have passed
      out.push({ id: `${isoDate(d)}_${start}`, date: isoDate(d), start, end, status });
    });
  }
  return out;
}

const seed_DRIVERS: Driver[] = [
  { id: "d1", name: "J. Reed", phone: "404-555-0101", tripsToday: 3 },
  { id: "d2", name: "A. Cole", phone: "404-555-0102", tripsToday: 2 },
];

const seed_PARTNERS: Partner[] = [
  { id: "p1", label: "Partner 01", zoneId: "central", capacityLbs: 500, usedLbs: 310, ratePerLb: 110, onTimeRate: 0.96, recleanRate: 0.02, status: "active" },
  { id: "p2", label: "Partner 02", zoneId: "east", capacityLbs: 300, usedLbs: 180, ratePerLb: 110, onTimeRate: 0.91, recleanRate: 0.04, status: "active" },
  { id: "p3", label: "Partner 03", zoneId: "north", capacityLbs: 250, usedLbs: 240, ratePerLb: 115, onTimeRate: 0.94, recleanRate: 0.03, status: "near_full" },
  { id: "p4", label: "Partner 04", zoneId: "north", capacityLbs: 400, usedLbs: 0, ratePerLb: null, onTimeRate: null, recleanRate: null, status: "onboarding" },
];

const CUSTOMER = { id: "u1", name: "A. Sample", email: "a.sample@example.com", phone: "404-555-0199" };

const est = (bags: number) => {
  const b = bags * 4499;
  const delivery = b >= 7500 ? 0 : 1499;
  return { bags: b, items: 0, express: 0, delivery, discount: 0, total: b + delivery, freeDelivery: delivery === 0 };
};

const w = (offset: number, start: string, end: string): PickupWindow => ({ id: `${isoDate(offset)}_${start}`, date: isoDate(offset), start, end, status: "available" });

function order(p: Partial<Order> & Pick<Order, "id" | "number" | "status">): Order {
  return {
    createdAt: at(-1, "18:12"),
    customer: CUSTOMER,
    address: "88 Sample Street, Atlanta, GA",
    doorNotes: "Gate code 1234",
    zip: "30309",
    zoneId: "north",
    pickupWindow: w(0, "10:00", "12:00"),
    deliveryWindow: null,
    lines: [{ label: "Standard Bag (up to 25 lbs)", qty: 1, unit: 4499 }],
    express: false,
    careNotes: "",
    estimate: est(1),
    final: null,
    card: { brand: "Visa", last4: "4242" },
    partnerId: null,
    trips: { pickup: null, return: null },
    tag: null,
    handoffs: [],
    rating: null,
    eta: null,
    ...p,
  };
}

const seed_ORDERS: Order[] = [
  order({
    id: "o10482",
    number: "VK-10482",
    status: "weighed",
    careNotes: "Cold wash for the grey sweater",
    partnerId: "p3",
    trips: { pickup: "d1", return: null },
    tag: "VK-T-5821",
    deliveryWindow: w(1, "10:00", "12:00"),
    final: { weightLbs: 18.4, itemCount: 9, total: 5998, chargedAt: null },
    handoffs: [
      { id: "h1", type: "pickup", at: at(0, "10:48"), tag: "VK-T-5821", by: "J. Reed", recordedBy: "Dana", photoUrl: "/img/handoff.webp", source: "driver_text" },
      { id: "h2", type: "partner_intake", at: at(0, "13:05"), tag: "VK-T-5821", by: "J. Reed", recordedBy: "Dana", photoUrl: "/img/bag.webp", source: "driver_text" },
    ],
  }),
  order({ id: "o10490", number: "VK-10490", status: "booked", zoneId: "east", zip: "30316", pickupWindow: w(0, "12:00", "14:00") }),
  order({ id: "o10491", number: "VK-10491", status: "booked", pickupWindow: w(1, "10:00", "12:00") }),
  order({ id: "o10492", number: "VK-10492", status: "booked", pickupWindow: w(1, "10:00", "12:00"), trips: { pickup: "d1", return: null } }),
  order({ id: "o10488", number: "VK-10488", status: "picked_up", trips: { pickup: "d1", return: null }, tag: "VK-T-5830" }),
  order({ id: "o10487", number: "VK-10487", status: "driver_en_route", trips: { pickup: "d1", return: null }, eta: "10:40 – 11:20 am" }),
  order({ id: "o10480", number: "VK-10480", status: "at_partner", partnerId: "p1", zoneId: "central", tag: "VK-T-5812" }),
  order({ id: "o10475", number: "VK-10475", status: "out_for_delivery", partnerId: "p3", trips: { pickup: "d1", return: "d2" }, final: { weightLbs: 21, itemCount: 12, total: 5998, chargedAt: at(-1, "16:20") } }),
  order({ id: "o10474", number: "VK-10474", status: "charged", partnerId: "p1", zoneId: "central", final: { weightLbs: 16.2, itemCount: 8, total: 5998, chargedAt: at(-1, "15:02") }, deliveryWindow: w(1, "12:00", "14:00") }),
  order({
    id: "o10471",
    number: "VK-10471",
    status: "delivered",
    createdAt: at(-7, "09:00"),
    partnerId: "p1",
    final: { weightLbs: 17.9, itemCount: 10, total: 5998, chargedAt: at(-6, "14:00") },
    handoffs: [{ id: "h9", type: "delivered", at: at(-5, "10:52"), tag: "VK-T-5790", by: "A. Cole", recordedBy: "Dana", photoUrl: "/img/tote-window.webp", source: "driver_text" }],
  }),
  order({
    id: "o10211",
    number: "VK-10211",
    status: "delivered",
    createdAt: at(-21, "09:00"),
    lines: [{ label: "Standard Bag (up to 25 lbs)", qty: 2, unit: 4499 }],
    estimate: est(2),
    final: { weightLbs: 41.5, itemCount: 14, total: 8998, chargedAt: at(-20, "14:00") },
    rating: { order: 4, driver: 5, comment: "" },
  }),
];

const seed_CUSTOMER_PROFILE: Customer = {
  ...CUSTOMER,
  addresses: [{ id: "a1", line: "88 Sample Street, Atlanta, GA", zip: "30309", doorNotes: "Gate code 1234", isDefault: true }],
  cards: [{ id: "c1", brand: "Visa", last4: "4242", exp: "08/28", isDefault: true }],
  subscription: { plan: "pass", pickupsUsed: 2, pickupsIncluded: 4, renewsOn: isoDate(12) },
  notifications: { email: true, sms: true },
  referralCode: "ASAMPLE10",
};

const seed_CLAIMS: Claim[] = [
  { id: "cl1", orderNumber: "VK-10211", kind: "item_missing", openedAt: at(-2, "09:30"), summary: "Customer says a blue shirt is missing. 2 bags, 14 items counted at intake, 14 items photographed at delivery.", status: "open", resolution: null },
  { id: "cl0", orderNumber: "VK-10102", kind: "damaged", openedAt: at(-14, "11:00"), summary: "Button missing on a dress shirt. Partner replaced it.", status: "closed", resolution: "credit" },
];

const seed_PAYOUTS: PayoutLine[] = [
  { payee: "J. Reed", kind: "driver", basis: "22 trips", owed: 19360 },
  { payee: "A. Cole", kind: "driver", basis: "17 trips", owed: 14960 },
  { payee: "Partner 01", kind: "partner", basis: "1,420 lbs", owed: 156200 },
  { payee: "Partner 03", kind: "partner", basis: "980 lbs", owed: 112700 },
];

const seed_AI_SUGGESTIONS: AiSuggestion[] = [
  { id: "s1", title: "Offer Pass to customers with 3 or more orders in 60 days.", reason: "They would save on delivery and ValetKleen keeps them longer.", effect: "Shown after the margin check.", status: "pending" },
];

const seed_LAUNCH_GATE: LaunchGate = {
  zoneName: "Athens",
  checks: [
    { label: "Waitlist reaches 300", value: "212", ok: false },
    { label: "Partner capacity signed", value: "No", ok: false },
    { label: "Drivers available", value: "No", ok: false },
    { label: "Order margin positive", value: "Model only", ok: null },
    { label: "Terms and insurance ready", value: "Review", ok: null },
  ],
};

// Next.js bundles Server Actions and Server Components as separate module instances, so the mock
// store lives on globalThis to give both the same data. Not needed once the backend is wired in.
const seed = {
  ZONES: seed_ZONES,
  DRIVERS: seed_DRIVERS,
  PARTNERS: seed_PARTNERS,
  ORDERS: seed_ORDERS,
  CUSTOMER_PROFILE: seed_CUSTOMER_PROFILE,
  CLAIMS: seed_CLAIMS,
  PAYOUTS: seed_PAYOUTS,
  AI_SUGGESTIONS: seed_AI_SUGGESTIONS,
  LAUNCH_GATE: seed_LAUNCH_GATE,
};
const g = globalThis as unknown as { __vkMock?: typeof seed };
const db = (g.__vkMock ??= seed);

export const { ZONES, DRIVERS, PARTNERS, ORDERS, CUSTOMER_PROFILE, CLAIMS, PAYOUTS, AI_SUGGESTIONS, LAUNCH_GATE } = db;
