import Nav from "@/components/site/Nav";
import Footer from "@/components/site/Footer";
import Hero from "@/components/hero/Hero";
import Marquee from "@/components/sections/Marquee";
import About from "@/components/sections/About";
import Impact from "@/components/sections/Impact";
import Experience from "@/components/sections/Experience";
import Projects from "@/components/sections/Projects";
import Contact from "@/components/sections/Contact";

export default function Home() {
  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-4 focus:py-2 focus:text-bg"
      >
        Skip to content
      </a>
      <Nav />
      <main id="main">
        <Hero />
        <Marquee />
        <About />
        <Impact />
        <Experience />
        <Projects />
        <Contact />
      </main>
      <Footer year={new Date().getFullYear()} />
    </>
  );
}
