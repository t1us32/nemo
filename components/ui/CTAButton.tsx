type Props = {
  children: React.ReactNode;
  href?: string;
  variant?: "brass" | "ghost";
  className?: string;
};

export default function CTAButton({
  children,
  href = "#",
  variant = "brass",
  className = "",
}: Props) {
  const base =
    "inline-flex items-center gap-3 px-7 py-3.5 text-[13px] font-mono-label transition-colors duration-300";
  const styles =
    variant === "brass"
      ? "bg-[var(--color-brass)] text-[var(--color-brass-ink)] hover:bg-[var(--color-brass-light)]"
      : "border border-[var(--color-ink-faint)] text-[var(--color-abyss)] hover:border-[var(--color-current)] hover:text-[var(--color-current)]";

  return (
    <a data-reveal="cta" href={href} className={`${base} ${styles} ${className}`}>
      {children}
      <span aria-hidden="true">&rarr;</span>
    </a>
  );
}
