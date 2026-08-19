export default function Label({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center justify-center gap-3 font-mono-label text-[11px] md:text-xs ${className}`}
      style={{ color: "var(--color-current)" }}
    >
      {/* A rule on each side, both drawn out from the middle with the eyebrow. */}
      <span
        data-reveal-rule
        aria-hidden="true"
        className="block h-px w-8 shrink-0"
        style={{ background: "currentColor" }}
      />
      <span data-reveal="label" className="block">
        {children}
      </span>
      <span
        data-reveal-rule
        aria-hidden="true"
        className="block h-px w-8 shrink-0"
        style={{ background: "currentColor" }}
      />
    </p>
  );
}
