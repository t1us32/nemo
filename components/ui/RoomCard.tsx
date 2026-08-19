export default function RoomCard({
  name,
  meta,
  text,
}: {
  name: string;
  meta: string;
  text: string;
}) {
  return (
    <div data-room-card className="room-card snap-start shrink-0 w-[78vw] sm:w-auto">
      {/* A short centred rule instead of a full-width one: the copy is centred, so a
          rule spanning the column would point at nothing. */}
      <span
        aria-hidden="true"
        className="block h-px w-8 mx-auto mb-4"
        style={{ background: "var(--color-ink-faint)" }}
      />
      {/* The marker slot carries what a guest actually compares rooms on. */}
      <span className="font-mono-label text-[10px] block mb-3" style={{ color: "var(--color-brass)" }}>
        {meta}
      </span>
      <h3 className="font-display font-semibold text-xl md:text-2xl mb-2">{name}</h3>
      <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">{text}</p>
    </div>
  );
}
