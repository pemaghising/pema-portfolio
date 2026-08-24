import Hero from "@/components/hero/Hero";
import Bio from "@/components/bio/Bio";
import WhatIDo from "@/components/services/WhatIDo";
import Experience from "@/components/experience/Experience";
import Currently from "@/components/currently/Currently";
import Philosophy from "@/components/philosophy/Philosophy";
import DesignTech from "@/components/technology/DesignTech";
import Tools from "@/components/tools/Tools";
import BeyondDesign from "@/components/personal/BeyondDesign";
import LookingForward from "@/components/looking-forward/LookingForward";
import Contact from "@/components/contact/Contact";

export default function Home() {
  return (
    <main id="main-content">
      <Hero />
      <Bio />
      <WhatIDo />
      <Experience />
      <Currently />
      <Philosophy />
      <DesignTech />
      <Tools />
      <BeyondDesign />
      <LookingForward />
      <Contact />
    </main>
  );
}
