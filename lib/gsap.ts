import gsap from "gsap";

export const ease = {
  out2: "power2.out",
  out3: "power3.out",
  /** Long, decelerating settle — the headline and rules ride this. */
  expo: "expo.out",
  cta: "power3.out",
  /** Text leaving on the way into a camera move. */
  exit: "power2.in",
} as const;

// The values below only set the choreography — how the beats overlap. Every reveal
// is then scaled to `reveal` exactly, so a six-card section lasts no longer than a
// bare headline one.
export const duration = {
  label: 0.6,
  line: 1.05,
  body: 0.8,
  cta: 0.6,
  /** Total length of every section reveal, start to finish. */
  reveal: 1.2,
  exit: 0.35,
} as const;

export { gsap };
