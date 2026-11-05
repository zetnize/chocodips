"use client";
import type { ReactNode } from "react";
import { useBooking } from "./BookingProvider";
export default function BookingTrigger({ children }: { children: ReactNode }) {
  const { open } = useBooking();
  return (
    <button type="button" className="booking-trigger" onClick={open}>
      {children}
    </button>
  );
}
