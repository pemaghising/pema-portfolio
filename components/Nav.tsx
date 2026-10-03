import Link from "next/link";
import { experience, nav, site } from "@/data/site";

/** Device strip: power LED, name, links as hardware buttons. No timecode, no section label. */
export function Nav() {
  const now = experience[0];
  return (
    <header className="label fixed inset-x-0 top-0 z-50 grid grid-cols-[1fr_auto] items-center gap-4 px-(--gutter) pt-[calc(16px+env(safe-area-inset-top,0px))] pb-4 md:grid-cols-[1.2fr_1fr_1fr_auto]">
      <Link href="/" className="no-underline">
        {site.name}
      </Link>
      <span className="hidden text-ink-2 md:block">{site.role}</span>
      <span className="hidden text-ink-2 md:block">
        {site.years} years{now ? ` · ${now.company}` : ""}
      </span>
      <nav aria-label="Primary">
        <ul className="flex gap-1.5">
          {nav.map((n) => (
            <li key={n.href} className={n.label === "Experiments" ? "hidden sm:block" : undefined}>
              <Link
                href={n.href}
                className="block rounded-full border-[1.5px] border-graphite px-2.5 py-[7px] leading-none transition-[transform,background-color,color] duration-150 hover:bg-graphite hover:text-studio active:translate-y-px"
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
