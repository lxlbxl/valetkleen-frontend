/**
 * The single data boundary for the UI. Every page and component reads and writes through these
 * functions, never through fetch() directly.
 *
 * Today they resolve against in-memory mock data so the UI runs on its own. To connect the real
 * backend (ValetKleen-Backend route handlers), replace each body with a call to `http()` below.
 * docs/API_CONTRACT.md lists every function, its inputs and outputs, and the proposal feature it
 * belongs to.
 */
import { unstable_noStore as noStore } from "next/cache";
import { CATALOG } from "../catalog-data";
import { DEFAULT_PRICE_BOOK, estimate } from "../pricing";
import type {
  AiSuggestion,
  BookingDraft,
  Claim,
  CoverageResult,
  Customer,
  Driver,
  Handoff,
  HandoffType,
  LaunchGate,
  Order,
  OrderStatus,
  Partner,
  PayoutLine,
  PickupWindow,
  PlanId,
  PriceBook,
  Zone,
} from "../types";
import {
  AI_SUGGESTIONS,
  CLAIMS,
  CUSTOMER_PROFILE,
  DRIVERS,
  LAUNCH_GATE,
  ORDERS,
  PARTNERS,
  PAYOUTS,
  ZONES,
  windowsFor,
} from "./mock-data";

const BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
  ) {
    super(message);
  }
}

/** Typed JSON fetch for when the backend is wired in. */
export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: { "Content-Type": "application/json", ...init?.headers },
    credentials: "include",
  });
  if (!res.ok) throw new ApiError(await res.text(), res.status);
  return (await res.json()) as T;
}

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));
const clone = <T>(v: T): T => structuredClone(v);

// ---------------------------------------------------------------- catalog and pricing

export async function getPriceBook(): Promise<PriceBook> {
  return clone(DEFAULT_PRICE_BOOK);
}

export async function getCatalog() {
  return CATALOG;
}

// ---------------------------------------------------------------- coverage and waitlist

export async function checkCoverage(zip: string): Promise<CoverageResult> {
  await delay();
  const zone = ZONES.find((z) => z.live && z.zips.includes(zip));
  if (zone) {
    const nextWindows = windowsFor(2).filter((w) => w.status !== "full").slice(0, 3);
    return { covered: true, zip, zone: { id: zone.id, name: zone.name }, nextWindows };
  }
  return { covered: false, zip, liveZones: ZONES.filter((z) => z.live).map(({ name, zips }) => ({ name, zips })) };
}

export async function joinWaitlist(input: { email: string; zip: string; consent: boolean }) {
  await delay();
  const zone = ZONES.find((z) => z.zips.includes(input.zip));
  if (zone) zone.waitlist += 1;
  return { ok: true as const };
}

// ---------------------------------------------------------------- booking

export async function getPickupWindows(_zip: string): Promise<PickupWindow[]> {
  await delay(60);
  return windowsFor(5);
}

export async function createBooking(draft: BookingDraft): Promise<{ orderId: string; number: string }> {
  await delay(400);
  const book = DEFAULT_PRICE_BOOK;
  const window = windowsFor(5).find((w) => w.id === draft.windowId) ?? windowsFor(5)[0]!;
  const n = 10_500 + ORDERS.length;
  const lines = [{ label: "Standard Bag (up to 25 lbs)", qty: draft.bags, unit: book.bagPrice }].filter((l) => l.qty > 0);
  for (const [id, qty] of Object.entries(draft.items)) {
    const it = CATALOG.find((c) => c.id === id);
    if (it && qty > 0) lines.push({ label: it.name, qty, unit: it.priceMin });
  }
  const o: Order = {
    ...clone(ORDERS[0]!),
    id: `o${n}`,
    number: `VK-${n}`,
    status: "booked",
    createdAt: new Date().toISOString(),
    address: draft.address,
    doorNotes: draft.doorNotes,
    zip: draft.zip,
    pickupWindow: window,
    deliveryWindow: null,
    lines,
    express: draft.express,
    careNotes: draft.careNotes,
    estimate: estimate(draft, book),
    final: null,
    trips: { pickup: null, return: null },
    partnerId: null,
    tag: null,
    handoffs: [],
    rating: null,
  };
  ORDERS.unshift(o);
  return { orderId: o.id, number: o.number };
}

export async function applyPromo(code: string): Promise<{ valid: boolean; message: string }> {
  await delay();
  return code.trim().toUpperCase() === "WELCOME10"
    ? { valid: true, message: "$10 off your first order, applied after weigh-in." }
    : { valid: false, message: "That code is not valid." };
}

// ---------------------------------------------------------------- customer

export async function getCurrentCustomer(): Promise<Customer> {
  noStore();
  return clone(CUSTOMER_PROFILE);
}

export async function listMyOrders(): Promise<Order[]> {
  noStore();
  await delay(60);
  return clone(ORDERS.filter((o) => o.customer.id === CUSTOMER_PROFILE.id));
}

export async function getOrder(id: string): Promise<Order | null> {
  noStore();
  await delay(60);
  return clone(ORDERS.find((o) => o.id === id || o.number === id) ?? null);
}

export async function rateOrder(id: string, rating: { order: number; driver: number; comment: string }) {
  await delay();
  const o = ORDERS.find((x) => x.id === id);
  if (o) o.rating = rating;
  return { ok: true as const };
}

export async function reportProblem(input: { orderId: string; kind: Claim["kind"]; details: string; photos: number }) {
  await delay(300);
  const o = ORDERS.find((x) => x.id === input.orderId);
  CLAIMS.unshift({
    id: `cl${CLAIMS.length + 1}`,
    orderNumber: o?.number ?? input.orderId,
    kind: input.kind,
    openedAt: new Date().toISOString(),
    summary: input.details,
    status: "open",
    resolution: null,
  });
  return { ok: true as const };
}

export async function cancelOrder(id: string) {
  await delay();
  const o = ORDERS.find((x) => x.id === id);
  if (o && o.status === "booked") o.status = "cancelled";
  return { ok: o?.status === "cancelled" };
}

export async function updateSubscription(plan: PlanId) {
  await delay();
  CUSTOMER_PROFILE.subscription =
    plan === "per_order" ? null : { plan, pickupsUsed: 0, pickupsIncluded: plan === "pass" ? 4 : 2, renewsOn: CUSTOMER_PROFILE.subscription?.renewsOn ?? new Date().toISOString().slice(0, 10) };
  return { ok: true as const };
}

export async function updateProfile(input: Partial<Pick<Customer, "name" | "email" | "phone" | "notifications">>) {
  await delay();
  Object.assign(CUSTOMER_PROFILE, input);
  return { ok: true as const };
}

// ---------------------------------------------------------------- auth (UI only; real auth is Auth.js in the backend)

export async function signIn(input: { email: string; password: string; code?: string }) {
  await delay(300);
  if (!input.email || input.password.length < 8) return { ok: false as const, error: "Check your email and password." };
  return { ok: true as const };
}

export async function signUp(input: { name: string; email: string; password: string }) {
  await delay(300);
  return input.email ? { ok: true as const } : { ok: false as const, error: "Enter your email." };
}

export async function requestPasswordReset(_email: string) {
  await delay(300);
  return { ok: true as const };
}

// ---------------------------------------------------------------- ops

export async function opsDashboard() {
  noStore();
  await delay(60);
  const by = (s: OrderStatus[]) => ORDERS.filter((o) => s.includes(o.status)).length;
  return {
    stats: {
      ordersToday: 14,
      awaitingPickup: by(["booked", "driver_en_route"]),
      atPartner: by(["picked_up", "at_partner", "weighed"]),
      readyToReturn: by(["charged", "out_for_delivery"]),
    },
    alerts: [
      { text: "2 pickups tomorrow have no driver", href: "/ops/dispatch", action: "Dispatch" },
      { text: "VK-10482 weighed, waiting to charge", href: "/ops/orders/o10482/weigh-in", action: "Review" },
      { text: "1 card failed on a final charge", href: "/ops/orders/o10474", action: "Open order" },
      { text: "Waitlist 30601 is close to the launch gate", href: "/ops/zones", action: "Zones" },
      { text: "1 open claim older than 24 hours", href: "/ops/claims", action: "Claims" },
    ],
  };
}

export async function listOrders(filter: { zoneId?: string } = {}): Promise<Order[]> {
  noStore();
  await delay(60);
  return clone(ORDERS.filter((o) => !filter.zoneId || o.zoneId === filter.zoneId));
}

export async function listDrivers(): Promise<Driver[]> {
  noStore();
  return clone(DRIVERS);
}

export async function addDriver(input: { name: string; phone: string }) {
  await delay();
  DRIVERS.push({ id: `d${DRIVERS.length + 1}`, name: input.name, phone: input.phone, tripsToday: 0 });
  return { ok: true as const };
}

export async function assignTrip(orderId: string, trip: "pickup" | "return", driverId: string | null) {
  await delay();
  const o = ORDERS.find((x) => x.id === orderId);
  if (o) o.trips[trip] = driverId;
  return { ok: true as const };
}

/** Proposal: suggested assignments are proposals; ops approves each one. */
export async function suggestAssignments(): Promise<Record<string, string>> {
  await delay(300);
  const out: Record<string, string> = {};
  ORDERS.filter((o) => o.status === "booked" && !o.trips.pickup).forEach((o, i) => (out[o.id] = DRIVERS[i % DRIVERS.length]!.id));
  return out;
}

export async function sendOnTheWayText(orderIds: string[]) {
  await delay(300);
  return { sent: orderIds.length };
}

const NEXT_STATUS: Record<HandoffType, OrderStatus> = {
  pickup: "picked_up",
  partner_intake: "at_partner",
  ready: "out_for_delivery",
  delivered: "delivered",
};

export async function recordHandoff(orderId: string, input: Omit<Handoff, "id" | "at" | "recordedBy">) {
  await delay(300);
  const o = ORDERS.find((x) => x.id === orderId);
  if (!o) throw new ApiError("Order not found", 404);
  o.handoffs.push({ ...input, id: `h${Date.now()}`, at: new Date().toISOString(), recordedBy: "Dana" });
  o.status = NEXT_STATUS[input.type];
  if (input.tag) o.tag = input.tag;
  return { ok: true as const };
}

export async function submitWeighIn(orderId: string, input: { weightLbs: number; itemCount: number; notes: string; charge: boolean }) {
  await delay(400);
  const o = ORDERS.find((x) => x.id === orderId);
  if (!o) throw new ApiError("Order not found", 404);
  const bags = Math.max(1, Math.ceil(input.weightLbs / DEFAULT_PRICE_BOOK.bagMaxLbs));
  const itemTotal = o.estimate.items;
  const sub = bags * DEFAULT_PRICE_BOOK.bagPrice + itemTotal + o.estimate.express;
  const total = sub + (sub >= DEFAULT_PRICE_BOOK.freeDeliveryFrom ? 0 : DEFAULT_PRICE_BOOK.deliveryFee);
  o.final = { weightLbs: input.weightLbs, itemCount: input.itemCount, total, chargedAt: input.charge ? new Date().toISOString() : null };
  o.status = input.charge ? "charged" : "weighed";
  return { ok: true as const, total };
}

export async function listPartners(): Promise<Partner[]> {
  noStore();
  return clone(PARTNERS);
}

export async function listZones(): Promise<Zone[]> {
  noStore();
  return clone(ZONES);
}

export async function addZip(input: { zip: string; zoneId: string }) {
  await delay();
  ZONES.find((z) => z.id === input.zoneId)?.zips.push(input.zip);
  return { ok: true as const };
}

export async function getLaunchGate(): Promise<LaunchGate> {
  noStore();
  return clone(LAUNCH_GATE);
}

export async function listAiSuggestions(): Promise<AiSuggestion[]> {
  noStore();
  return clone(AI_SUGGESTIONS);
}

export async function decideSuggestion(id: string, decision: "approved" | "rejected") {
  await delay();
  const s = AI_SUGGESTIONS.find((x) => x.id === id);
  if (s) s.status = decision;
  return { ok: true as const };
}

export async function listClaims(): Promise<Claim[]> {
  noStore();
  return clone(CLAIMS);
}

export async function resolveClaim(id: string, resolution: NonNullable<Claim["resolution"]>, note: string) {
  await delay(300);
  const c = CLAIMS.find((x) => x.id === id);
  if (c) {
    c.status = "closed";
    c.resolution = resolution;
    if (note) c.summary += ` Ops note: ${note}`;
  }
  return { ok: true as const };
}

export async function listPayouts(): Promise<PayoutLine[]> {
  noStore();
  return clone(PAYOUTS);
}

export async function markWeekPaid() {
  await delay(300);
  return { ok: true as const };
}
