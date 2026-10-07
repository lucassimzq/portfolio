import SplitText from "./SplitText";
import Reveal from "./Reveal";

export default function SectionHeading({
  index,
  label,
  title,
  intro,
}: {
  index: string;
  label: string;
  title: string;
  intro?: React.ReactNode;
}) {
  return (
    <header className="mb-14 grid gap-8 md:mb-20 lg:grid-cols-12 lg:items-end">
      <div className="lg:col-span-8">
        <Reveal y={12} className="eyebrow flex items-center gap-3">
          <span className="text-accent">{index}</span>
          <span className="h-px w-10 bg-line-strong" />
          {label}
        </Reveal>
        <SplitText
          as="h2"
          text={title}
          className="display mt-6 text-[clamp(40px,6.2vw,96px)] [font-stretch:88%]"
        />
      </div>
      {intro && (
        <Reveal delay={0.15} className="text-[17px] leading-relaxed text-ink-2 lg:col-span-4 lg:pb-3">
          {intro}
        </Reveal>
      )}
    </header>
  );
}
