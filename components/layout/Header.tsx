"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { content } from "@/lib/content";
import { gsap } from "@/lib/gsap";

/** Kept in sync with the overlay's CSS transition duration below. */
const MENU_FADE = 300;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  // Mounted a beat longer than menuOpen so the close fade has time to play instead
  // of the overlay just vanishing; menuVisible is the transition target, flipped a
  // frame after mount so the browser has an opacity:0 frame to fade in from.
  const [menuMounted, setMenuMounted] = useState(false);
  const [menuVisible, setMenuVisible] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (menuOpen) {
      setMenuMounted(true);
      // One rAF often lands in the same frame as the opacity:0 mount, so the
      // browser never paints it and the fade-in never has a starting point to
      // animate from. A second rAF guarantees a paint has happened in between.
      let raf2 = 0;
      const raf1 = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setMenuVisible(true));
      });
      return () => {
        cancelAnimationFrame(raf1);
        cancelAnimationFrame(raf2);
      };
    }
    setMenuVisible(false);
  }, [menuOpen]);

  // The unmount is counted from the commit that actually applied opacity:0, not from
  // the click: a render sits between the two, and starting the clock early tore the
  // overlay out while it was still a quarter visible. menuOpen gates the effect so
  // that the opening pass — mounted, not yet visible — cannot schedule a teardown.
  useEffect(() => {
    if (menuOpen || !menuMounted || menuVisible) return;
    const id = window.setTimeout(() => setMenuMounted(false), MENU_FADE + 60);
    return () => window.clearTimeout(id);
  }, [menuOpen, menuMounted, menuVisible]);

  // Keyed on menuMounted as well as menuOpen: opening sets both in one pass, and on
  // that pass the overlay has not rendered yet, so the ref is still empty. Without
  // the second key the stagger is skipped every time. Reopening inside the close
  // fade leaves menuMounted true, which is why menuOpen has to stay a key too.
  useEffect(() => {
    if (!menuOpen || !menuRef.current) return;
    const items = menuRef.current.querySelectorAll("[data-menu-item]");
    gsap.fromTo(
      items,
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out", delay: 0.1 }
    );
  }, [menuOpen, menuMounted]);

  // Escape closes it, the way every overlay on the web does.
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [menuOpen]);

  return (
    <>
      {/* No bar, just a fade: the footage runs to the top edge of the frame and the
          only chrome on it is the menu key, the mark and the booking link. */}
      <header
        className="fixed top-0 inset-x-0 z-50"
        style={{
          background: "linear-gradient(to bottom, rgba(6,13,16,0.55), rgba(6,13,16,0))",
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        {/* No max width here on purpose: the menu key and the booking link sit on the
            same gutter the copy is measured from, so every edge on the page lines up
            against the frame rather than against a centred container. */}
        <div
          className="relative h-20 flex items-center justify-between"
          style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
        >
          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="flex items-center gap-3 py-2 text-[var(--color-foam)] hover:text-[var(--color-gilt)] transition-colors"
          >
            {/* Both rules pivot around the middle of the box, so the cross never
                grows wider than the burger it replaces. */}
            <span className="relative block w-6 h-6 shrink-0" aria-hidden="true">
              <span
                className="absolute left-0 top-1/2 block w-6 h-px bg-current transition-transform duration-300"
                style={{ transform: menuOpen ? "rotate(45deg)" : "translateY(-4px)" }}
              />
              <span
                className="absolute left-0 top-1/2 block w-6 h-px bg-current transition-transform duration-300"
                style={{ transform: menuOpen ? "rotate(-45deg)" : "translateY(4px)" }}
              />
            </span>
            <span className="font-label text-[11px] hidden sm:block">
              {menuOpen ? "Close" : "Menu"}
            </span>
          </button>

          <a
            href="#hero"
            onClick={() => setMenuOpen(false)}
            // Narrow phones have to fit the mark between the menu key and the booking
            // link with the mark still centred on the frame; at the old width the two
            // touched.
            className="absolute left-1/2 -translate-x-1/2 block w-[92px] sm:w-[120px] md:w-[132px]"
            aria-label="NEMO Hotel Resort & SPA"
          >
            <Image
              src="/brand/nemo-logo.svg"
              alt="NEMO Hotel Resort & SPA"
              width={300}
              height={109}
              priority
              className="w-full h-auto"
            />
          </a>

          <a
            href="#contacts"
            onClick={() => setMenuOpen(false)}
            // A hairline box, not a filled one. A solid gold block is the single
            // cheapest mark a hotel page can put on a photograph — it reads as a
            // booking widget bolted to the corner. Outlined, it still sits where the
            // eye looks for it and still fills in under the cursor.
            className="inline-flex shrink-0 border border-[var(--color-foam-faint)] px-3 sm:px-5 md:px-6 py-2.5 text-[9px] sm:text-[10px] md:text-[11px] font-label text-[var(--color-foam)] transition-colors duration-500 hover:border-[var(--color-gilt-soft)] hover:bg-[var(--color-gilt-soft)] hover:text-[var(--color-gilt-ink)]"
          >
            {content.header.cta}
          </a>
        </div>
      </header>

      {menuMounted && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-40 flex flex-col items-start justify-center gap-3 md:gap-4"
          style={{
            paddingLeft: "var(--gutter)",
            paddingRight: "var(--gutter)",
            background: "rgba(6,13,16,0.62)",
            backdropFilter: menuVisible ? "blur(20px)" : "blur(0px)",
            WebkitBackdropFilter: menuVisible ? "blur(20px)" : "blur(0px)",
            opacity: menuVisible ? 1 : 0,
            transition: `opacity ${MENU_FADE}ms ease-out, backdrop-filter ${MENU_FADE}ms ease-out, -webkit-backdrop-filter ${MENU_FADE}ms ease-out`,
          }}
        >
          {content.header.nav.map((item) => (
            <a
              key={item}
              data-menu-item
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setMenuOpen(false)}
              className="font-display font-normal text-[2.5rem] md:text-[4rem] leading-[1.15] text-[var(--color-foam)] transition-colors duration-500 hover:text-[var(--color-gilt-soft)]"
            >
              {item}
            </a>
          ))}
        </div>
      )}
    </>
  );
}
