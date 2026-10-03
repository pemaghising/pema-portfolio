import { About } from "@/components/About";
import { Contact } from "@/components/Contact";
import { Hero } from "@/components/Hero";
import { Library } from "@/components/Library";
import { kana, projects, site } from "@/data/site";

export default function Home() {
  return (
    <main id="main">
      <Hero name={site.name} role={site.role} years={site.years} kana={kana} statement={site.statement} trackCount={projects.length} />
      <Library projects={projects} kana={kana} />
      <About />
      <Contact />
    </main>
  );
}
