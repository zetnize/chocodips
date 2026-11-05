"use client";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import dynamic from "next/dynamic";
const BookingModal = dynamic(() => import("./BookingModal"), { ssr: false });
const BookingContext = createContext<{
  open: () => void;
  close: () => void;
} | null>(null);
export function useBooking() {
  const context = useContext(BookingContext);
  if (!context) throw new Error("useBooking requires BookingProvider");
  return context;
}
export default function BookingProvider({ children }: { children: ReactNode }) {
  const [opened, setOpened] = useState(false);
  const open = useCallback(() => setOpened(true), []);
  const close = useCallback(() => setOpened(false), []);
  const value = useMemo(() => ({ open, close }), [open, close]);
  return (
    <BookingContext.Provider value={value}>
      {children}
      {opened && <BookingModal onClose={close} />}
    </BookingContext.Provider>
  );
}
