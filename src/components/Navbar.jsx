import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

const LINKS = [
  { label: 'Stats', href: '#stats', code: '01' },
  { label: 'About', href: '#about', code: '02' },
  { label: 'How It Works', href: '#how', code: '03' },
  { label: 'Domains', href: '#domains', code: '04' },
  { label: 'FAQ', href: '#faq', code: '05' },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const ids = LINKS.map((l) => l.href.slice(1));
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      const doc = document.documentElement;
      setProgress(Math.min(1, window.scrollY / Math.max(1, doc.scrollHeight - window.innerHeight)));
      const probes = ids.map((id) => {
        const el = document.getElementById(id);
        return { id, top: el ? el.getBoundingClientRect().top : 1e9 };
      });
      const visible = probes.filter((p) => p.top <= 170);
      setActive(window.scrollY < 220 ? '' : visible.length ? visible[visible.length - 1].id : active);
    };
    onScroll();
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? 'bg-[#0b0b0d]/92 border-b border-[#26272e] backdrop-blur-md' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="absolute bottom-[-3px] left-0 h-[3px] bg-gradient-to-r from-[#ffd34d] via-[#ff8a3d] to-[#ffd34d] transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <a href="#top" className="flex items-center gap-3 group">
          <div className="dc-bullet h-10 w-16 shrink-0 text-2xl transition-transform duration-300 group-hover:-rotate-6">DC</div>
          <div className="hidden sm:block">
            <div className="font-display text-2xl leading-none tracking-wide text-[#ffd34d] [text-shadow:2px_2px_0_rgba(0,0,0,0.7)]">
              REVERSE<span className="text-[#4f8cff]">HACK</span>
            </div>
            <div className="font-mono text-[10px] tracking-[0.35em] text-[#8d90a3]">DEP-CYS · 2026</div>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-2">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`comic-chip px-3 py-2 text-[10px] transition-colors [box-shadow:2px_2px_0_0_rgba(0,0,0,0.7)] ${
                active === l.href.slice(1)
                  ? 'bg-[#ffd34d] text-[#17181f]'
                  : 'bg-[#1c1d27] text-[#c9cbd8] hover:bg-[#ffd34d] hover:text-[#17181f]'
              }`}
            >
              <span className="text-[#ffd34d]">{l.code}</span>
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:block">
          <a href="#register" className="btn-neon text-base px-6 py-2.5 flex items-center gap-2">
            <span className="inline-block h-2 w-2 border border-current bg-[#ffd34d]" />
            Register
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          <span className={`h-0.5 w-7 bg-[#eef0f6] transition-all ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-7 bg-[#eef0f6] transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-7 bg-[#eef0f6] transition-all ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-b border-[#26272e] bg-[#0b0b0d] px-6 py-6 flex flex-col gap-3">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="comic-chip bg-[#1c1d27] px-4 py-2.5 text-xs text-[#c9cbd8]">
              <span className="mr-2 text-[#ff4646]">{l.code}</span>
              {l.label}
            </a>
          ))}
          <a href="#register" onClick={() => setOpen(false)} className="btn-neon text-center text-base px-6 py-3">Register</a>
        </div>
      )}
    </motion.header>
  );
}