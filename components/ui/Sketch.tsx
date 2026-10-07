import type { CSSProperties } from "react";

/**
 * Lucas's own line drawings of himself, traced to vectors (public/me/line). Each is
 * painted through a mask, so the lines take whatever colour the page gives them:
 * ink at rest, orange under the pointer.
 */
const SKETCHES = {
  mug: [263, 311],
  "mug-circle": [340, 343],
  desk: [380, 384],
  tennis: [371, 336],
  gaming: [369, 336],
  cat: [369, 328],
  skyline: [380, 348],
  commute: [369, 355],
} as const;

export type SketchName = keyof typeof SKETCHES;

export default function Sketch({ name, alt, className = "", style }: { name: SketchName; alt?: string; className?: string; style?: CSSProperties }) {
  const [w, h] = SKETCHES[name];
  return (
    <span
      role={alt ? "img" : undefined}
      aria-label={alt}
      aria-hidden={alt ? undefined : true}
      className={`sketch ${className}`}
      style={{ "--sketch": `url(/me/line/${name}.svg)`, aspectRatio: `${w} / ${h}`, ...style } as CSSProperties}
    />
  );
}
