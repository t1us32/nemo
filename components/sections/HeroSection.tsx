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
        className="font-display font-normal text-[clamp(2.75rem,7vw,5.25rem)] leading-[0.95] mt-8 mb-8"
      />
      <TextReveal
        text={c.subheadline}
        className="text-[15px] md:text-[17px] text-[var(--color-ink-muted)] max-w-[33rem] leading-[1.8] mb-11"
      />
      {/* A stage id, not a document anchor: the provider intercepts in-page links and
          turns the ones that name a rest into a camera move, so this button is the
          click-driven twin of the first scroll. Booking lives in the header. */}
      <CTAButton href="#resort">{c.cta}</CTAButton>
    </Section>
  );
}
