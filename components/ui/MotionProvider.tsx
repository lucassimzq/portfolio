"use client";

import { LazyMotion, MotionConfig, domAnimation } from "motion/react";

// One place to opt the whole site into reduced motion and the slim feature bundle.
export default function MotionProvider({ children }: { children: React.ReactNode }) {
  return (
    <LazyMotion features={domAnimation}>
      <MotionConfig reducedMotion="user">{children}</MotionConfig>
    </LazyMotion>
  );
}
