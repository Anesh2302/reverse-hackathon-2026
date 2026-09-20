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
        scrolled ? 'bg-[#0F0F0F]/95 border-b border-[#2A2A2A] backdrop-blur-md' : 'bg-transparent border-b border-transparent'
      }`}
    >
      <div className="absolute bottom-[-3px] left-0 h-[3px] bg-gradient-to-r from-[#FFD600] via-[#FF6B35] to-[#FFD600] [box-shadow:0_0_12px_rgba(255,214,0,0.45)] transition-[width] duration-150" style={{ width: `${progress * 100}%` }} />
      <div className="border-b border-[#262626]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-1.5 md:px-8">
          <div className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#6E6E6E]">
            <span className="text-[#FFD600]">▣ [01] //</span> REVERSE HACKATHON 2026 <span className="text-[#555555]">v2026.0</span>
          </div>
          <div className="hidden md:flex items-center gap-4 font-mono text-[10px] uppercase tracking-[0.3em] text-[#6E6E6E]">
            <span>[<span className="text-[#FFD600]">3H</span> WINDOW]</span>
            <span>[<span className="text-[#FFD600]">15</span> PoPs]</span>
            <span>[LEDGER <span className="text-[#22C55E]">SIGNED</span>]</span>
          </div>
        </div>
      </div>
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3 md:px-8">
        <a href="#top" className="flex items-center gap-3 group">
          <div className="dc-bullet h-10 w-16 shrink-0 text-2xl transition-transform duration-300 group-hover:-rotate-6">DC</div>
          <div className="hidden sm:block">
            <div className="font-display text-2xl uppercase leading-none tracking-wide text-[#F5F5F0] [text-shadow:0_0_40px_rgba(255,214,0,0.14)]">
              REVERSE<span className="text-[#FFD600]">HACK</span>
            </div>
            <div className="font-mono text-[10px] tracking-[0.25em] text-[#6E6E6E]">REVERSE HACKATHON</div>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-2">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={`rounded-none border border-[#2A2A2A] bg-[#111111] px-3 py-2 font-mono text-[10px] uppercase tracking-[0.2em] transition-all ${
                active === l.href.slice(1)
                  ? 'border-[#FFD600] bg-[#FFD600]/10 text-[#FFD600]'
                  : 'text-[#F5F5F0] hover:-translate-y-[1px] hover:border-[#FFD600] hover:text-[#FFD600]'
              }`}
            >
              <span className="text-[#FF6B35]">{l.code}</span>
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:block">
          <a href="#register" className="flex items-center gap-2 bg-[#FFD600] px-6 py-2.5 font-sans text-base font-bold uppercase tracking-wide text-[#0F0F0F] transition-all hover:shadow-[0_0_24px_rgba(255,214,0,0.4)]">
            <span className="inline-block h-2 w-2 bg-[#0F0F0F]" />
            Deploy
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          <span className={`h-0.5 w-7 bg-[#F5F5F0] transition-all ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-7 bg-[#F5F5F0] transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-7 bg-[#F5F5F0] transition-all ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </nav>

      {open && (
        <div className="lg:hidden border-b border-[#262626] bg-[#111111] px-6 py-6 flex flex-col gap-3">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="rounded-none border border-[#2A2A2A] bg-[#161616] px-4 py-2.5 font-mono text-xs uppercase tracking-[0.2em] text-[#F5F5F0] hover:border-[#FFD600] hover:text-[#FFD600]">
              <span className="mr-2 text-[#FF6B35]">{l.code}</span>
              {l.label}
            </a>
          ))}
          <a href="#register" onClick={() => setOpen(false)} className="bg-[#FFD600] px-6 py-3 text-center font-sans text-base font-bold uppercase tracking-wide text-[#0F0F0F] transition-all hover:shadow-[0_0_24px_rgba(255,214,0,0.4)]">Deploy Stand</a>
        </div>
      )}
    </motion.header>
  );
}