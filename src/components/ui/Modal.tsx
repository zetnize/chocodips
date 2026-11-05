"use client";
import { useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useLockBodyScroll } from "@/hooks/useLockBodyScroll";
import { useFocusTrap } from "@/hooks/useFocusTrap";
import { CloseIcon } from "./icons";
export default function Modal({
  children,
  onClose,
  labelledBy,
  className = "",
}: {
  children: ReactNode;
  onClose: () => void;
  labelledBy: string;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  useLockBodyScroll();
  useFocusTrap(ref, onClose);
  return createPortal(
    <div
      className={`modal-backdrop ${className}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby={labelledBy}
        tabIndex={-1}
        ref={ref}
      >
        <button
          className="icon-button modal-close"
          onClick={onClose}
          aria-label="Закрыть окно"
        >
          <CloseIcon />
        </button>
        {children}
      </div>
    </div>,
    document.body,
  );
}
