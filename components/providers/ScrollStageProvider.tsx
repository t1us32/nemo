"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { gsap } from "@/lib/gsap";
import { sections, stageTimes, stageVideo } from "@/lib/content";

type StageState = {
  /** Rest the camera is heading for — also the section whose text belongs to it. */
  index: number;
  /** True while the clip plays between two rests: all section text is off screen. */
  transitioning: boolean;
  /** True once the last rest is passed and the page scrolls normally to the footer. */
  released: boolean;
};

const StageContext = createContext<StageState>({
  index: 0,
  transitioning: false,
  released: false,
});

export const useScrollStage = () => useContext(StageContext);

const LAST = stageTimes.length - 1;
/**
 * Every flight between two rests takes this long, whichever pair it connects — the
 * legs run 5s to 8.9s of footage, so speed is derived per leg rather than fixed.
 */
const FLIGHT = 1.3;
/** Chrome drops frames past this; keep the whoosh on the sane side of it. */
const MAX_RATE = 10;
/** Wheel delta that has to pile up before a step fires — one notch per gesture. */
const WHEEL_STEP = 40;
const TOUCH_STEP = 60;
/** If the clip still has not buffered by then, jump the camera instead of hanging. */
const READY_TIMEOUT = 4000;

export default function ScrollStageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StageState>({
    index: 0,
    transitioning: false,
    released: false,
  });

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const indexRef = useRef(0);
  const busyRef = useRef(false);
  const releasedRef = useRef(false);
  const rafRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const accRef = useRef(0);

  const lockScroll = useCallback((locked: boolean) => {
    const value = locked ? "hidden" : "";
    // Both, or a programmatic scroll on the documentElement still slips through.
    document.documentElement.style.overflow = value;
    document.body.style.overflow = value;
    if (locked) window.scrollTo(0, 0);
  }, []);

  const goToIndex = useCallback((next: number) => {
    const video = videoRef.current;
    const from = indexRef.current;
    if (!video || busyRef.current || next === from || next < 0 || next > LAST) return;

    busyRef.current = true;
    accRef.current = 0;
    indexRef.current = next;
    setState((s) => ({ ...s, index: next, transitioning: true }));

    const target = stageTimes[next];
    const finish = () => {
      busyRef.current = false;
      setState((s) => ({ ...s, transitioning: false }));
    };

    cancelAnimationFrame(rafRef.current);
    tweenRef.current?.kill();

    // Walking currentTime is the only way back — there is no reverse playback —
    // and it doubles as the fallback when play() is refused.
    const scrub = () => {
      video.pause();
      tweenRef.current = gsap.to(video, {
        currentTime: target,
        duration: FLIGHT,
        ease: "none",
        onComplete: finish,
      });
    };

    const run = () => {
      if (next < from) {
        scrub();
        return;
      }
      // Forward: real playback, so the camera move reads exactly as the clip was cut.
      const span = Math.abs(target - video.currentTime);
      video.playbackRate = Math.min(MAX_RATE, Math.max(0.5, span / FLIGHT));
      const watch = () => {
        if (video.currentTime >= target - 0.02 || video.ended) {
          video.pause();
          video.currentTime = target;
          finish();
          return;
        }
        rafRef.current = requestAnimationFrame(watch);
      };
      video.play().then(
        () => {
          rafRef.current = requestAnimationFrame(watch);
        },
        () => scrub()
      );
    };

    if (video.readyState >= 2) {
      run();
      return;
    }

    // First step can land before the clip has buffered; wait for it, but never forever.
    let settled = false;
    const onReady = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      video.removeEventListener("loadeddata", onReady);
      run();
    };
    const timer = setTimeout(() => {
      if (settled) return;
      settled = true;
      video.removeEventListener("loadeddata", onReady);
      video.currentTime = target;
      finish();
    }, READY_TIMEOUT);
    video.addEventListener("loadeddata", onReady);
    video.load();
  }, []);

  const release = useCallback(() => {
    if (releasedRef.current) return;
    releasedRef.current = true;
    lockScroll(false);
    setState((s) => ({ ...s, released: true }));
  }, [lockScroll]);

  const capture = useCallback(() => {
    if (!releasedRef.current) return;
    releasedRef.current = false;
    lockScroll(true);
    setState((s) => ({ ...s, released: false }));
  }, [lockScroll]);

  useEffect(() => {
    const step = (dir: number) => {
      if (busyRef.current) return;

      if (releasedRef.current) {
        // Only the very top of the footer scroll hands control back to the stage.
        if (dir < 0 && window.scrollY <= 2) capture();
        return;
      }

      if (dir > 0 && indexRef.current === LAST) {
        release();
        return;
      }

      goToIndex(indexRef.current + dir);
    };

    const accumulate = (delta: number, threshold: number) => {
      if (busyRef.current) return;
      // Sign flip means a new gesture — drop whatever the last one left over.
      if (delta * accRef.current < 0) accRef.current = 0;
      accRef.current += delta;
      if (Math.abs(accRef.current) < threshold) return;
      const dir = accRef.current > 0 ? 1 : -1;
      accRef.current = 0;
      step(dir);
    };

    const onWheel = (e: WheelEvent) => {
      if (!releasedRef.current) e.preventDefault();
      accumulate(e.deltaY, WHEEL_STEP);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
      accRef.current = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      if (!releasedRef.current) e.preventDefault();
      const y = e.touches[0].clientY;
      const delta = touchY - y;
      touchY = y;
      accumulate(delta, TOUCH_STEP);
    };

    const onKey = (e: KeyboardEvent) => {
      const down = ["ArrowDown", "PageDown", " ", "Spacebar"].includes(e.key);
      const up = ["ArrowUp", "PageUp"].includes(e.key);
      if (!down && !up) return;
      if (!releasedRef.current) e.preventDefault();
      step(down ? 1 : -1);
    };

    // In-page anchors cannot scroll to anything while the stage holds the scroll,
    // so route them through the camera instead: nav, CTAs and footer links all work.
    const onClick = (e: MouseEvent) => {
      const link = (e.target as HTMLElement | null)?.closest?.('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href")?.slice(1);
      if (!id) return;

      const stage = sections.findIndex((s) => s.id === id);
      if (stage >= 0) {
        e.preventDefault();
        if (releasedRef.current) capture();
        goToIndex(stage);
        return;
      }

      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      release();
      requestAnimationFrame(() => target.scrollIntoView({ behavior: "smooth" }));
    };

    lockScroll(true);
    window.addEventListener("wheel", onWheel, { passive: false });
    window.addEventListener("touchstart", onTouchStart, { passive: true });
    window.addEventListener("touchmove", onTouchMove, { passive: false });
    window.addEventListener("keydown", onKey);
    document.addEventListener("click", onClick);

    return () => {
      lockScroll(false);
      cancelAnimationFrame(rafRef.current);
      tweenRef.current?.kill();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [capture, goToIndex, lockScroll, release]);

  return (
    <StageContext.Provider value={state}>
      <div className="fixed inset-0 z-0" aria-hidden="true">
        <video
          ref={videoRef}
          src={stageVideo}
          poster="/videos/stages-poster.jpg"
          muted
          playsInline
          preload="auto"
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-black/45" />
      </div>
      {children}
    </StageContext.Provider>
  );
}
