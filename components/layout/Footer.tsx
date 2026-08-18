import Image from "next/image";
import { content } from "@/lib/content";

export default function Footer() {
  return (
    <footer id="contacts" className="relative z-20 border-t border-[var(--color-foam-faint)] bg-[var(--color-abyss)] px-6 md:px-20 py-16">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row md:items-end md:justify-between gap-10">
        <div>
          <Image
            src="/brand/nemo-logo.svg"
            alt="NEMO Hotel Resort & SPA"
            width={300}
            height={109}
            className="w-40 h-auto mb-5"
          />
          <p className="text-sm text-[var(--color-foam-muted)] max-w-sm leading-relaxed">
            {content.footer.address}
          </p>
        </div>

        <div className="flex flex-col gap-2 font-mono-label text-[12px] text-white">
          <a href={`tel:${content.footer.phone.replace(/\s+/g, "")}`} className="hover:text-[var(--color-current)] transition-colors">
            {content.footer.phone}
          </a>
          <a href={`mailto:${content.footer.email}`} className="hover:text-[var(--color-current)] transition-colors">
            {content.footer.email}
          </a>
        </div>
      </div>

      <p className="mt-14 text-center text-[10px] font-mono-label text-[var(--color-foam-muted)]">
        &copy; {new Date().getFullYear()} NEMO Hotel Resort &amp; SPA — Lanzheron Beach, Odesa
      </p>
    </footer>
  );
}
