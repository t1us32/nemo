import { content } from "@/lib/content";
import Section from "@/components/ui/Section";
import Label from "@/components/ui/Label";
import TextReveal from "@/components/ui/TextReveal";
import CTAButton from "@/components/ui/CTAButton";

export default function RestaurantSection() {
  const c = content.restaurant;
  return (
    <Section id="restaurants" index={3}>
      <Label>{c.label}</Label>
      <TextReveal
        as="h2"
        text={c.headline}
        wordSplit
        className="font-display font-semibold text-5xl md:text-6xl lg:text-7xl mt-4 mb-5"
      />
      <TextReveal
        text={c.subheadline}
        className="text-base md:text-lg text-[var(--color-ink-muted)] max-w-xl mx-auto leading-relaxed mb-9"
      />
      <CTAButton href="#contacts">{c.cta}</CTAButton>
    </Section>
  );
}
