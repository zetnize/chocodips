export default function WaveLoader() {
  return (
    <div
      className="wave-loader"
      role="status"
      aria-label="Воспроизводится заставка"
    >
      <span className="wave-loader-bars" aria-hidden="true">
        {Array.from({ length: 9 }, (_, index) => (
          <span key={index} style={{ animationDelay: `${index * -0.1}s` }} />
        ))}
      </span>
    </div>
  );
}
