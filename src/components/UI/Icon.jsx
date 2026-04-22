export function Icon({ path, className = "" }) {
  return (
    <svg className={`icon ${className}`.trim()} viewBox="0 0 24 24" fill="none">
      <path d={path} stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
