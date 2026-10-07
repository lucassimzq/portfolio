import Topbar from "@/components/site/Topbar";
import Footer from "@/components/site/Footer";
import Hero from "@/components/hero/Hero";
import About from "@/components/sections/About";
import Proof from "@/components/sections/Proof";
import Career from "@/components/sections/Career";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-ink focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to content
      </a>
      <Topbar />
      <main id="main">
        <Hero />
        <About />
        <Proof />
        <Career />
        <Projects />
        <Contact />
      </main>
      <Footer year={new Date().getFullYear()} />
    </>
  );
}
