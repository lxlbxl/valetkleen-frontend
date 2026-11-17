import type { OrderStatus } from "./types";

/** Customer-facing timeline. Partner names never appear here. */
export const CUSTOMER_STEPS: { key: OrderStatus; label: string }[] = [
  { key: "booked", label: "Booked" },
  { key: "driver_en_route", label: "Driver on the way" },
  { key: "picked_up", label: "Picked up" },
  { key: "at_partner", label: "ValetKleen is cleaning it" },
  { key: "charged", label: "Weighed and charged" },
  { key: "out_for_delivery", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

const ORDER: OrderStatus[] = ["booked", "driver_en_route", "picked_up", "at_partner", "weighed", "charged", "out_for_delivery", "delivered"];

export function stepIndex(s: OrderStatus) {
  // "weighed" (awaiting charge) still reads as cleaning for the customer.
  const mapped = s === "weighed" ? "at_partner" : s;
  return CUSTOMER_STEPS.findIndex((x) => x.key === mapped);
}

export const isAfter = (a: OrderStatus, b: OrderStatus) => ORDER.indexOf(a) > ORDER.indexOf(b);

export const STATUS_LABEL: Record<OrderStatus, string> = {
  booked: "Booked",
  driver_en_route: "Driver on the way",
  picked_up: "Picked up",
  at_partner: "At partner",
  weighed: "Weighed · to charge",
  charged: "Charged · ready",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const STATUS_TONE: Record<OrderStatus, "ok" | "warn" | "bad" | ""> = {
  booked: "",
  driver_en_route: "",
  picked_up: "",
  at_partner: "",
  weighed: "warn",
  charged: "ok",
  out_for_delivery: "",
  delivered: "ok",
  cancelled: "bad",
};

/** Ops board columns (A3). */
export const BOARD_COLUMNS: { title: string; statuses: OrderStatus[] }[] = [
  { title: "Booked", statuses: ["booked", "driver_en_route"] },
  { title: "Picked up", statuses: ["picked_up"] },
  { title: "At partner", statuses: ["at_partner", "weighed"] },
  { title: "Ready / out", statuses: ["charged", "out_for_delivery"] },
  { title: "Delivered", statuses: ["delivered"] },
];

/** Customer-safe labels: no partner or internal wording. */
export const CUSTOMER_STATUS_LABEL: Record<OrderStatus, string> = {
  booked: "Booked",
  driver_en_route: "Driver on the way",
  picked_up: "Picked up",
  at_partner: "Cleaning",
  weighed: "Cleaning",
  charged: "Charged",
  out_for_delivery: "Out for delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};
