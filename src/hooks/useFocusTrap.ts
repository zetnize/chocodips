"use client";
import { useEffect, type RefObject } from "react";
export function useFocusTrap(
  ref: RefObject<HTMLElement | null>,
  onClose: () => void,
) {
  useEffect(() => {
    const root = ref.current;
    if (!root) return;
    const previous =
      document.activeElement instanceof HTMLElement
        ? document.activeElement
        : null;
    const main = document.getElementById("site-content");
    const wasInert = main?.inert ?? false;
    if (main) main.inert = true;
    const selector =
      'a[href], button:not([disabled]), input:not([disabled]):not([type="hidden"]), select:not([disabled]), textarea:not([disabled]), [tabindex="0"]';
    const focusable = () =>
      Array.from(root.querySelectorAll<HTMLElement>(selector)).filter(
        (node) => node.tabIndex >= 0 && node.getClientRects().length > 0,
      );
    (focusable()[0] || root).focus();
    const keydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        event.stopPropagation();
        onClose();
      }
      if (event.key === "Tab") {
        const elements = focusable();
        const first = elements[0];
        const last = elements.at(-1);
        if (!first) {
          event.preventDefault();
          root.focus();
        } else if (
          event.shiftKey &&
          (document.activeElement === first ||
            !root.contains(document.activeElement))
        ) {
          event.preventDefault();
          last?.focus();
        } else if (
          !event.shiftKey &&
          (document.activeElement === last ||
            !root.contains(document.activeElement))
        ) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    const focusin = (event: FocusEvent) => {
      if (!root.contains(event.target as Node))
        (focusable()[0] || root).focus();
    };
    document.addEventListener("keydown", keydown);
    document.addEventListener("focusin", focusin);
    return () => {
      document.removeEventListener("keydown", keydown);
      document.removeEventListener("focusin", focusin);
      if (main) main.inert = wasInert;
      previous?.focus({ preventScroll: true });
    };
  }, [ref, onClose]);
}
