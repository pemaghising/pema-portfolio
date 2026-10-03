import Image from "next/image";
import type { Project } from "@/data/site";

export const INKS = ["#F26A21", "#14A39E", "#E9AE0B", "#2D3E78"];

/**
 * The J-card front of a project's cassette. Shows Pema's cover art when `cover` is set,
 * otherwise a typographic placeholder (four layouts, the project's ink) with an "In prep" sticker.
 */
export function CoverArt({ project, index, kana, sizes = "(max-width: 560px) 45vw, 240px" }: { project: Project; index: number; kana: string; sizes?: string }) {
  const no = String(index + 1).padStart(3, "0");
  const v = (index % 4) + 1;
  const ready = Boolean(project.sections?.length || project.href);
  if (project.cover) {
    return (
      <div className="art">
        <Image src={project.cover.src} alt={project.cover.alt} fill sizes={sizes} style={{ objectFit: "cover" }} />
      </div>
    );
  }
  const ttl = <div className="ttl">{project.title}</div>;
  const bot = (b: string) => (
    <div className="bot">
      <span>{kana}</span>
      <span>{b}</span>
    </div>
  );
  return (
    <div className="art" aria-hidden="true" style={{ ["--ink" as string]: INKS[index % 4] }}>
      <div className={`jc v${v}`}>
        {v === 1 && (
          <>
            <div className="top">
              <span>PG-{no}</span>
              <span>TYPE II</span>
            </div>
            {ttl}
            <div className="stripes">
              <i />
              <i />
              <i />
            </div>
            {bot("C-60")}
          </>
        )}
        {v === 2 && (
          <>
            <div className="top">
              <span>PG-{no}</span>
              <span>SIDE A</span>
            </div>
            {ttl}
            <div className="num">{no}</div>
            {bot("STEREO")}
          </>
        )}
        {v === 3 && (
          <>
            <div className="top">
              <span>PG-{no}</span>
              <span>CHROME</span>
            </div>
            <div className="sun" />
            {ttl}
            {bot("C-90")}
          </>
        )}
        {v === 4 && (
          <>
            <div className="top">
              <span>PG-{no}</span>
              <span>SIDE B</span>
            </div>
            <div className="band" />
            {ttl}
            {bot("TYPE I")}
          </>
        )}
      </div>
      {!ready && (
        <span className="sticker">
          In
          <br />
          prep
        </span>
      )}
    </div>
  );
}
