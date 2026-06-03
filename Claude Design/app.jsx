/* ============================================================================
 * PORTFOLIO — app.jsx
 * Dense, terminal-inspired backend engineer portfolio
 * ========================================================================= */

const { useState, useEffect, useRef } = React;
const {
  TweaksPanel, useTweaks, TweakSection,
  TweakColor, TweakToggle,
} = window;

// ── Accent color options ────────────────────────────────────────────────────
const ACCENT_OPTIONS = ['#4ade80', '#fbbf24', '#22d3ee', '#818cf8'];

function accentVars(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return {
    accent: hex,
    dim: `rgba(${r},${g},${b},0.08)`,
    border: `rgba(${r},${g},${b},0.2)`,
  };
}

// ── Content data ────────────────────────────────────────────────────────────
const SKILLS = [
  { cat: 'Languages', items: ['Go', 'PHP', 'Python'] },
  { cat: 'Frameworks', items: ['Laravel'] },
  { cat: 'Data', items: ['PostgreSQL', 'Redis', 'Schema Design', 'Query Optimization'] },
  { cat: 'Infrastructure', items: ['AWS', 'Microservices', 'API Design'] },
  { cat: 'Practices', items: ['S2S Communication', 'Load Analysis', 'Legacy Migration', 'Indexing'] },
];

const EXPERIENCE = [
  {
    period: '2022 → present',
    company: 'GXBank & qBayar',
    industry: 'Fintech',
    desc: 'Building Go microservices for eKYC, onboarding, and risk assessment flows. Secure payment gateways with high-availability requirements.',
  },
  {
    period: '2020 → 2022',
    company: 'Skribble Lab',
    industry: 'Edtech',
    desc: 'Engineered real-time collaborative learning environments and content delivery systems.',
  },
  {
    period: '2017 → 2020',
    company: 'Offgamers',
    industry: 'E-commerce',
    desc: 'Optimized gaming commerce platforms handling global transactions and inventory management.',
  },
];

// ── Hooks ────────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.08) {
  const ref = useRef(null);
  const [v, setV] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setV(true); obs.disconnect(); } },
      { threshold }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, v];
}

function useActiveSection(ids) {
  const [active, setActive] = useState(ids[0]);
  useEffect(() => {
    const obs = [];
    ids.forEach(id => {
      const el = document.getElementById(id);
      if (!el) return;
      const o = new IntersectionObserver(
        ([e]) => { if (e.isIntersecting) setActive(id); },
        { rootMargin: '-35% 0px -60% 0px' }
      );
      o.observe(el);
      obs.push(o);
    });
    return () => obs.forEach(o => o.disconnect());
  }, []);
  return active;
}

// ── Building blocks ─────────────────────────────────────────────────────────
function Label({ text }) {
  return (
    <div style={{
      fontSize: 12, color: 'var(--text-3)', marginBottom: 16,
      letterSpacing: '0.04em',
    }}>
      <span style={{ color: 'var(--accent)' }}>//</span> {text}
    </div>
  );
}

function Reveal({ children, id, style, tag }) {
  const [ref, vis] = useReveal();
  const Tag = tag || 'section';
  return (
    <Tag ref={ref} id={id} data-screen-label={id} style={{
      ...style,
      opacity: vis ? 1 : 0,
      transform: vis ? 'translateY(0)' : 'translateY(16px)',
      transition: 'opacity 0.6s ease-out, transform 0.6s ease-out',
    }}>
      {children}
    </Tag>
  );
}

// ── Nav ─────────────────────────────────────────────────────────────────────
function Nav() {
  const active = useActiveSection(['about', 'skills', 'experience', 'education']);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', fn, { passive: true });
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const goTo = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 56;
    window.scrollTo({ top: y, behavior: 'smooth' });
  };

  const navStyle = {
    position: 'sticky', top: 0, zIndex: 100,
    background: scrolled ? 'rgba(10,10,12,0.9)' : 'transparent',
    backdropFilter: scrolled ? 'blur(12px)' : 'none',
    WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
    borderBottom: `1px solid ${scrolled ? 'var(--border)' : 'transparent'}`,
    transition: 'background 0.3s, border-color 0.3s',
  };

  return (
    <nav style={navStyle}>
      <div className="container" style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        height: 48,
      }}>
        <div style={{ fontSize: 13, color: 'var(--text-3)', letterSpacing: '0.01em' }}>
          <span style={{ color: 'var(--accent)' }}>~</span>/portfolio
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          {['about', 'skills', 'experience', 'education'].map(id => (
            <button key={id} onClick={() => goTo(id)}
              className={`nav-link ${active === id ? 'active' : ''}`}>
              {id}
            </button>
          ))}
        </div>
      </div>
    </nav>
  );
}

// ── Hero ─────────────────────────────────────────────────────────────────────
function Hero() {
  const [step, setStep] = useState(0);
  const [typed, setTyped] = useState('');
  const [progress, setProgress] = useState(0);
  const cmd = '$ ./portfolio --init';

  /* type command */
  useEffect(() => {
    let i = 0;
    const delay = setTimeout(() => {
      const iv = setInterval(() => {
        i++;
        setTyped(cmd.slice(0, i));
        if (i >= cmd.length) { clearInterval(iv); setTimeout(() => setStep(1), 350); }
      }, 35);
    }, 500);
    return () => clearTimeout(delay);
  }, []);

  /* progress bar */
  useEffect(() => {
    if (step !== 1) return;
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 14 + 5;
      if (p >= 100) { p = 100; clearInterval(iv); setTimeout(() => setStep(2), 200); }
      setProgress(Math.min(p, 100));
    }, 50);
    return () => clearInterval(iv);
  }, [step]);

  /* status → content */
  useEffect(() => {
    if (step !== 2) return;
    const t = setTimeout(() => setStep(3), 500);
    return () => clearTimeout(t);
  }, [step]);

  const barLen = 22;
  const filled = Math.floor((progress / 100) * barLen);
  const bar = '\u2588'.repeat(filled) + '\u2591'.repeat(barLen - filled);

  return (
    <section id="hero" data-screen-label="hero"
      style={{ padding: '80px 0 48px', position: 'relative', overflow: 'hidden' }}>
      <div className="hero-glow"></div>
      <div className="container" style={{ position: 'relative' }}>

        {/* terminal lines */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ fontSize: 13, lineHeight: 2, color: 'var(--text-2)' }}>
            <span style={{ color: 'var(--accent)', marginRight: 8 }}>→</span>
            {typed}
            {step === 0 && <span className="cursor-blink">{'\u258C'}</span>}
          </div>

          {step >= 1 && (
            <div style={{
              fontSize: 12, lineHeight: 2, color: 'var(--text-3)',
              animation: 'fadeUp 0.2s ease-out',
            }}>
              [{bar}] {progress >= 100 ? 'done' : `${Math.floor(progress)}%`}
            </div>
          )}

          {step >= 2 && (
            <div style={{
              fontSize: 13, lineHeight: 2, color: 'var(--text-2)',
              animation: 'slideIn 0.3s ease-out',
            }}>
              <span style={{ color: 'var(--accent)', marginRight: 6 }}>✓</span>
              profile loaded
            </div>
          )}
        </div>

        {/* main content */}
        <div style={{
          opacity: step >= 3 ? 1 : 0,
          transform: step >= 3 ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 0.7s ease, transform 0.7s ease',
        }}>
          <h1 style={{
            fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em',
            marginBottom: 12, lineHeight: 1.2,
          }}>
            Backend Engineer
          </h1>
          <p style={{
            fontSize: 14, color: 'var(--text-2)', maxWidth: 480,
            lineHeight: 1.7, marginBottom: 20,
          }}>
            Moving across industries without losing depth
            — fintech, edtech, e-commerce, and everything in between.
          </p>
          <div style={{
            display: 'flex', gap: 8, fontSize: 12, color: 'var(--text-3)',
            alignItems: 'center', flexWrap: 'wrap',
          }}>
            <span>7 yrs experience</span>
            <span style={{ color: 'var(--border)' }}>·</span>
            <span>Malaysia</span>
            <span style={{ color: 'var(--border)' }}>·</span>
            <span>Currently{' '}<span style={{ color: 'var(--accent)' }}>@GXBank</span></span>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── About ───────────────────────────────────────────────────────────────────
function About() {
  return (
    <Reveal id="about" style={{ padding: '48px 0', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <Label text="about" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, maxWidth: 580 }}>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
            7 years of backend engineering experience, currently at GXBank
            building Go microservices for eKYC, onboarding, and risk
            assessment flows.
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
            Comfortable across the full backend lifecycle — from greenfield
            service design to maintaining and migrating legacy systems.
          </p>
          <p style={{ fontSize: 14, color: 'var(--text-2)', lineHeight: 1.7 }}>
            Worked across regulated and fast-moving environments, which means
            I care about{' '}
            <span style={{ color: 'var(--text-1)', fontWeight: 500 }}>
              correctness
            </span>, not just shipping fast.
          </p>
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            fontSize: 12, color: 'var(--text-3)', marginTop: 4,
          }}>
            <span style={{ color: 'var(--accent)', fontSize: 8 }}>◉</span>
            Based in Malaysia
          </div>
        </div>
      </div>
    </Reveal>
  );
}

// ── Skills ──────────────────────────────────────────────────────────────────
function SkillsSection() {
  return (
    <Reveal id="skills" style={{ padding: '48px 0', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <Label text="skills" />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {SKILLS.map((g, i) => (
            <div key={i} className="skill-row-inner" style={{
              display: 'flex', alignItems: 'baseline', gap: 16,
            }}>
              <div className="skill-label" style={{
                fontSize: 11, color: 'var(--accent)', textTransform: 'uppercase',
                letterSpacing: '0.06em', minWidth: 120, flexShrink: 0, fontWeight: 500,
              }}>
                {g.cat}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                {g.items.map((item, j) => (
                  <span key={j} className="skill-tag">{item}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

// ── Experience ──────────────────────────────────────────────────────────────
function ExperienceSection() {
  return (
    <Reveal id="experience" style={{ padding: '48px 0', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <Label text="experience" />
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {EXPERIENCE.map((exp, i) => (
            <div key={i} className="exp-entry">
              <div style={{
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', marginBottom: 6, flexWrap: 'wrap', gap: 8,
              }}>
                <span style={{
                  fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em',
                  padding: '2px 8px', background: 'var(--accent-dim)',
                  border: '1px solid var(--accent-border)', color: 'var(--accent)',
                  borderRadius: 3,
                }}>
                  {exp.industry}
                </span>
                <span style={{ fontSize: 11, color: 'var(--text-3)' }}>{exp.period}</span>
              </div>
              <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 6, lineHeight: 1.3 }}>
                {exp.company}
              </h3>
              <p style={{ fontSize: 13, color: 'var(--text-2)', lineHeight: 1.6 }}>
                {exp.desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

// ── Education ───────────────────────────────────────────────────────────────
function EducationSection() {
  return (
    <Reveal id="education" style={{ padding: '48px 0', borderTop: '1px solid var(--border)' }}>
      <div className="container">
        <Label text="education" />
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: 16, border: '1px solid var(--border)', borderRadius: 4,
          background: 'var(--bg-card)', flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4 }}>
              Bachelor of Computer Science
            </h3>
            <p style={{ fontSize: 13, color: 'var(--text-2)' }}>KDU University College</p>
          </div>
          <span style={{
            fontSize: 11, padding: '3px 8px', background: 'var(--accent-dim)',
            border: '1px solid var(--accent-border)', color: 'var(--accent)',
            borderRadius: 3, textTransform: 'uppercase', letterSpacing: '0.04em',
          }}>
            Conferred
          </span>
        </div>
      </div>
    </Reveal>
  );
}

// ── Footer ──────────────────────────────────────────────────────────────────
function PortfolioFooter() {
  return (
    <footer style={{
      padding: '32px 0', borderTop: '1px solid var(--border)', marginTop: 24,
    }}>
      <div className="container" style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        flexWrap: 'wrap', gap: 12,
      }}>
        <span style={{ fontSize: 11, color: 'var(--text-3)' }}>
          © 2026 · Built for performance and correctness.
        </span>
        <div style={{ display: 'flex', gap: 16 }}>
          <a href="#" className="nav-link" style={{ fontSize: 12 }}>GitHub</a>
          <a href="#" className="nav-link" style={{ fontSize: 12 }}>LinkedIn</a>
        </div>
      </div>
    </footer>
  );
}

// ── App ─────────────────────────────────────────────────────────────────────
const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accentColor": "#4ade80",
  "scanlines": false
}/*EDITMODE-END*/;

function App() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  const vars = accentVars(t.accentColor);

  useEffect(() => {
    const r = document.documentElement;
    r.style.setProperty('--accent', vars.accent);
    r.style.setProperty('--accent-dim', vars.dim);
    r.style.setProperty('--accent-border', vars.border);
  }, [vars.accent]);

  return (
    <React.Fragment>
      {t.scanlines && <div className="scanlines"></div>}
      <Nav />
      <main>
        <Hero />
        <About />
        <SkillsSection />
        <ExperienceSection />
        <EducationSection />
      </main>
      <PortfolioFooter />

      <TweaksPanel>
        <TweakSection label="Appearance" />
        <TweakColor
          label="Accent"
          value={t.accentColor}
          options={ACCENT_OPTIONS}
          onChange={(v) => setTweak('accentColor', v)}
        />
        <TweakToggle
          label="Scanlines"
          value={t.scanlines}
          onChange={(v) => setTweak('scanlines', v)}
        />
      </TweaksPanel>
    </React.Fragment>
  );
}

// ── Mount ───────────────────────────────────────────────────────────────────
ReactDOM.createRoot(document.getElementById('root')).render(<App />);
