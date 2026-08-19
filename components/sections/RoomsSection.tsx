import { content } from "@/lib/content";
import Section from "@/components/ui/Section";
import Label from "@/components/ui/Label";
import TextReveal from "@/components/ui/TextReveal";
import CTAButton from "@/components/ui/CTAButton";
import RoomCard from "@/components/ui/RoomCard";

export default function RoomsSection() {
  const c = content.rooms;
  return (
    <Section id="rooms" index={4}>
      <Label>{c.label}</Label>
      <TextReveal
        as="h2"
        text={c.headline}
        wordSplit
        className="font-display font-semibold text-4xl sm:text-5xl md:text-6xl lg:text-7xl mt-3 md:mt-4 mb-3 md:mb-5"
      />
      <TextReveal
        text={c.subheadline}
        className="text-sm md:text-lg text-[var(--color-ink-muted)] max-w-xl mx-auto leading-relaxed mb-5 md:mb-8"
      />

      {/* Phones stack the cards and let the section's own scroll area carry them.
          They used to sit in a horizontal rail, which showed one room out of six with
          nothing to say the others existed — and the rail could not even be swiped,
          since the stage cancels any touch that is not walking a vertical scroll
          area. Tablets up have the room for the grid. */}
      <div className="flex flex-col gap-7 md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-7 mb-6 md:mb-9">
        {c.items.map((item) => (
          <RoomCard key={item.name} name={item.name} meta={item.meta} text={item.text} />
        ))}
      </div>

      <CTAButton href="#contacts">{c.cta}</CTAButton>
    </Section>
  );
}
