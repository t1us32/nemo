"use client";

import { useEffect, useRef } from "react";
import { useGSAP } from "@gsap/react";
import { gsap, ease, duration, prefersReducedMotion } from "@/lib/gsap";
import { useScrollStage } from "@/components/providers/ScrollStageProvider";

type Props = {
  id: string;
  index: number;
  children: React.ReactNode;
};

export default function Section({ id, index, children }: Props) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const innerRef = useRef<HTMLDivElement | null>(null);
  const enterRef = useRef<gsap.core.Timeline | null>(null);
  const exitRef = useRef<gsap.core.Tween | null>(null);
  const { index: active, transitioning, released, staged } = useScrollStage();

  // On the stage, text belongs to a rest and never to the flight between two of
  // them. Off it, the page is a document: every section is simply there.
  const visible = staged ? !released && !transitioning && active === index : true;

  useGSAP(
    () => {
      const section = sectionRef.current;
      const inner = innerRef.current;
      if (!section || !inner) return;

      const rule = section.querySelectorAll("[data-reveal-rule]");
      const label = section.querySelectorAll('[data-reveal="label"]');
      const words = section.querySelectorAll("[data-reveal-word]");
      const body = section.querySelectorAll('[data-reveal="body"]');
      const cards = section.querySelectorAll("[data-room-card]");
      const cta = section.querySelectorAll('[data-reveal="cta"]');

      if (!staged || prefersReducedMotion()) {
        gsap.set(section, { opacity: 1 });
        gsap.set(inner, { y: 0 });
        enterRef.current = null;
        return;
      }

      gsap.set(section, { opacity: 0 });

      const tl = gsap.timeline({ paused: true });

      tl.set(section, { opacity: 1 });

      // A hairline drawn out from the left starts the whole thing.
      tl.fromTo(
        rule,
        { scaleX: 0, transformOrigin: "center" },
        { scaleX: 1, duration: 0.8, ease: ease.expo },
        0
      );
      tl.fromTo(
        label,
        { opacity: 0, y: 8, filter: "blur(6px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: duration.label, ease: ease.out2 },
        0.08
      );

      // Headline rides up out of its own mask, one word behind the next.
      tl.fromTo(
        words,
        { yPercent: 115 },
        { yPercent: 0, duration: duration.line, ease: ease.expo, stagger: 0.075 },
        0.16
      );
      tl.addLabel("headlineEnd", ">-0.55");

      tl.fromTo(
        body,
        { opacity: 0, y: 16, filter: "blur(8px)" },
        { opacity: 1, y: 0, filter: "blur(0px)", duration: duration.body, ease: ease.out3 },
        "headlineEnd"
      );
      tl.addLabel("bodyEnd", ">-0.45");

      if (cards.length) {
        tl.fromTo(
          cards,
          { opacity: 0, y: 22 },
          { opacity: 1, y: 0, duration: 0.65, ease: ease.out3, stagger: 0.07 },
          "bodyEnd"
        );
        tl.addLabel("cardsEnd", ">-0.4");
      }

      tl.fromTo(
        cta,
        { opacity: 0, y: 14, scale: 0.98 },
        { opacity: 1, y: 0, scale: 1, duration: duration.cta, ease: ease.cta },
        cards.length ? "cardsEnd" : "bodyEnd"
      );

      // Word and card counts differ per section; pin the total so every rest lands
      // its text in the same beat.
      if (tl.duration() > 0) tl.duration(duration.reveal);

      enterRef.current = tl;
    },
    { scope: sectionRef, dependencies: [staged], revertOnUpdate: true }
  );

  useEffect(() => {
    const enter = enterRef.current;
    const section = sectionRef.current;
    const inner = innerRef.current;
    if (!section || !inner) return;

    exitRef.current?.kill();

    if (!enter) {
      // No stage, no choreography: the copy is on screen and stays there.
      gsap.set(section, { opacity: 1 });
      gsap.set(inner, { y: 0 });
      return;
    }

    if (visible) {
      gsap.set(inner, { y: 0 });
      enter.restart();
      return;
    }

    enter.pause();
    // Leaving is one clean drift up, not a rewind of the entrance.
    exitRef.current = gsap.to(section, {
      opacity: 0,
      duration: duration.exit,
      ease: ease.exit,
    });
    gsap.to(inner, { y: -18, duration: duration.exit, ease: ease.exit });
  }, [visible, staged]);

  return (
    <section
      ref={sectionRef}
      id={id}
      data-section-index={index}
      aria-hidden={!visible}
      // A section waiting off screen is out of the tab order too — without this the
      // keyboard walks into CTAs nobody can see.
      inert={!visible}
      className={
        staged
          ? "fixed inset-0 w-full h-[100dvh] overflow-hidden text-white"
          : "relative w-full min-h-[100dvh] flex items-center text-white"
      }
      style={{
        zIndex: 10 + index,
        pointerEvents: visible ? "auto" : "none",
        // Text-only layer: the video behind it belongs to the provider, so the ink
        // tokens flip to their on-footage values for everything nested here.
        ["--color-ink-muted" as string]: "rgba(255,255,255,0.78)",
        ["--color-ink-faint" as string]: "rgba(255,255,255,0.22)",
        ["--color-current" as string]: "#7ec9ee",
      }}
    >
      <div
        ref={innerRef}
        // Copy sits in the middle of the frame, centred both ways. The scroll area
        // below owns any overflow, so plain centring can never push the top of the
        // block off screen.
        className={
          staged
            ? "relative z-10 mx-auto flex h-full w-full max-w-4xl flex-col items-center justify-center text-center"
            : "relative z-10 mx-auto flex w-full max-w-4xl flex-col items-center text-center"
        }
      >
        {/* Its own scroll area: a card-heavy section can run taller than a short
            phone screen, and the staged page itself never scrolls to bail it out. */}
        <div
          data-scroll-area
          className={`w-full px-6 py-24 md:px-10 md:py-16 ${
            staged ? "max-h-full overflow-y-auto overscroll-contain" : ""
          }`}
        >
          {children}
        </div>
      </div>
    </section>
  );
}
