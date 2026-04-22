export default function FormSection({ title, description, children, full = false }) {
  return (
    <section className={`form-section ${full ? "form-section--full" : ""}`.trim()}>
      <header className="form-section__header">
        <h3>{title}</h3>
        {description ? <p>{description}</p> : null}
      </header>
      <div className="form-section__body">{children}</div>
    </section>
  );
}
