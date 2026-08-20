export default function Label({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`flex items-center gap-5 font-label text-[10px] md:text-[11px] ${className}`}
      style={{ color: "var(--color-gilt-soft)" }}
    >
      {/*
        The one gesture the page is built around. The rule is measured off the frame,
        not off the text column: it starts at the very edge of the viewport, crosses
        the gutter and runs into the eyebrow, which pins every rest's copy to the
        picture behind it rather than letting it float in the middle of the shot. It
        draws in from that edge on reveal — see the transform origin in Section.
      */}
      <span
        data-reveal-rule
        aria-hidden="true"
        className="block h-px shrink-0"
        style={{
          marginLeft: "calc(var(--gutter) * -1)",
          width: "calc(var(--gutter) + 2rem)",
          background: "currentColor",
          opacity: 0.85,
        }}
      />
      <span data-reveal="label" className="block">
        {children}
      </span>
    </p>
  );
}
