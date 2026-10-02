/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { motion, MotionConfig } from 'motion/react';
import {
  Github, Linkedin, Mail, ArrowUpRight, Download, Copy, Check,
  Sun, Moon, Monitor, MapPin, Briefcase, Cpu, Brain, Database, Layers,
} from 'lucide-react';
import portfolioData from './portfolio-data.json';

type Theme = 'light' | 'dark' | 'system';
const SW = 1.25; // ultra-light icon stroke
const ease = [0.32, 0.72, 0, 1] as const;
const NAV = [
  ['about', 'About'], ['skills', 'Skills'], ['projects', 'Projects'],
  ['experience', 'Experience'], ['blogs', 'Writing'],
] as const;
const skillIcons = [Cpu, Brain, Database, Layers];
const skillSpans = ['md:col-span-4', 'md:col-span-2', 'md:col-span-2', 'md:col-span-4'];

/* ---------- primitives ---------- */

const Reveal = ({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) => (
  <motion.div
    className={className}
    initial={{ opacity: 0, y: 48, filter: 'blur(8px)' }}
    whileInView={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
    viewport={{ once: true, margin: '-80px' }}
    transition={{ duration: 0.9, delay, ease }}
  >
    {children}
  </motion.div>
);

// Double-bezel: outer shell + inner core with concentric radii
const Bezel = ({ children, className = '', inner = '' }: { children: React.ReactNode; className?: string; inner?: string }) => (
  <div className={`rounded-[2rem] bg-shell p-1.5 ring-1 ring-hair ${className}`}>
    <div className={`h-full overflow-hidden rounded-[calc(2rem-0.375rem)] bg-core core-hl ${inner}`}>{children}</div>
  </div>
);

const Eyebrow = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-block rounded-full bg-shell px-3 py-1 text-[10px] font-medium uppercase tracking-[0.2em] text-muted ring-1 ring-hair">
    {children}
  </span>
);

const SectionHead = ({ tag, title }: { tag: string; title: string }) => (
  <Reveal className="mb-12 md:mb-16">
    <Eyebrow>{tag}</Eyebrow>
    <h2 className="mt-5 text-4xl font-bold md:text-6xl">{title}</h2>
  </Reveal>
);

const pillCls = (primary: boolean) =>
  `group inline-flex items-center gap-3 rounded-full py-2 pl-6 pr-2 text-sm font-medium transition-all duration-700 ease-fluid active:scale-[0.98] ${
    primary ? 'bg-ink text-page' : 'bg-shell text-ink ring-1 ring-hair hover:bg-hair'
  }`;

// Trailing icon lives in its own circle, flush with the pill's inner padding
const IconDot = ({ primary, children }: { primary: boolean; children: React.ReactNode }) => (
  <span className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform duration-700 ease-fluid group-hover:-translate-y-px group-hover:translate-x-1 group-hover:scale-105 ${primary ? 'bg-page/15' : 'bg-ink/10'}`}>
    {children}
  </span>
);

const PillLink = ({ href, label, primary = false, icon, ...rest }: { href: string; label: string; primary?: boolean; icon?: React.ReactNode } & React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className={pillCls(primary)} {...rest}>
    {label}
    <IconDot primary={primary}>{icon ?? <ArrowUpRight size={16} strokeWidth={SW + 0.25} />}</IconDot>
  </a>
);

/* ---------- app ---------- */

export default function App() {
  const { personal, skills, projects, experience, blogs } = portfolioData;
  const [active, setActive] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('portfolio-theme') as Theme) || 'system');

  useEffect(() => {
    const root = document.documentElement;
    const mq = window.matchMedia('(prefers-color-scheme: dark)');
    const apply = () => {
      root.classList.remove('light', 'dark');
      root.classList.add(theme === 'system' ? (mq.matches ? 'dark' : 'light') : theme);
    };
    apply();
    localStorage.setItem('portfolio-theme', theme);
    if (theme === 'system') {
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [theme]);

  // Scroll spy via IntersectionObserver (no scroll listener)
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: '-40% 0px -55% 0px' },
    );
    NAV.forEach(([id]) => { const el = document.getElementById(id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : '';
  }, [menuOpen]);

  const go = (e: React.MouseEvent, id: string) => {
    e.preventDefault();
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(personal.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const cycleTheme = () => setTheme(theme === 'light' ? 'dark' : theme === 'dark' ? 'system' : 'light');
  const ThemeIcon = theme === 'light' ? Sun : theme === 'dark' ? Moon : Monitor;

  return (
    <MotionConfig reducedMotion="user">
      <div className="min-h-[100dvh] selection:bg-accent/30">
        {/* Floating island nav (desktop) */}
        <div className="pointer-events-none fixed inset-x-0 top-0 z-40 hidden justify-center md:flex">
          <nav className="pointer-events-auto mt-6 flex w-max items-center gap-1 rounded-full bg-page/60 p-1.5 ring-1 ring-hair backdrop-blur-2xl">
            {NAV.map(([id, label]) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => go(e, id)}
                className={`rounded-full px-4 py-2 text-sm transition-all duration-700 ease-fluid ${
                  active === id ? 'bg-ink text-page' : 'text-muted hover:text-ink'
                }`}
              >
                {label}
              </a>
            ))}
            <button
              onClick={cycleTheme}
              title={`Theme: ${theme}`}
              aria-label={`Theme: ${theme}. Click to change`}
              className="ml-1 flex h-9 w-9 items-center justify-center rounded-full text-muted transition-all duration-700 ease-fluid hover:text-ink active:scale-95"
            >
              <ThemeIcon size={16} strokeWidth={SW} />
            </button>
          </nav>
        </div>

        {/* Hamburger (mobile) */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          className="fixed right-4 top-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-page/60 ring-1 ring-hair backdrop-blur-2xl active:scale-95 md:hidden"
        >
          <span className={`absolute h-px w-5 bg-ink transition-transform duration-700 ease-fluid ${menuOpen ? 'rotate-45' : '-translate-y-[3px]'}`} />
          <span className={`absolute h-px w-5 bg-ink transition-transform duration-700 ease-fluid ${menuOpen ? '-rotate-45' : 'translate-y-[3px]'}`} />
        </button>

        {/* Full-screen overlay menu */}
        <div
          className={`fixed inset-0 z-40 flex flex-col justify-center bg-page/85 px-8 backdrop-blur-3xl transition-opacity duration-700 ease-fluid md:hidden ${
            menuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <div className="flex flex-col gap-2">
            {NAV.map(([id, label], i) => (
              <a
                key={id}
                href={`#${id}`}
                onClick={(e) => go(e, id)}
                style={{ transitionDelay: menuOpen ? `${100 + i * 50}ms` : '0ms' }}
                className={`font-display text-4xl font-semibold tracking-tight transition-all duration-700 ease-fluid ${
                  menuOpen ? 'translate-y-0 opacity-100' : 'translate-y-12 opacity-0'
                } ${active === id ? 'text-ink' : 'text-muted'}`}
              >
                {label}
              </a>
            ))}
          </div>
          <div className="mt-12 flex w-max items-center gap-1 rounded-full bg-shell p-1.5 ring-1 ring-hair">
            {(['light', 'dark', 'system'] as Theme[]).map((t) => (
              <button
                key={t}
                onClick={() => setTheme(t)}
                className={`rounded-full px-4 py-2 text-xs capitalize transition-all duration-700 ease-fluid ${theme === t ? 'bg-ink text-page' : 'text-muted'}`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Hero */}
        <section id="hero" className="relative flex min-h-[100dvh] items-center overflow-hidden px-4 py-28 md:py-24">
          <div
            className="pointer-events-none absolute inset-0"
            style={{
              background:
                'radial-gradient(40rem 30rem at 15% 20%, var(--glow-a), transparent 70%), radial-gradient(36rem 28rem at 90% 80%, var(--glow-b), transparent 70%)',
            }}
          />
          <div className="relative mx-auto grid w-full max-w-6xl items-center gap-12 md:grid-cols-2">
            <motion.div
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.12 } } }}
            >
              {[
                <Eyebrow key="l">{personal.location}</Eyebrow>,
                <h1 key="n" className="mt-6 text-5xl font-bold leading-[0.95] tracking-tighter sm:text-6xl md:text-7xl">{personal.name}</h1>,
                <p key="r" className="mt-6 max-w-md text-xl text-muted">{personal.role}</p>,
                <div key="b" className="mt-10 flex flex-wrap items-center gap-3">
                  <a href="#projects" onClick={(e) => go(e, 'projects')} className={pillCls(true)}>
                    View projects
                    <IconDot primary><ArrowUpRight size={16} strokeWidth={SW + 0.25} /></IconDot>
                  </a>
                  <PillLink href={personal.resumeUrl} label="Resume" icon={<Download size={16} strokeWidth={SW + 0.25} />} />
                </div>,
              ].map((el, i) => (
                <motion.div
                  key={i}
                  variants={{ hidden: { opacity: 0, y: 32, filter: 'blur(8px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)' } }}
                  transition={{ duration: 0.9, ease }}
                >
                  {el}
                </motion.div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 48 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.3, ease }}
            >
              <Bezel className="md:rotate-[2deg]">
                <div className="relative aspect-[4/5]">
                  <img src={personal.heroImage} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover opacity-90" />
                  <div className="absolute inset-0 bg-gradient-to-t from-core via-transparent to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 flex gap-8 p-6">
                    <div><p className="text-2xl font-semibold">{personal.experience}</p><p className="text-xs text-muted">Experience</p></div>
                    <div><p className="text-2xl font-semibold">{projects.length}</p><p className="text-xs text-muted">Projects</p></div>
                  </div>
                </div>
              </Bezel>
            </motion.div>
          </div>
        </section>

        {/* About: asymmetrical bento */}
        <section id="about" className="mx-auto max-w-6xl px-4 py-24 md:py-40">
          <SectionHead tag="About" title={personal.name} />
          <div className="grid gap-6 md:grid-cols-12">
            <Reveal className="md:col-span-8 md:row-span-2">
              <Bezel className="h-full" inner="p-8 md:p-12">
                <p className="max-w-[60ch] text-xl leading-relaxed md:text-2xl">{personal.bio}</p>
              </Bezel>
            </Reveal>
            <Reveal delay={0.08} className="md:col-span-4">
              <Bezel className="h-full" inner="flex items-center gap-4 p-6">
                <MapPin size={22} strokeWidth={SW} className="text-accent" />
                <div><p className="text-xs text-muted">Location</p><p className="font-medium">{personal.location}</p></div>
              </Bezel>
            </Reveal>
            <Reveal delay={0.16} className="md:col-span-4">
              <Bezel className="h-full" inner="flex items-center gap-4 p-6">
                <Briefcase size={22} strokeWidth={SW} className="text-accent" />
                <div><p className="text-xs text-muted">Experience</p><p className="font-medium">{personal.experience}</p></div>
              </Bezel>
            </Reveal>
          </div>
        </section>

        {/* Skills */}
        <section id="skills" className="mx-auto max-w-6xl px-4 py-24 md:py-40">
          <SectionHead tag="Skills" title="Technical skills" />
          <div className="grid gap-6 md:grid-cols-6">
            {skills.map((group, idx) => {
              const Icon = skillIcons[idx % skillIcons.length];
              return (
                <Reveal key={group.category} delay={idx * 0.08} className={skillSpans[idx % 4]}>
                  <Bezel className="h-full" inner="p-7">
                    <Icon size={26} strokeWidth={SW} className="mb-6 text-accent" />
                    <h3 className="mb-5 text-xl font-semibold">{group.category}</h3>
                    <div className="flex flex-wrap gap-2">
                      {group.items.map((s) => (
                        <span key={s} className="rounded-full bg-shell px-3 py-1 text-xs text-muted ring-1 ring-hair">{s}</span>
                      ))}
                    </div>
                  </Bezel>
                </Reveal>
              );
            })}
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="mx-auto max-w-6xl px-4 py-24 md:py-40">
          <SectionHead tag="Projects" title="Selected work" />
          <div className="grid gap-6 md:grid-cols-2">
            {projects.map((p, idx) => (
              <Reveal key={p.id} delay={(idx % 2) * 0.1}>
                <Bezel className="h-full" inner="flex flex-col">
                  <div className="aspect-[16/10] overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.title}
                      referrerPolicy="no-referrer"
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-[1200ms] ease-fluid hover:scale-[1.04]"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-7">
                    <div className="mb-4 flex flex-wrap gap-2">
                      {p.tags.map((t) => (
                        <span key={t} className="rounded-full bg-shell px-2.5 py-0.5 text-[11px] text-muted ring-1 ring-hair">{t}</span>
                      ))}
                    </div>
                    <h3 className="text-2xl font-semibold">{p.title}</h3>
                    <p className="mb-8 mt-3 line-clamp-3 text-muted">{p.description}</p>
                    <div className="mt-auto"><PillLink href={p.link} label="View project" /></div>
                  </div>
                </Bezel>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section id="experience" className="mx-auto max-w-6xl px-4 py-24 md:py-40">
          <SectionHead tag="Experience" title="Where I've worked" />
          <Reveal>
            <Bezel inner="divide-y divide-hair">
              {experience.map((x, i) => (
                <div key={i} className="grid gap-3 p-7 md:grid-cols-[14rem_1fr] md:gap-10 md:p-10">
                  <p className="text-sm text-muted">{x.period}</p>
                  <div>
                    <h3 className="text-xl font-semibold">{x.role}</h3>
                    <p className="mt-1 text-accent">{x.company}</p>
                    <p className="mt-4 max-w-[65ch] leading-relaxed text-muted">{x.description}</p>
                  </div>
                </div>
              ))}
            </Bezel>
          </Reveal>
        </section>

        {/* Writing */}
        <section id="blogs" className="mx-auto max-w-6xl px-4 py-24 md:py-40">
          <SectionHead tag="Writing" title="Articles" />
          <Reveal>
            <Bezel inner="divide-y divide-hair">
              {blogs.map((b) => (
                <a
                  key={b.id}
                  href={b.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group grid items-center gap-4 p-7 transition-colors duration-700 ease-fluid hover:bg-shell md:grid-cols-[12rem_1fr_auto] md:gap-10 md:p-10"
                >
                  <p className="text-sm text-muted">{b.date} · {b.readTime}</p>
                  <div>
                    <h3 className="text-xl font-semibold">{b.title}</h3>
                    <p className="mt-2 line-clamp-2 max-w-[65ch] text-muted">{b.excerpt}</p>
                  </div>
                  <span className="hidden h-10 w-10 items-center justify-center rounded-full bg-ink/10 transition-transform duration-700 ease-fluid group-hover:-translate-y-px group-hover:translate-x-1 group-hover:scale-105 md:flex">
                    <ArrowUpRight size={18} strokeWidth={SW + 0.25} />
                  </span>
                </a>
              ))}
            </Bezel>
          </Reveal>
        </section>

        {/* Contact */}
        <section id="contact" className="mx-auto max-w-6xl px-4 pb-16 pt-24 md:pt-40">
          <Reveal>
            <Bezel inner="flex flex-col items-start gap-10 p-8 md:flex-row md:items-center md:justify-between md:p-14">
              <div>
                <Eyebrow>Contact</Eyebrow>
                <h2 className="mt-5 break-all text-3xl font-bold md:text-5xl">{personal.email}</h2>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <PillLink href={`mailto:${personal.email}`} target="_self" label="Send email" primary icon={<Mail size={16} strokeWidth={SW + 0.25} />} />
                <button onClick={copyEmail} className={pillCls(false)}>
                  {copied ? 'Copied' : 'Copy email'}
                  <IconDot primary={false}>{copied ? <Check size={16} strokeWidth={SW + 0.25} /> : <Copy size={16} strokeWidth={SW + 0.25} />}</IconDot>
                </button>
              </div>
            </Bezel>
          </Reveal>

          <footer className="mt-12 flex flex-col items-center justify-between gap-6 text-sm text-muted md:flex-row">
            <p>© {new Date().getFullYear()} {personal.name}</p>
            <div className="flex gap-2">
              {[[personal.github, Github, 'GitHub'], [personal.linkedin, Linkedin, 'LinkedIn']].map(([href, Icon, label]: any) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-shell ring-1 ring-hair transition-all duration-700 ease-fluid hover:text-ink active:scale-95"
                >
                  <Icon size={18} strokeWidth={SW} />
                </a>
              ))}
            </div>
          </footer>
        </section>
      </div>
    </MotionConfig>
  );
}