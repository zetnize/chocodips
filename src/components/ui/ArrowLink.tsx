import Link from "next/link";
import type { ReactNode } from "react";
import { ArrowIcon } from "./icons";
export default function ArrowLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link className="arrow-link" href={href}>
      <span>{children}</span>
      <ArrowIcon />
    </Link>
  );
}
