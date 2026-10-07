import { Fragment } from "react";

// Typography for the long-form case studies. Section numbers come from a CSS counter
// on .article-body, so headings stay plain text.

export function H2({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="article-h2 mb-6 mt-20 text-[clamp(26px,3vw,36px)] font-medium leading-[1.12] tracking-[-0.03em] text-ink">
      {children}
    </h2>
  );
}

export function H3({ children }: { children: React.ReactNode }) {
  return (
    <h3 className="mb-3 mt-12 flex items-baseline gap-3 text-[19px] font-medium tracking-[-0.01em] text-ink">
      <span aria-hidden className="h-px w-5 shrink-0 translate-y-[-0.3em] bg-accent" />
      <span>{children}</span>
    </h3>
  );
}

export function P({ children }: { children: React.ReactNode }) {
  return <p className="mb-6 text-[17px] leading-[1.75] text-ink-2">{children}</p>;
}

export function Code({ children }: { children: React.ReactNode }) {
  return (
    <code className="rounded-md border border-line bg-elev px-1.5 py-0.5 font-mono text-[0.82em] text-peach">{children}</code>
  );
}

// Just enough highlighting for short Go / JSON snippets: comments, strings, keywords, numbers.
const TOKEN =
  /(\/\/[^\n]*)|("(?:[^"\\\n]|\\.)*"|`[^`]*`)|\b(func|return|var|type|struct|map|for|range|if|nil|defer|go|const|package|import|true|false)\b|\b(\d+(?:\.\d+)?)\b/g;

function highlight(src: string) {
  const out: React.ReactNode[] = [];
  let last = 0;
  for (const mt of src.matchAll(TOKEN)) {
    const i = mt.index ?? 0;
    if (i > last) out.push(<Fragment key={`t${last}`}>{src.slice(last, i)}</Fragment>);
    const [text, comment, str, kw] = mt;
    const cls = comment ? "text-ink-3 italic" : str ? "text-peach" : kw ? "text-accent" : "text-ink";
    out.push(
      <span key={`k${i}`} className={cls}>
        {text}
      </span>,
    );
    last = i + text.length;
  }
  if (last < src.length) out.push(<Fragment key={`t${last}`}>{src.slice(last)}</Fragment>);
  return out;
}

export function CodeBlock({ children, lang }: { children: string; lang?: string }) {
  return (
    <figure className="my-8 overflow-hidden rounded-xl border border-line-strong bg-elev">
      <figcaption className="flex items-center justify-between border-b border-line px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#e5e5e5]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e5e5e5]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#e5e5e5]" />
        </span>
        {lang && <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-ink-3">{lang}</span>}
      </figcaption>
      <pre className="overflow-x-auto p-5 font-mono text-[13px] leading-[1.75] text-ink-2">
        <code>{highlight(children)}</code>
      </pre>
    </figure>
  );
}

export function Ul({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="mb-6 grid gap-3">
      {items.map((item, i) => (
        <li key={i} className="relative pl-7 text-[17px] leading-[1.7] text-ink-2">
          <span aria-hidden className="absolute left-0 top-[0.85em] h-px w-3.5 bg-accent" />
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Table({ headers, rows }: { headers: string[]; rows: string[][] }) {
  return (
    <div className="my-8 overflow-x-auto rounded-2xl border border-line">
      <table className="w-full border-collapse text-left text-[14.5px]">
        <thead>
          <tr className="bg-elev">
            {headers.map((h) => (
              <th key={h} className="px-4 py-3 font-mono text-[11px] font-normal uppercase tracking-[0.14em] text-accent">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-line transition-colors duration-300 hover:bg-elev">
              {row.map((cell, j) => (
                <td key={j} className={`px-4 py-3 align-top leading-relaxed ${j === 0 ? "text-ink" : "text-ink-2"}`}>
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function Divider() {
  return (
    <div aria-hidden className="my-16 flex items-center gap-4 text-accent">
      <span className="h-px flex-1 bg-line" />
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5">
        <path
          fill="currentColor"
          d="M12 0c.6 5.6 1.9 8.9 4 10.2 1.6 1 4.3 1.5 8 1.8-5.6.6-8.9 1.9-10.2 4-1 1.6-1.5 4.3-1.8 8-.6-5.6-1.9-8.9-4-10.2C6.4 12.8 3.7 12.3 0 12c5.6-.6 8.9-1.9 10.2-4C11.2 6.4 11.7 3.7 12 0Z"
        />
      </svg>
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

export function Colophon({ children }: { children: React.ReactNode }) {
  return <p className="font-mono text-[12px] uppercase tracking-[0.12em] text-ink-3">{children}</p>;
}
