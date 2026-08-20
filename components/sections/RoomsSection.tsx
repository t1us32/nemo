import { content } from "@/lib/content";
import Section from "@/components/ui/Section";
import Label from "@/components/ui/Label";
import TextReveal from "@/components/ui/TextReveal";
import CTAButton from "@/components/ui/CTAButton";
import RoomCard from "@/components/ui/RoomCard";

export default function RoomsSection() {
  const c = content.rooms;
  return (
    <Section id="rooms" index={5}>
      <Label>{c.label}</Label>
      <TextReveal
        as="h2"
        text={c.headline}
        wordSplit
        className="font-display font-normal text-[clamp(2.25rem,5.5vw,4.25rem)] leading-[0.98] mt-8 mb-7"
      />
      <TextReveal
        text={c.subheadline}
        className="text-[15px] md:text-[17px] text-[var(--color-ink-muted)] max-w-[33rem] leading-[1.8] mb-9"
      />

      {/* One column of ruled rows, not a grid of cards: the rest has to fit inside a
          single frame of footage, and six rows of fact do that where six paragraphs
          never could. The closing rule under the last row shuts the list. */}
      <div className="mb-10 w-full max-w-[38rem] border-b border-[var(--color-ink-faint)]">
        {c.items.map((item) => (
          <RoomCard key={item.name} name={item.name} meta={item.meta} />
        ))}
      </div>

      <CTAButton href="#contacts">{c.cta}</CTAButton>
    </Section>
  );
}
