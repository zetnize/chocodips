import Image from "next/image";
import Link from "next/link";

export default function Logo({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  return (
    <Link href="/" className={`logo ${variant}`}>
      <span className="sr-only">Choco Dips — на главную</span>
      <span className="logo-art" aria-hidden="true">
        <Image
          src="/brand/choco-dips-logo.png"
          alt=""
          width={1254}
          height={1254}
          sizes="160px"
        />
      </span>
    </Link>
  );
}
