type Props = {
  children: React.ReactNode;
  href?: string;
  className?: string;
};

/**
 * No box and no fill. A filled block of gold is what a booking widget looks like,
 * and it was the loudest thing on a page whose whole argument is restraint — so the
 * call to action is a line of small caps with a hairline running off it, mirroring
 * the rule that enters the eyebrow from the other edge of the frame. The rule is
 * what lengthens on hover; the words hold still.
 */
export default function CTAButton({ children, href = "#", className = "" }: Props) {
  return (
    <a
      data-reveal="cta"
      href={href}
      className={`group inline-flex items-center gap-4 font-label text-[11px] text-[var(--color-gilt-soft)] transition-colors duration-500 hover:text-[var(--color-foam)] ${className}`}
    >
      {children}
      <span
        aria-hidden="true"
        className="block h-px w-10 shrink-0 bg-current transition-[width] duration-500 ease-out group-hover:w-16"
      />
    </a>
  );
}
