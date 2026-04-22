export default function Toggle({ checked, onChange, label }) {
  return (
    <label className="toggle">
      <input
        className="toggle__input"
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
      />
      <span className="toggle__control" />
      {label ? <span>{label}</span> : null}
    </label>
  );
}
