import type { AnchorHTMLAttributes, ReactNode } from "react";
export default function PillButton({
  children,
  variant = "outline",
  className = "",
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> & {
  children: ReactNode;
  variant?: "outline" | "solid-ink";
}) {
  return (
    <a className={`pill ${variant} ${className}`} {...props}>
      {children}
    </a>
  );
}
