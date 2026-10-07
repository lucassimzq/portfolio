import Link from "next/link";
import MissingPath from "@/components/site/MissingPath";
import Reveal from "@/components/ui/Reveal";
import SplitText from "@/components/ui/SplitText";
import { ArrowLeft, ArrowUpRight } from "@/components/ui/Icons";

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-svh items-center overflow-hidden py-24">
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_55%_at_30%_50%,black,transparent)]"
      />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full bg-accent/10 blur-[130px]" />

      <div className="shell relative w-full">
        <Reveal y={12} className="eyebrow flex items-center gap-3">
          <span className="text-accent">Error 404</span>
          <span className="h-px w-10 bg-line-strong" />
          Page not found
        </Reveal>
        <SplitText as="h1" text="Off the *map.*" className="display mt-6 text-[clamp(64px,11vw,168px)] [font-stretch:86%]" stagger={0.08} />

        <Reveal delay={0.3} className="mt-10 max-w-[640px] rounded-2xl border border-line bg-[#0c0c0e] p-5 font-mono text-[13px] leading-[1.8]">
          <div className="text-ink-3">
            <span className="text-accent">$</span> git checkout <MissingPath />
          </div>
          <div className="text-err">error: pathspec did not match any page known to this site</div>
        </Reveal>

        <Reveal delay={0.4} className="mt-10 flex flex-wrap gap-3">
          <Link href="/" className="btn btn-primary">
            <ArrowLeft size={16} /> Back to the homepage
          </Link>
          <Link href="/#projects" className="btn btn-ghost">
            See the projects <ArrowUpRight size={16} className="btn-icon-x" />
          </Link>
        </Reveal>
      </div>
    </main>
  );
}
