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
        className="font-display font-semibold text-[clamp(2.5rem,11.5vw,3.75rem)] leading-[0.98] [hyphens:auto] sm:text-6xl md:text-7xl lg:text-8xl mt-4 mb-6"
      />
      <TextReveal
        text={c.subheadline}
        className="text-base md:text-lg text-[var(--color-ink-muted)] max-w-xl mx-auto leading-relaxed mb-9"
      />
      {/* A stage id, not a document anchor: the provider intercepts in-page links and
          turns the ones that name a rest into a camera move, so this button is the
          click-driven twin of the first scroll. Booking lives in the header. */}
      <CTAButton href="#resort">{c.cta}</CTAButton>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3">
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
      `}</style>
    </Section>
  );
}
