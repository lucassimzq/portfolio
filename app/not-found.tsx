"use client";

import Link from "next/link";
import Topbar from "@/components/site/Topbar";
import MissingPath from "@/components/site/MissingPath";
import { Plate } from "@/components/ui/Figure";
import { at } from "@/components/ui/InView";
import { ArrowLeft } from "@/components/ui/Icons";

export default function NotFound() {
  return (
    <>
      <Topbar />
      <main id="main" className="shell grid min-h-[calc(100svh-var(--topbar))] items-center py-16">
        <div className="rise mx-auto grid w-full max-w-[420px] justify-items-center text-center">
          <div className="w-full" style={at(0)}>
            <Plate
              name="drawer"
              label="A cabinet of three drawers; the one the pointer picks slides out, empty"
              fig="404"
              note="Not found"
              hint="Open a drawer"
              intensity={0.8}
            />
          </div>
          <h1 className="hero-title mt-8" style={at(1)}>
            Nothing in <em>this</em> drawer.
          </h1>
          <p className="mt-4 rounded-lg bg-stone px-3 py-2 font-mono text-[12.5px] text-ink-3" style={at(2)}>
            <span className="text-faint">$</span> open <MissingPath />
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-2" style={at(3)}>
            <Link href="/" className="btn btn-primary">
              <ArrowLeft size={15} /> Back home
            </Link>
            <Link href="/#projects" className="btn">
              See the projects
            </Link>
          </div>
        </div>
      </main>
    </>
  );
}
