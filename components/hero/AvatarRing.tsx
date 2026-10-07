import { Fragment } from "react";
import Sketch from "@/components/ui/Sketch";
import { PROFILE } from "@/lib/data";

const R = 88;
/** A full circle starting at nine o'clock, so the words read clockwise over the top. */
const CIRCLE = `M${100 - R} 100a${R} ${R} 0 1 1 ${2 * R} 0a${R} ${R} 0 1 1 ${-2 * R} 0`;
const WORDS = ["Open to AU / NZ", PROFILE.role, `${PROFILE.years} years`, "Kuala Lumpur"];

/**
 * Lucas in line art, with who and where he is set round him in a slowly turning ring.
 * The lines go orange under the pointer and the ring picks up speed.
 */
export default function AvatarRing() {
  return (
    <div className="avatar-ring">
      <svg viewBox="0 0 200 200" className="avatar-ring-text" aria-hidden>
        <defs>
          <path id="avatar-ring-path" d={CIRCLE} />
        </defs>
        <text>
          <textPath href="#avatar-ring-path" textLength={2 * Math.PI * R - 2} lengthAdjust="spacing">
            {WORDS.map((w) => (
              <Fragment key={w}>
                {w.toUpperCase()}
                <tspan className="avatar-ring-star"> ✱ </tspan>
              </Fragment>
            ))}
          </textPath>
        </text>
      </svg>
      <Sketch name="mug-circle" alt="Line drawing of Lucas in headphones, sipping from a mug with a code icon on it" className="avatar-ring-face" />
    </div>
  );
}
