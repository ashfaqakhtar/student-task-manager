export default function Button({
  children,
  className = "",
  variant = "default",
  ...props
}) {
  return (
    <button className={`button button--${variant} ${className}`.trim()} {...props}>
      {children}
    </button>
  );
}
