import { Suspense } from "react";
import { BookingInit } from "@/components/booking/booking-init";
import { BookingProvider } from "@/components/booking/booking-store";

export default function BookLayout({ children }: { children: React.ReactNode }) {
  return (
    <BookingProvider>
      <Suspense>
        <BookingInit />
      </Suspense>
      {children}
    </BookingProvider>
  );
}
