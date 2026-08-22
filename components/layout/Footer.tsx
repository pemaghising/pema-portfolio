import PGMark from "@/components/pg/PGMark";
import { footerContent, siteMeta } from "@/data/content";

export default function Footer() {
  return (
    <footer className="relative border-t border-primary/15 px-6 py-16 md:px-10">
      <div className="grid grid-cols-editorial items-end gap-x-4 gap-y-10">
        <div className="col-span-12 md:col-span-7">
          <PGMark
            variant="hero"
            autoPlay={false}
            className="text-[clamp(3rem,8vw,5rem)] leading-[0.85]"
          />
        </div>
        <p className="col-span-12 text-pretty font-sans text-xs uppercase tracking-[0.2em] text-secondary md:col-span-4 md:col-start-9 md:text-right">
          {siteMeta.role}
        </p>
      </div>

      <div className="mt-16 flex flex-col gap-2 border-t border-primary/15 pt-8 font-sans text-xs uppercase tracking-[0.2em] text-secondary md:flex-row md:items-center md:justify-between">
        <span>{footerContent.copyright}</span>
        <span>{footerContent.closingLine}</span>
      </div>
    </footer>
  );
}
