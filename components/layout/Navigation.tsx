import PGMark from "@/components/pg/PGMark";
import { siteMeta } from "@/data/content";

export default function Navigation() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between bg-background/90 px-8 py-6 backdrop-blur-md">
      <a
        href="#top"
        aria-label={`${siteMeta.name} — ${siteMeta.role}. Back to top.`}
        className="group relative rounded-sm outline-none before:absolute before:inset-[-14px] before:content-[''] focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        <PGMark variant="compact" />
      </a>
    </header>
  );
}
