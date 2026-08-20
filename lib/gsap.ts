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
// is then scaled to `reveal` exactly, so a six-row section lasts no longer than a
// bare headline one.
//
// Everything here runs slower than it did. Copy that snaps into place reads as a
// notification; copy that takes its time reads as something that was placed. The
// stage's own flights are unchanged — the camera still moves at the speed of the
// footage, and only the words landing on it were hurried.
export const duration = {
  label: 0.7,
  line: 1.2,
  body: 0.95,
  cta: 0.7,
  /** Total length of every section reveal, start to finish. */
  reveal: 1.5,
  exit: 0.45,
} as const;

export { gsap };
