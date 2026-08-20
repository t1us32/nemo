import Image from "next/image";
import { content } from "@/lib/content";

export default function Footer() {
  return (
    <footer
      id="contacts"
      className="relative z-20 border-t border-[var(--color-foam-faint)] bg-[var(--color-abyss)] py-20 md:py-24"
      style={{ paddingLeft: "var(--gutter)", paddingRight: "var(--gutter)" }}
    >
      <div className="flex flex-col gap-14 md:flex-row md:items-end md:justify-between md:gap-10">
        <div>
          <Image
            src="/brand/nemo-logo.svg"
            alt="NEMO Hotel Resort & SPA"
            width={300}
            height={109}
            className="mb-7 h-auto w-36"
          />
          <p className="max-w-sm text-[15px] leading-[1.8] text-[var(--color-foam-muted)]">
            {content.footer.address}
          </p>
        </div>

        {/* The two ways to reach the hotel, set at the size the page sets a headline
            at rather than the size it sets small print at — on a page selling a stay,
            the phone number is the last thing anyone is looking for. */}
        <div className="flex flex-col gap-3">
          <a
            href={`tel:${content.footer.phone.replace(/\s+/g, "")}`}
            className="font-display-sm text-[22px] md:text-[26px] leading-none text-[var(--color-foam)] transition-colors duration-500 hover:text-[var(--color-gilt-soft)]"
          >
            {content.footer.phone}
          </a>
          <a
            href={`mailto:${content.footer.email}`}
            className="font-display-sm text-[22px] md:text-[26px] leading-none text-[var(--color-foam)] transition-colors duration-500 hover:text-[var(--color-gilt-soft)]"
          >
            {content.footer.email}
          </a>
        </div>
      </div>

      <p className="mt-20 font-label text-[9px] text-[var(--color-foam-muted)]">
        &copy; {new Date().getFullYear()} NEMO Hotel Resort &amp; SPA
      </p>
    </footer>
  );
}
