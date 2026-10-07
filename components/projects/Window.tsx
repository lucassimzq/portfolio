import { Lock } from "@/components/ui/Icons";

/** Minimal window chrome for the live project previews: an address bar for web demos, a title for apps. */
export default function Window({
  chrome,
  children,
  className = "",
}: {
  chrome: { url: string } | { title: string };
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`flex flex-col overflow-hidden rounded-2xl border border-line-strong bg-[#0c0c0e] shadow-[0_40px_120px_-40px_rgba(0,0,0,0.9)] ${className}`}
    >
      <div className="flex items-center gap-3 border-b border-line px-4 py-2.5">
        <div className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#2b2b30]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#2b2b30]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#2b2b30]" />
        </div>
        {"url" in chrome ? (
          <div className="mx-auto flex min-w-0 items-center gap-2 rounded-md bg-[#151518] px-3 py-1 font-mono text-[11px] text-ink-3">
            <Lock size={10} className="shrink-0" />
            <span className="truncate">{chrome.url}</span>
          </div>
        ) : (
          <div className="mx-auto min-w-0 truncate py-1 font-mono text-[11px] text-ink-3">{chrome.title}</div>
        )}
        <span className="w-[42px]" aria-hidden />
      </div>
      <div className="relative min-h-0 flex-1">{children}</div>
    </div>
  );
}
