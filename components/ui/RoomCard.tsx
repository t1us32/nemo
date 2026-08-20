export default function RoomCard({
  name,
  meta,
}: {
  name: string;
  meta: string;
}) {
  return (
    /*
      A row on a rate sheet, not a card. Six cards each carrying a sentence of
      marketing gave a guest six paragraphs to read and nothing to compare; the three
      facts in `meta` — size, how many it sleeps, what it looks out on — are what
      anyone actually chooses a room by, so they are what the row carries, ruled off
      from the next one the way a hotel's own factsheet rules them.
    */
    <div
      data-room-card
      className="flex flex-col gap-1 border-t border-[var(--color-ink-faint)] py-3.5 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6"
    >
      <h3 className="font-display-sm text-[19px] md:text-[21px] leading-none">{name}</h3>
      <span
        className="font-label text-[10px] shrink-0 leading-none"
        style={{ color: "var(--color-gilt-soft)" }}
      >
        {meta}
      </span>
    </div>
  );
}
