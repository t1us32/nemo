"use client";

import { useScrollStage } from "@/components/providers/ScrollStageProvider";

/**
 * The scroll height the staged page needs. Its sections are fixed layers, so without
 * this the document has nothing to travel through on the way to the footer. Off the
 * stage the sections are ordinary blocks and the spacer would only be dead space.
 */
export default function StageSpacer() {
  const { staged } = useScrollStage();
  if (!staged) return null;
  return <div style={{ height: "100dvh" }} aria-hidden="true" />;
}
