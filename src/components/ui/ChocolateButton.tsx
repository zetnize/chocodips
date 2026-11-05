import Link from "next/link";

export default function ChocolateButton() {
  return (
    <Link href="/menu" className="chocolate-button">
      <svg
        className="chocolate-button-shape"
        viewBox="0 0 280 108"
        fill="none"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="chocolate-button-fill"
            x1="140"
            y1="4"
            x2="140"
            y2="104"
            gradientUnits="userSpaceOnUse"
          >
            <stop stopColor="#563321" />
            <stop offset="0.5" stopColor="#321b11" />
            <stop offset="1" stopColor="#25130c" />
          </linearGradient>
        </defs>
        <path
          d="M36 4H244C262 4 276 18 276 36C276 51 269 61 256 65C247 68 250 86 243 86C235 86 242 66 227 66C217 66 218 73 208 73C198 73 200 65 185 66C169 67 181 102 165 102C150 102 160 70 144 68C130 66 126 72 116 70C106 68 105 65 97 66C87 67 90 80 81 80C72 80 74 68 63 67C52 66 52 73 43 71C34 69 36 63 27 60C12 55 4 48 4 35C4 18 18 4 36 4Z"
          fill="url(#chocolate-button-fill)"
        />
      </svg>
      <span className="chocolate-button-content">
        <span>Смотреть меню</span>
      </span>
    </Link>
  );
}
