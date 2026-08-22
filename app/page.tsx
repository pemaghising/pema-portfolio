import Hero from "@/components/hero/Hero";
import Bio from "@/components/bio/Bio";
import WhatIDo from "@/components/services/WhatIDo";
import Currently from "@/components/currently/Currently";
import Philosophy from "@/components/philosophy/Philosophy";
import Experience from "@/components/experience/Experience";
import Tools from "@/components/tools/Tools";
import DesignTech from "@/components/technology/DesignTech";
import BeyondDesign from "@/components/personal/BeyondDesign";
import LookingForward from "@/components/looking-forward/LookingForward";
import Contact from "@/components/contact/Contact";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <main>
        <Hero />
        <Bio />
        <WhatIDo />
        <Currently />
        <Philosophy />
        <Experience />
        <Tools />
        <DesignTech />
        <BeyondDesign />
        <LookingForward />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
