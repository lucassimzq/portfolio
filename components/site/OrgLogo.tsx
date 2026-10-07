import Image from "next/image";
import { ORGS, type OrgId } from "@/lib/data";

/** A company's logo on a tile, or its short mark until a logo file is added to ORGS. */
export default function OrgLogo({ org, size = 44, className = "" }: { org: OrgId; size?: number; className?: string }) {
  const { logo, mark } = ORGS[org];
  return (
    <span
      aria-hidden
      className={`inline-flex shrink-0 items-center justify-center overflow-hidden rounded-[28%] border border-line-strong bg-[#17171a] ${className}`}
      style={{ width: size, height: size }}
    >
      {logo ? (
        <Image src={logo} alt="" width={size} height={size} className="h-[72%] w-[72%] object-contain" />
      ) : (
        <span className="font-medium tracking-[-0.04em] text-ink" style={{ fontSize: size * (mark.length > 2 ? 0.3 : 0.38) }}>
          {mark}
        </span>
      )}
    </span>
  );
}
