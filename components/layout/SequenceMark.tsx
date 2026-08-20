"use client";

import { content, sections } from "@/lib/content";
import { useScrollStage } from "@/components/providers/ScrollStageProvider";

/**
 * The bottom rail of the frame: where you are in the flight, and — on the opening
 * shot only — the fact that it is a flight at all.
 *
 * This replaced a rail that read out a depth in metres. The number was invented
 * (section index times ten) and the metaphor was untrue: the clip is an aerial, the
 * camera never goes under. What is left says only what is actually so — one mark per
 * rest, six of them, the one you are on twice as long as the rest.
 */
export default function SequenceMark() {
  const { index: active, released, staged } = useScrollStage();

  // Off the stage the browser's own scrollbar is the position indicator again.
  if (!staged) return null;

  return (
    <>
      {active === 0 && (
        <div
          aria-hidden="true"
          className="fixed bottom-8 z-40 flex items-center gap-3 transition-opacity duration-700"
          style={{ left: "var(--gutter)", opacity: released ? 0 : 1 }}
        >
          <span className="relative block h-7 w-px overflow-hidden bg-[var(--color-foam-faint)]">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-[scrollhint_2.4s_ease-in-out_infinite] bg-[var(--color-gilt-soft)]" />
          </span>
          <span className="font-label text-[9px] text-[var(--color-foam-muted)]">
            {content.hero.scrollHint}
          </span>
        </div>
      )}

      <div
        aria-hidden="true"
        className="fixed bottom-8 z-40 flex items-center gap-2 transition-opacity duration-700"
        style={{ right: "var(--gutter)", opacity: released ? 0 : 1 }}
      >
        {sections.map((section, i) => (
          <span
            key={section.id}
            className="block h-px transition-all duration-700 ease-out"
            style={{
              width: i === active ? "1.75rem" : "0.875rem",
              background: i === active ? "var(--color-gilt-soft)" : "var(--color-foam-faint)",
            }}
          />
        ))}
      </div>
    </>
  );
}
