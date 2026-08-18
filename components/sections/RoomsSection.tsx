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
        className="font-display text-5xl md:text-6xl lg:text-7xl mt-4 mb-5"
      />
      <TextReveal
        text={c.subheadline}
        className="text-base md:text-lg text-[var(--color-ink-muted)] max-w-xl leading-relaxed mb-8"
      />

      <div className="flex gap-6 overflow-x-auto snap-x pb-2 md:pb-0 md:overflow-visible md:grid md:grid-cols-3 md:gap-x-8 md:gap-y-7 mb-9 -mx-1 px-1">
        {c.items.map((item, i) => (
          <RoomCard key={item.name} name={item.name} text={item.text} index={i} />
        ))}
      </div>

      <CTAButton href="#contacts">{c.cta}</CTAButton>
    </Section>
  );
}
