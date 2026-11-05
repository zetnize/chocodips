import Link from "next/link";
import { ArrowIcon } from "./icons";
type Props = { label: string; className?: string } & (
  { href: string; onClick?: never } | { href?: never; onClick: () => void }
);
export default function CircleArrowButton({
  label,
  className = "",
  href,
  onClick,
}: Props) {
  return href ? (
    <Link
      className={`circle-arrow ${className}`}
      href={href}
      aria-label={label}
    >
      <ArrowIcon />
    </Link>
  ) : (
    <button
      type="button"
      className={`circle-arrow ${className}`}
      onClick={onClick}
      aria-label={label}
    >
      <ArrowIcon />
    </button>
  );
}
