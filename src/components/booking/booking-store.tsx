"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { DEFAULT_PRICE_BOOK, estimate } from "@/lib/pricing";
import type { BookingDraft, Estimate } from "@/lib/types";

const KEY = "vk.booking.v1";

export const EMPTY_DRAFT: BookingDraft = {
  zip: "",
  bags: 1,
  items: {},
  express: false,
  careNotes: "",
  windowId: null,
  address: "",
  doorNotes: "",
  plan: "per_order",
  promoCode: "",
};

interface Ctx {
  draft: BookingDraft;
  ready: boolean;
  update: (patch: Partial<BookingDraft>) => void;
  setItem: (id: string, qty: number) => void;
  reset: () => void;
  totals: Estimate;
}

const BookingContext = createContext<Ctx | null>(null);

/** Booking draft shared by the four booking steps, kept in sessionStorage so a refresh keeps it. */
export function BookingProvider({ children }: { children: ReactNode }) {
  const [draft, setDraft] = useState<BookingDraft>(EMPTY_DRAFT);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(KEY);
      if (raw) setDraft({ ...EMPTY_DRAFT, ...(JSON.parse(raw) as Partial<BookingDraft>) });
    } catch {
      /* storage unavailable: start fresh */
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try {
      sessionStorage.setItem(KEY, JSON.stringify(draft));
    } catch {
      /* ignore */
    }
  }, [draft, ready]);

  const update = useCallback((patch: Partial<BookingDraft>) => setDraft((d) => ({ ...d, ...patch })), []);
  const setItem = useCallback(
    (id: string, qty: number) =>
      setDraft((d) => {
        const items = { ...d.items };
        if (qty > 0) items[id] = qty;
        else delete items[id];
        return { ...d, items };
      }),
    [],
  );
  const reset = useCallback(() => setDraft(EMPTY_DRAFT), []);
  // TODO(backend): read the live price book from api.getPriceBook() once it is served.
  const totals = useMemo(() => estimate(draft, DEFAULT_PRICE_BOOK), [draft]);

  return <BookingContext.Provider value={{ draft, ready, update, setItem, reset, totals }}>{children}</BookingContext.Provider>;
}

export function useBooking() {
  const ctx = useContext(BookingContext);
  if (!ctx) throw new Error("useBooking must be used inside <BookingProvider>");
  return ctx;
}
