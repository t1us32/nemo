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
    <div data-room-card className="room-card w-full">
      {/* A short centred rule instead of a full-width one: the copy is centred, so a
          rule spanning the column would point at nothing. */}
      <span
        aria-hidden="true"
        className="block h-px w-8 mx-auto mb-4"
        style={{ background: "var(--color-ink-faint)" }}
      />
      {/* The marker slot carries what a guest actually compares rooms on. */}
      {/* Brass reads fine on the light card background elsewhere, but this card sits
          straight on the video: lighten it and add a hard shadow or it washes out
          against a bright frame (this is the last rest, the poolside shot). */}
      <span
        className="font-mono-label text-[10px] block mb-3"
        style={{ color: "var(--color-brass-light)", textShadow: "0 1px 4px rgba(6,12,18,0.85)" }}
      >
        {meta}
      </span>
      <h3 className="font-display font-semibold text-xl md:text-2xl mb-2">{name}</h3>
      <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">{text}</p>
    </div>
  );
}
