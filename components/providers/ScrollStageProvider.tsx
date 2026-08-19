"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import Image from "next/image";
import { gsap } from "@/lib/gsap";
import { sections, stageTimes, stageVideo, stageVideoMobile, stagePoster } from "@/lib/content";

type StageState = {
  /** Rest the camera is heading for — also the section whose text belongs to it. */
  index: number;
  /** True while the clip plays between two rests: all section text is off screen. */
  transitioning: boolean;
  /** True once the last rest is passed and the page scrolls normally to the footer. */
  released: boolean;
  /**
   * False when the visitor asked for reduced motion. The camera, the scroll lock and
   * the clip are all off; every section is a plain block in a document that scrolls
   * the way the browser intends.
   */
  staged: boolean;
};

const StageContext = createContext<StageState>({
  index: 0,
  transitioning: false,
  released: false,
  staged: true,
});

export const useScrollStage = () => useContext(StageContext);

// The stage decision has to land before the browser paints, or the page flashes one
// layout and settles into the other.
const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

const LAST = stageTimes.length - 1;
/**
 * Every flight between two rests takes this long, whichever pair it connects — the
 * legs run 5s to 8.9s of footage, so speed is derived per leg rather than fixed.
 */
const FLIGHT = 1.3;
/** Chrome drops frames past this; keep the whoosh on the sane side of it. */
const MAX_RATE = 10;
/**
 * A leg is flown in three parts. The first share of it is spent winding up, the last
 * share braking, and the stretch between them cruises. Speed inside either ramp is
 * tied to the distance to that end of the leg, so the camera leans into the move and
 * settles onto its rest rather than snapping into and out of motion.
 */
const ACCEL_ZONE = 0.18;
const DECEL_ZONE = 0.22;
/** Neither ramp drops below this share of cruise: at zero the camera never leaves, or never lands. */
const ACCEL_FLOOR = 0.35;
const DECEL_FLOOR = 0.35;
/**
 * A ramped leg needs longer than a flat one for the same distance — a crawl at the
 * floor, an exponential stretch, the cruise, then the same two in reverse. Cruise
 * speed is scaled by that cost so a flight still takes FLIGHT seconds, ramps and all.
 */
const FLIGHT_COST =
  ACCEL_ZONE * (Math.log(1 / ACCEL_FLOOR) + 1) +
  (1 - ACCEL_ZONE - DECEL_ZONE) +
  DECEL_ZONE * (Math.log(1 / DECEL_FLOOR) + 1);
/** Phase boundaries, in the same normalised time as FLIGHT_COST. */
const WIND_UP_END = ACCEL_ZONE + ACCEL_ZONE * Math.log(1 / ACCEL_FLOOR);
const CRUISE_END = WIND_UP_END + (1 - ACCEL_ZONE - DECEL_ZONE);
const BRAKE_TAIL = CRUISE_END + DECEL_ZONE * Math.log(1 / DECEL_FLOOR);

/**
 * Distance covered and distance left, both as a share of the leg -> the share of
 * cruise speed to run at. Whichever end of the leg is nearer owns the throttle.
 */
const throttle = (travelled: number, remaining: number) =>
  Math.min(
    Math.min(1, Math.max(ACCEL_FLOOR, travelled / ACCEL_ZONE)),
    Math.min(1, Math.max(DECEL_FLOOR, remaining / DECEL_ZONE))
  );

/**
 * The same profile written as a position curve. The rewind cannot play backwards, so
 * its tween has to carry both ramps itself rather than pick them up from a rate.
 */
const flightEase = (t: number) => {
  const tau = t * FLIGHT_COST;
  if (tau <= ACCEL_ZONE) return ACCEL_FLOOR * tau;
  if (tau <= WIND_UP_END)
    return ACCEL_FLOOR * ACCEL_ZONE * Math.exp((tau - ACCEL_ZONE) / ACCEL_ZONE);
  if (tau <= CRUISE_END) return ACCEL_ZONE + (tau - WIND_UP_END);
  const remaining =
    tau <= BRAKE_TAIL
      ? DECEL_ZONE * Math.exp(-(tau - CRUISE_END) / DECEL_ZONE)
      : DECEL_ZONE * DECEL_FLOOR - DECEL_FLOOR * (tau - BRAKE_TAIL);
  return 1 - Math.max(0, remaining);
};

/** Wheel delta that has to pile up before a step fires — one notch per gesture. */
const WHEEL_STEP = 40;
const TOUCH_STEP = 60;
/**
 * A trackpad keeps firing for a while after the finger lifts. Stay deaf this long
 * once a flight lands, or the tail of one flick skips the rest it just arrived at.
 */
const SETTLE = 260;
/** If the clip still has not buffered by then, jump the camera instead of hanging. */
const READY_TIMEOUT = 4000;
/** Hold the clip back until the poster has had its moment as the LCP frame. */
const PRELOAD_DELAY = 700;
/** Give the clip this long to buffer behind the splash before showing the site anyway. */
const SPLASH_TIMEOUT = 6000;
/** Splash fade-out length — kept in sync with the CSS transition duration below. */
const SPLASH_FADE = 500;

export default function ScrollStageProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<StageState>({
    index: 0,
    transitioning: false,
    released: false,
    staged: true,
  });
  const [src, setSrc] = useState<string | null>(null);
  const [splashDone, setSplashDone] = useState(false);
  const [splashGone, setSplashGone] = useState(false);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const indexRef = useRef(0);
  const busyRef = useRef(false);
  const releasedRef = useRef(false);
  const rafRef = useRef(0);
  const tweenRef = useRef<gsap.core.Tween | null>(null);
  const accRef = useRef(0);
  const settleRef = useRef(0);

  const staged = state.staged;

  // Reduced motion is a live setting, not a load-time one: follow it both ways.
  useIsomorphicLayoutEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setState((s) => ({ ...s, staged: !query.matches }));
    apply();
    query.addEventListener("change", apply);
    return () => query.removeEventListener("change", apply);
  }, []);

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
      setState((s) => ({ ...s, transitioning: false }));
      // Swallow whatever inertia is still arriving before listening again.
      accRef.current = 0;
      window.clearTimeout(settleRef.current);
      settleRef.current = window.setTimeout(() => {
        busyRef.current = false;
        accRef.current = 0;
      }, SETTLE);
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
        ease: flightEase,
        onComplete: finish,
      });
    };

    const run = () => {
      if (next < from) {
        scrub();
        return;
      }
      // Forward: real playback, so the camera move reads exactly as the clip was cut.
      // The rate is not held flat across the leg — it is reset every frame from how
      // far the camera has come and how far it still has to run, which winds the move
      // up, cruises the middle and eases the arrival.
      const origin = video.currentTime;
      const span = Math.max(0.001, target - origin);
      const cruise = Math.min(MAX_RATE, Math.max(0.5, (span * FLIGHT_COST) / FLIGHT));
      // 0.25 is where Chrome starts treating a rate as a stall rather than a speed.
      const rate = (travelled: number, remaining: number) =>
        Math.max(0.25, cruise * throttle(travelled / span, remaining / span));
      video.playbackRate = rate(0, span);
      const watch = () => {
        const remaining = target - video.currentTime;
        if (remaining <= 0.03 || video.ended) {
          video.pause();
          video.currentTime = target;
          finish();
          return;
        }
        video.playbackRate = rate(video.currentTime - origin, remaining);
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
    if (video.preload !== "auto") video.preload = "auto";
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

  // Phones get the small cut, and nothing is fetched until the poster has painted:
  // the clip is 25s of scenery, never the thing a visitor waits on.
  useEffect(() => {
    if (!staged) {
      setSrc(null);
      return;
    }
    const small = window.matchMedia("(max-width: 768px)").matches;
    const id = window.setTimeout(() => setSrc(small ? stageVideoMobile : stageVideo), PRELOAD_DELAY);
    return () => window.clearTimeout(id);
  }, [staged]);

  // The splash holds the site behind a filled screen until the stage clip has
  // buffered (or reduced motion skips it), so nobody scrolls into a frame that is
  // still loading. A timeout stands in for a clip that never fires `loadeddata` —
  // a stalled or errored fetch should not strand the visitor on the splash forever.
  useEffect(() => {
    if (!staged) {
      setSplashDone(true);
      return;
    }
    if (!src) return;

    const video = videoRef.current;
    if (!video) return;

    if (video.readyState >= 2) {
      setSplashDone(true);
      return;
    }

    let settled = false;
    const onReady = () => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      video.removeEventListener("loadeddata", onReady);
      setSplashDone(true);
    };
    const timer = window.setTimeout(onReady, SPLASH_TIMEOUT);
    video.addEventListener("loadeddata", onReady);
    return () => {
      settled = true;
      clearTimeout(timer);
      video.removeEventListener("loadeddata", onReady);
    };
  }, [staged, src]);

  useEffect(() => {
    if (!splashDone) return;
    const id = window.setTimeout(() => setSplashGone(true), SPLASH_FADE);
    return () => window.clearTimeout(id);
  }, [splashDone]);

  useEffect(() => {
    if (!staged) return;

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
      if (busyRef.current) {
        accRef.current = 0;
        return;
      }
      // Sign flip means a new gesture — drop whatever the last one left over.
      if (delta * accRef.current < 0) accRef.current = 0;
      accRef.current += delta;
      if (Math.abs(accRef.current) < threshold) return;
      const dir = accRef.current > 0 ? 1 : -1;
      accRef.current = 0;
      step(dir);
    };

    // A section's own text can run taller than the viewport on small phones —
    // [data-scroll-area] marks the block that owns its own internal scroll then.
    // While that block still has room to move in the gesture's direction, the
    // gesture belongs to it, not to the stage.
    const scrollableAncestor = (target: EventTarget | null, delta: number) => {
      let node = target instanceof Element ? target : null;
      while (node) {
        if (node.hasAttribute("data-scroll-area")) {
          const { scrollTop, scrollHeight, clientHeight } = node;
          if (delta > 0) return scrollTop + clientHeight < scrollHeight - 1;
          if (delta < 0) return scrollTop > 0;
          return false;
        }
        node = node.parentElement;
      }
      return false;
    };

    const onWheel = (e: WheelEvent) => {
      if (!releasedRef.current) {
        if (scrollableAncestor(e.target, e.deltaY)) return;
        e.preventDefault();
      }
      accumulate(e.deltaY, WHEEL_STEP);
    };

    let touchY = 0;
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY;
      accRef.current = 0;
    };
    const onTouchMove = (e: TouchEvent) => {
      const y = e.touches[0].clientY;
      const delta = touchY - y;
      if (!releasedRef.current) {
        if (scrollableAncestor(e.target, delta)) {
          touchY = y;
          return;
        }
        e.preventDefault();
      }
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
      window.clearTimeout(settleRef.current);
      tweenRef.current?.kill();
      window.removeEventListener("wheel", onWheel);
      window.removeEventListener("touchstart", onTouchStart);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("click", onClick);
    };
  }, [capture, goToIndex, lockScroll, release, staged]);

  return (
    <StageContext.Provider value={state}>
      <div className="fixed inset-0 z-0" aria-hidden="true">
        {staged ? (
          <video
            ref={videoRef}
            src={src ?? undefined}
            poster={stagePoster}
            muted
            playsInline
            preload="metadata"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={stagePoster}
            alt=""
            className="absolute inset-0 h-full w-full object-cover"
          />
        )}
        {/* The copy sits in the middle of the frame, so the scrim does too: a soft
            centre well deep enough to carry white text over a bright pool shot,
            plus a top and bottom band for the header and the scroll hint. */}
        <div
          className="absolute inset-0"
          style={{
            background: [
              "radial-gradient(ellipse 78% 66% at 50% 50%, rgba(6,12,18,0.66) 0%, rgba(6,12,18,0.44) 58%, rgba(6,12,18,0.20) 100%)",
              "linear-gradient(180deg, rgba(6,12,18,0.55) 0%, rgba(6,12,18,0) 26%, rgba(6,12,18,0) 68%, rgba(6,12,18,0.62) 100%)",
            ].join(", "),
          }}
        />
      </div>
      {!splashGone && (
        <div
          role="status"
          aria-label="Loading"
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[var(--color-abyss)] transition-opacity duration-500 ease-out"
          style={{ opacity: splashDone ? 0 : 1, pointerEvents: splashDone ? "none" : "auto" }}
        >
          <Image
            src="/brand/nemo-logo.svg"
            alt="NEMO Hotel Resort & SPA"
            width={300}
            height={109}
            priority
            className="w-[160px] md:w-[200px] h-auto animate-pulse"
          />
        </div>
      )}
      {children}
    </StageContext.Provider>
  );
}
