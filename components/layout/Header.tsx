"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { content } from "@/lib/content";
import { gsap } from "@/lib/gsap";

export default function Header() {
  const [solid, setSolid] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 80);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!menuRef.current) return;
    const items = menuRef.current.querySelectorAll("[data-menu-item]");
    if (menuOpen) {
      gsap.fromTo(
        items,
        { opacity: 0, y: 16 },
        { opacity: 1, y: 0, duration: 0.4, stagger: 0.06, ease: "power2.out" }
      );
    }
  }, [menuOpen]);

  return (
    <>
      <header
        className="fixed top-0 inset-x-0 z-50 transition-colors duration-500 backdrop-blur-md"
        style={{
          background: solid ? "rgba(35, 48, 60, 0.96)" : "var(--color-abyss)",
          borderBottom: "1px solid var(--color-foam-faint)",
          paddingTop: "env(safe-area-inset-top)",
        }}
      >
        <div className="mx-auto max-w-7xl px-6 md:px-10 h-20 flex items-center justify-between">
          <a href="#hero" className="block w-[132px] shrink-0" aria-label="NEMO Hotel Resort & SPA">
            <Image
              src="/brand/nemo-logo.svg"
              alt="NEMO Hotel Resort & SPA"
              width={300}
              height={109}
              priority
              className="w-full h-auto"
            />
          </a>

          <nav className="hidden md:flex items-center gap-8">
            {content.header.nav.map((item) => (
              <a
                key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
                className="font-mono-label text-[11px] text-[var(--color-foam-muted)] hover:text-[var(--color-current)] transition-colors"
              >
                {item}
              </a>
            ))}
          </nav>

          <a
            href="#contacts"
            className="hidden md:inline-flex px-5 py-2.5 text-[12px] font-mono-label bg-[var(--color-brass)] text-white hover:bg-[var(--color-brass-light)] transition-colors"
          >
            {content.header.cta}
          </a>

          <button
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden flex flex-col gap-1.5 p-2"
          >
            <span
              className="block w-6 h-px transition-transform"
              style={{
                background: "var(--color-foam)",
                transform: menuOpen ? "translateY(3.5px) rotate(45deg)" : "none",
              }}
            />
            <span
              className="block w-6 h-px transition-transform"
              style={{
                background: "var(--color-foam)",
                transform: menuOpen ? "translateY(-3.5px) rotate(-45deg)" : "none",
              }}
            />
          </button>
        </div>
      </header>

      {menuOpen && (
        <div
          ref={menuRef}
          className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 md:hidden"
          style={{ background: "var(--color-abyss)" }}
        >
          <Image
            data-menu-item
            src="/brand/nemo-logo.svg"
            alt="NEMO Hotel Resort & SPA"
            width={300}
            height={109}
            className="w-32 h-auto mb-2"
          />
          {content.header.nav.map((item) => (
            <a
              key={item}
              data-menu-item
              href={`#${item.toLowerCase().replace(/\s+/g, "-")}`}
              onClick={() => setMenuOpen(false)}
              className="font-display text-3xl text-white"
            >
              {item}
            </a>
          ))}
          <a
            data-menu-item
            href="#contacts"
            onClick={() => setMenuOpen(false)}
            className="mt-4 px-6 py-3 text-[13px] font-mono-label bg-[var(--color-brass)] text-white"
          >
            {content.header.cta}
          </a>
        </div>
      )}
    </>
  );
}
