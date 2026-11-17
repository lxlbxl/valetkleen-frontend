import { CATALOG } from "./catalog-data";
import type { BookingDraft, CatalogItem, Estimate, PriceBook, ServiceType } from "./types";

/**
 * Default price book. In production the ops console edits this (Pricing screen) and the backend
 * serves it; the frontend only reads it through `api.getPriceBook()`. These values are the ones
 * used in the approved mockups.
 */
export const DEFAULT_PRICE_BOOK: PriceBook = {
  version: 7,
  bagPrice: 4499,
  bagMaxLbs: 25,
  deliveryFee: 1499,
  freeDeliveryFrom: 7500,
  expressFee: 999,
  pass: { monthly: 1999, pickups: 4, extraPickup: 599, minBags: 1 },
  family: { monthly: 16900, bags: 4, pickups: 2 },
};

export const SERVICE_LABEL: Record<ServiceType, string> = {
  dry_cleaning: "Dry cleaning",
  press_only: "Press only",
  hang_dry: "Hang dry",
};

const byId = new Map(CATALOG.map((i) => [i.id, i]));
export const getCatalogItem = (id: string) => byId.get(id);

export function itemsFor(service: ServiceType): CatalogItem[] {
  return CATALOG.filter((i) => i.service === service);
}

/**
 * Estimate shown during booking. The customer is charged the final total after weigh-in, so this
 * is never a charge. Range-priced items (gowns, curtains, wedding dresses) count at their minimum.
 */
export function estimate(draft: Pick<BookingDraft, "bags" | "items" | "express" | "plan">, book: PriceBook): Estimate {
  const bags = draft.bags * book.bagPrice;
  let items = 0;
  for (const [id, qty] of Object.entries(draft.items)) {
    const it = byId.get(id);
    if (it && qty > 0) items += it.priceMin * qty;
  }
  const express = draft.express ? book.expressFee : 0;
  const subtotal = bags + items + express;
  const coveredByPlan = draft.plan === "pass" || draft.plan === "family";
  const freeDelivery = coveredByPlan || subtotal >= book.freeDeliveryFrom;
  const delivery = subtotal === 0 || freeDelivery ? 0 : book.deliveryFee;
  return { bags, items, express, delivery, discount: 0, total: subtotal + delivery, freeDelivery };
}

export function itemCount(draft: Pick<BookingDraft, "items">) {
  return Object.values(draft.items).reduce((a, b) => a + b, 0);
}
