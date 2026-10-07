import Image from "next/image";
import Link from "next/link";
import MissingPath from "@/components/site/MissingPath";
import Reveal from "@/components/ui/Reveal";
import SplitText from "@/components/ui/SplitText";
import { ArrowLeft, ArrowUpRight } from "@/components/ui/Icons";
import wanderer from "@/assets/me/commute.webp";

export default function NotFound() {
  return (
    <main id="main" className="relative flex min-h-svh items-center overflow-hidden py-24">
      <div
        aria-hidden
        className="dot-grid pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_55%_at_30%_50%,black,transparent)]"
      />
      <div aria-hidden className="pointer-events-none absolute -right-40 top-1/4 h-[520px] w-[520px] rounded-full bg-accent/10 blur-[130px]" />

      <div className="shell relative grid w-full items-center gap-14 lg:grid-cols-12">
        <div className="lg:col-span-8">
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

        <Reveal delay={0.5} className="lg:col-span-4">
          <figure className="w-[min(300px,72vw)] rotate-[4deg] rounded-[6px] bg-[#f3f0ea] p-2.5 shadow-[0_28px_60px_-24px_rgba(0,0,0,0.85)] transition-transform duration-700 ease-expo hover:rotate-0 lg:ml-auto">
            <div className="relative aspect-square overflow-hidden rounded-[3px] bg-[#e4dfd6]">
              <Image
                src={wanderer}
                alt="Illustration of Lucas outdoors with a backpack, headphones round his neck and a coffee to go"
                fill
                sizes="300px"
                placeholder="blur"
                className="object-cover"
              />
            </div>
            <figcaption className="serif-accent px-1 pb-1 pt-3 text-[19px] leading-tight text-[#2b2724]">
              Took a wrong turn? Happens to me too.
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </main>
  );
}
