import { content } from "@/lib/content";
import Section from "@/components/ui/Section";
import Label from "@/components/ui/Label";
import TextReveal from "@/components/ui/TextReveal";
import CTAButton from "@/components/ui/CTAButton";

export default function HeroSection() {
  const c = content.hero;
  return (
    <Section id="hero" index={0}>
      <Label>{c.label}</Label>
      <TextReveal
        as="h1"
        text={c.headline}
        wordSplit
        className="font-display text-[13vw] leading-[0.98] sm:text-6xl md:text-7xl lg:text-8xl mt-4 mb-6"
      />
      <TextReveal
        text={c.subheadline}
        className="text-base md:text-lg text-[var(--color-ink-muted)] max-w-xl leading-relaxed mb-9"
      />
      <CTAButton href="#contacts">{c.cta}</CTAButton>

      <div className="absolute bottom-10 left-6 md:left-20 flex items-center gap-3">
        <span className="block h-8 w-px bg-[var(--color-ink-faint)] relative overflow-hidden">
          <span className="absolute inset-x-0 top-0 h-1/2 bg-[var(--color-current)] animate-[scrollhint_1.8s_ease-in-out_infinite]" />
        </span>
        <span className="font-mono-label text-[10px] text-[var(--color-ink-muted)]">
          {c.scrollHint}
        </span>
      </div>

      <style>{`
        @keyframes scrollhint {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(200%); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-\\[scrollhint_1\\.8s_ease-in-out_infinite\\] { animation: none; }
        }
      `}</style>
    </Section>
  );
}
