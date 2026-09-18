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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, delay: 0.6 }}
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 ${
        scrolled ? 'glass shadow-lg shadow-[#0c1a33]/10' : 'bg-transparent'
      }`}
    >
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-5 py-3.5 md:px-8">
        <a href="#top" className="flex items-center gap-3 group">
          <div className="relative flex h-10 w-10 items-center justify-center">
            <div className="shield absolute inset-0 opacity-90 transition-transform duration-300 group-hover:scale-110" />
            <span className="relative font-display text-[#e09c08] text-base">✭</span>
          </div>
          <div className="hidden sm:block">
            <div className="font-display font-bold tracking-[0.2em] text-sm text-[#0c1a33]">REVERSE<span className="text-[#e03131]">HACK</span></div>
            <div className="font-mono text-[10px] tracking-[0.35em] text-[#5b6b87]">DEP-CYS · 2026</div>
          </div>
        </a>

        <div className="hidden lg:flex items-center gap-7">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="group relative font-mono text-xs tracking-[0.2em] text-[#43536e] hover:text-[#e03131] transition-colors">
              <span className="mr-1 text-[#e03131]">{l.code}</span>
              {l.label}
              <span className="absolute -bottom-1 left-0 h-px w-0 bg-[#e03131] transition-all duration-300 group-hover:w-full shadow-[0_0_8px_#e03131]" />
            </a>
          ))}
        </div>

        <div className="hidden lg:block">
          <a href="#register" className="btn-neon text-xs px-6 py-3 flex items-center gap-2">
            <span className="h-2 w-2 rounded-full bg-[#e09c08] animate-pulse" />
            Register
          </a>
        </div>

        {/* Mobile toggle */}
        <button className="lg:hidden flex flex-col gap-1.5 p-2" onClick={() => setOpen((v) => !v)} aria-label="Menu">
          <span className={`h-0.5 w-7 bg-[#e03131] transition-all ${open ? 'translate-y-2 rotate-45' : ''}`} />
          <span className={`h-0.5 w-7 bg-[#e03131] transition-all ${open ? 'opacity-0' : ''}`} />
          <span className={`h-0.5 w-7 bg-[#e03131] transition-all ${open ? '-translate-y-2 -rotate-45' : ''}`} />
        </button>
      </nav>

      {open && (
        <div className="lg:hidden glass border-t border-[#e03131]/20 px-6 py-6 flex flex-col gap-4">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="font-mono text-sm tracking-[0.2em] text-[#43536e] hover:text-[#e03131]">
              <span className="mr-2 text-[#e03131]">{l.code}</span>
              {l.label}
            </a>
          ))}
          <a href="#register" onClick={() => setOpen(false)} className="btn-neon text-center text-xs px-6 py-3">Register</a>
        </div>
      )}
    </motion.header>
  );
}