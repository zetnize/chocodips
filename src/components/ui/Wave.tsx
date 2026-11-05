export default function Wave({
  variant = "hero",
  fill = "var(--cream)",
  flip = false,
}: {
  variant?: "hero" | "soft";
  fill?: string;
  flip?: boolean;
}) {
  return (
    <svg
      className={`wave ${flip ? "flipped" : ""}`}
      viewBox="0 0 1440 140"
      preserveAspectRatio="none"
      aria-hidden="true"
    >
      <path
        fill={fill}
        d={
          variant === "hero"
            ? "M0 85C140 140 230 100 360 55C470 5 552 5 560 65C550 145 655 130 800 100C930 80 1000 108 1115 100C1265 90 1290 8 1440 2V140H0Z"
            : "M0 85C280 135 470 20 720 60S1150 130 1440 50V140H0Z"
        }
      />
    </svg>
  );
}
