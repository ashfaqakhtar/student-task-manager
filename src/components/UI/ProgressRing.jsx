export default function ProgressRing({ value, label }) {
  const radius = 78;
  const circumference = Math.PI * 2 * radius;
  const dashOffset = circumference - circumference * value;

  return (
    <div className="progress-ring">
      <svg viewBox="0 0 180 180" className="progress-ring__svg">
        <defs>
          <linearGradient id="ringGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="var(--accent)" />
            <stop offset="100%" stopColor="var(--accent-soft)" />
          </linearGradient>
        </defs>
        <circle className="progress-ring__track" cx="90" cy="90" r={radius} />
        <circle
          className="progress-ring__fill"
          cx="90"
          cy="90"
          r={radius}
          strokeDasharray={circumference}
          strokeDashoffset={dashOffset}
        />
      </svg>
      <div className="progress-ring__label">{label}</div>
    </div>
  );
}
