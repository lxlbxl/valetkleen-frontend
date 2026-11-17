"use client";

import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { useBooking } from "./booking-store";

/** Carries ?zip= and ?window= from the address check into the booking draft. */
export function BookingInit() {
  const params = useSearchParams();
  const { ready, update } = useBooking();
  useEffect(() => {
    if (!ready) return;
    const zip = params.get("zip");
    const win = params.get("window");
    if (zip || win) update({ ...(zip ? { zip } : {}), ...(win ? { windowId: win } : {}) });
  }, [ready, params, update]);
  return null;
}
