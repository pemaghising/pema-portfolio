import { ViewTransition } from "react";
import Experience from "@/components/Experience";
import Experiments from "@/components/Experiments";
import Footer from "@/components/Footer";
import Hero from "@/components/Hero";
import MotionSection from "@/components/MotionSection";
import Practice from "@/components/Practice";
import { About, Kit, Philosophy } from "@/components/Sections";
import Work from "@/components/Work";

export default function Home() {
  const year = new Date().getFullYear();
  return (
    <ViewTransition
      enter={{ "nav-back": "page", default: "none" }}
      exit={{ "to-case": "page", default: "none" }}
      default="none"
    >
      <main id="main">
        <Hero />
        <Work />
        <About />
        <Philosophy />
        <Experience now={year} />
        <Practice />
        <MotionSection />
        <Experiments />
        <Kit />
        <Footer year={year} />
      </main>
    </ViewTransition>
  );
}
