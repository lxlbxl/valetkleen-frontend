// Domain types shared by the customer app and the ops console.
// Money is always integer cents. Dates are ISO strings.

export type Cents = number;

export type ServiceType = "dry_cleaning" | "press_only" | "hang_dry";

export interface CatalogItem {
  id: string;
  service: ServiceType;
  category: string;
  name: string;
  priceMin: Cents;
  priceMax: Cents;
  image: string | null;
}

export interface PriceBook {
  version: number;
  bagPrice: Cents;
  bagMaxLbs: number;
  deliveryFee: Cents;
  freeDeliveryFrom: Cents;
  expressFee: Cents;
  pass: { monthly: Cents; pickups: number; extraPickup: Cents; minBags: number };
  family: { monthly: Cents; bags: number; pickups: number };
}

export interface Zone {
  id: string;
  name: string;
  zips: string[];
  live: boolean;
  partners: number;
  waitlist: number;
}

export type CoverageResult =
  | { covered: true; zip: string; zone: Pick<Zone, "id" | "name">; nextWindows: PickupWindow[] }
  | { covered: false; zip: string; liveZones: Pick<Zone, "name" | "zips">[] };

export interface PickupWindow {
  id: string;
  /** ISO date, YYYY-MM-DD */
  date: string;
  start: string; // "10:00"
  end: string; // "12:00"
  status: "available" | "few_left" | "full";
}

export type PlanId = "pass" | "family" | "per_order";

export interface BookingDraft {
  zip: string;
  bags: number;
  items: Record<string, number>;
  express: boolean;
  careNotes: string;
  windowId: string | null;
  address: string;
  doorNotes: string;
  plan: PlanId;
  promoCode: string;
}

export interface Estimate {
  bags: Cents;
  items: Cents;
  express: Cents;
  delivery: Cents;
  discount: Cents;
  total: Cents;
  freeDelivery: boolean;
}

export type OrderStatus =
  | "booked"
  | "driver_en_route"
  | "picked_up"
  | "at_partner"
  | "weighed"
  | "charged"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export type HandoffType = "pickup" | "partner_intake" | "ready" | "delivered";

export interface Handoff {
  id: string;
  type: HandoffType;
  at: string;
  tag: string;
  by: string;
  recordedBy: string;
  photoUrl: string | null;
  source: "driver_text" | "ops" | "partner";
}

export interface OrderLine {
  label: string;
  qty: number;
  unit: Cents;
}

export interface Order {
  id: string;
  number: string; // VK-10482
  status: OrderStatus;
  createdAt: string;
  customer: { id: string; name: string; email: string; phone: string };
  address: string;
  doorNotes: string;
  zip: string;
  zoneId: string;
  pickupWindow: PickupWindow;
  deliveryWindow: PickupWindow | null;
  lines: OrderLine[];
  express: boolean;
  careNotes: string;
  estimate: Estimate;
  final: { weightLbs: number; itemCount: number; total: Cents; chargedAt: string | null } | null;
  card: { brand: string; last4: string };
  partnerId: string | null;
  trips: { pickup: string | null; return: string | null };
  tag: string | null;
  handoffs: Handoff[];
  rating: { order: number; driver: number; comment: string } | null;
  eta: string | null;
}

export interface Driver {
  id: string;
  name: string;
  phone: string;
  tripsToday: number;
}

export interface Partner {
  id: string;
  label: string; // internal only, never shown to customers
  zoneId: string;
  capacityLbs: number;
  usedLbs: number;
  ratePerLb: Cents | null;
  onTimeRate: number | null;
  recleanRate: number | null;
  status: "active" | "near_full" | "onboarding" | "paused";
}

export interface Claim {
  id: string;
  orderNumber: string;
  kind: "item_missing" | "damaged" | "other";
  openedAt: string;
  summary: string;
  status: "open" | "closed";
  resolution: null | "partial_refund" | "credit" | "rejected";
}

export interface PayoutLine {
  payee: string;
  kind: "driver" | "partner";
  basis: string;
  owed: Cents;
}

export interface Subscription {
  plan: PlanId;
  pickupsUsed: number;
  pickupsIncluded: number;
  renewsOn: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: { id: string; line: string; zip: string; doorNotes: string; isDefault: boolean }[];
  cards: { id: string; brand: string; last4: string; exp: string; isDefault: boolean }[];
  subscription: Subscription | null;
  notifications: { email: boolean; sms: boolean };
  referralCode: string;
}

export interface AiSuggestion {
  id: string;
  title: string;
  reason: string;
  effect: string;
  status: "pending" | "approved" | "rejected";
}

export interface LaunchGate {
  zoneName: string;
  checks: { label: string; value: string; ok: boolean | null }[];
}
