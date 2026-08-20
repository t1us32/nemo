import { content } from "@/lib/content";
import Section from "@/components/ui/Section";
import Label from "@/components/ui/Label";
import TextReveal from "@/components/ui/TextReveal";
import CTAButton from "@/components/ui/CTAButton";

export default function ResortSection() {
  const c = content.resort;
  return (
    <Section id="resort" index={1}>
      <Label>{c.label}</Label>
      <TextReveal
        as="h2"
        text={c.headline}
        wordSplit
        className="font-display font-normal text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[0.98] mt-8 mb-7"
      />
      <TextReveal
        text={c.subheadline}
        className="text-[15px] md:text-[17px] text-[var(--color-ink-muted)] max-w-[33rem] leading-[1.8] mb-11"
      />
      <CTAButton href="#beach-club">{c.cta}</CTAButton>
    </Section>
  );
}
