"use client";

import { sections } from "@/lib/content";
import { useScrollStage } from "@/components/providers/ScrollStageProvider";

export default function DepthRail() {
  const { index: active, released, staged } = useScrollStage();

  // Off the stage the browser's own scrollbar is the position indicator again.
  if (!staged) return null;

  const current = sections[active];

  return (
    <>
      <aside
        aria-hidden="true"
        className="fixed right-5 lg:right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-4 transition-opacity duration-500"
        style={{ opacity: released ? 0 : 1 }}
      >
        <span className="font-mono-label text-[10px]" style={{ color: "var(--color-current)" }}>
          {current.depth}
        </span>
        <div className="relative h-40 w-px" style={{ background: "var(--color-foam-faint)" }}>
          <div
            className="absolute left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full transition-[top] duration-500 ease-out"
            style={{
              top: `${(active / (sections.length - 1)) * 100}%`,
              background: "var(--color-current)",
              boxShadow: "0 0 8px var(--color-current)",
            }}
          />
        </div>
        <span
          className="font-mono-label text-[9px] [writing-mode:vertical-rl] tracking-[0.25em]"
          style={{ color: "var(--color-foam-muted)" }}
        >
          {current.label}
        </span>
      </aside>

      {/* Phones and tablets have no scrollbar to read while the stage holds the
          page, so the same rail runs flat along the bottom edge. It sits right of
          the hero's scroll hint and clears the home indicator. */}
      <aside
        aria-hidden="true"
        className="fixed right-6 z-40 flex items-center gap-3 lg:hidden transition-opacity duration-500"
        style={{
          bottom: "calc(env(safe-area-inset-bottom) + 2.75rem)",
          opacity: released ? 0 : 1,
        }}
      >
        <span className="font-mono-label text-[9px]" style={{ color: "var(--color-foam-muted)" }}>
          {current.depth}
        </span>
        <div className="flex items-center gap-1.5">
          {sections.map((section, i) => (
            <span
              key={section.id}
              className="block h-px transition-all duration-500 ease-out"
              style={{
                width: i === active ? "1.5rem" : "0.75rem",
                background: i === active ? "var(--color-current)" : "var(--color-foam-faint)",
              }}
            />
          ))}
        </div>
      </aside>
    </>
  );
}
