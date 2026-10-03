import Image from "next/image";
import type { Project } from "@/data/site";

/**
 * The visual slot for a project. With a cover it shows the work; without one
 * it shows an honest typographic plate — never a stand-in image.
 * Sized with container units so it reads the same at 300px or full-bleed,
 * which keeps the shared-element morph seamless.
 */
export default function Plate({
  project,
  index,
  priority,
  sizes = "100vw",
  bare,
}: {
  project: Project;
  index: number;
  priority?: boolean;
  sizes?: string;
  /** Hide the plate's own title (the case-study page sets it as the h1). */
  bare?: boolean;
}) {
  const no = String(index + 1).padStart(2, "0");

  if (project.cover) {
    return (
      <div className="relative h-full w-full overflow-hidden bg-[var(--color-ink-soft)]">
        <Image
          src={project.cover.src}
          alt={project.cover.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`surface-ink relative flex h-full w-full flex-col justify-between overflow-hidden p-[4cqw] [container-type:size] ${bare ? "pt-[max(4cqw,112px)]" : ""}`}
      role="img"
      aria-label={`${project.title} — visual in preparation`}
    >
      <div className="t-micro flex justify-between text-[max(10px,1.6cqw)]">
        <span>No. {no}</span>
        <span className="muted">Visual in preparation</span>
      </div>
      <p
        aria-hidden={bare}
        className={`wide text-center text-[min(13cqw,26cqh)] leading-[0.85] font-bold tracking-[-0.045em] text-balance ${bare ? "invisible" : ""}`}
      >
        {project.title}
      </p>
      <div className="relative h-[3cqw] min-h-3">
        <div
          className="absolute inset-0 opacity-40"
          style={{
            backgroundImage: "linear-gradient(90deg, var(--color-paper) 1px, transparent 1px)",
            backgroundSize: "2.5% 40%",
            backgroundRepeat: "repeat-x",
            backgroundPosition: "bottom",
          }}
        />
        <div className="absolute inset-x-0 bottom-0 h-px bg-[var(--color-paper)] opacity-40" />
        <div className="absolute top-0 bottom-0 left-0 w-[2px] bg-[var(--color-accent)]" />
      </div>
    </div>
  );
}
