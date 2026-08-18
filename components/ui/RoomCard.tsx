export default function RoomCard({
  name,
  text,
  index,
}: {
  name: string;
  text: string;
  index: number;
}) {
  return (
    <div
      data-room-card
      className="room-card snap-start shrink-0 w-[78vw] sm:w-auto border-t border-[var(--color-ink-faint)] pt-5"
    >
      <span className="font-mono-label text-[11px] block mb-3" style={{ color: "var(--color-brass)" }}>
        {String(index + 1).padStart(2, "0")}
      </span>
      <h3 className="font-display text-xl md:text-2xl mb-2">{name}</h3>
      <p className="text-sm text-[var(--color-ink-muted)] leading-relaxed">{text}</p>
    </div>
  );
}
