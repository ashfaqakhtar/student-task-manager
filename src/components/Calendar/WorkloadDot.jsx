export default function WorkloadDot({ totalMinutes }) {
  const level = totalMinutes === 0 ? 0 : totalMinutes <= 60 ? 1 : totalMinutes <= 180 ? 2 : 3;
  return <span className={`workload-dot workload-dot--${level}`} />;
}
