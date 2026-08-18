"use client";

import { sections } from "@/lib/content";
import { useScrollStage } from "@/components/providers/ScrollStageProvider";

export default function DepthRail() {
  const { index: active, released } = useScrollStage();

  return (
    <aside
      aria-hidden="true"
      className="fixed right-5 lg:right-8 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-4 transition-opacity duration-500"
      style={{ opacity: released ? 0 : 1 }}
    >
      <span className="font-mono-label text-[10px]" style={{ color: "var(--color-current)" }}>
        {sections[active].depth}
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
        {sections[active].label}
      </span>
    </aside>
  );
}
