import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import Reveal from './Reveal';

const STATS = [
  { value: 15, suffix: '', label: 'SIGNED DOMAINS', note: 'one workload per battlefield', color: '#DA2B36', icon: '◆' },
  { value: 3, suffix: 'H', label: 'RUN WINDOW', note: 'nonstop sprint, verified end-to-end', color: '#EEC470', icon: '◈' },
  { value: 2, suffix: '', label: 'POD TEAM', note: 'solo or a duo on the wire', color: '#1A56DB', icon: '▣' },
  { value: 5, suffix: '', label: 'MIN SHOWCASE', note: 'present the exploit, not the story', color: '#DA2B36', icon: '◉' },
];

function Counter({ value, suffix, color }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1800;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 4);
      setN(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-mono text-5xl md:text-7xl font-bold tracking-tight" style={{ color, textShadow: `0 0 40px ${color}40` }}>
      {String(n).padStart(2, '0')}
      <span className="text-[0.4em] align-super ml-1 opacity-70">{suffix}</span>
    </span>
  );
}

export default function Stats() {
  return (
    <section id="proof" className="relative py-24 md:py-32 px-5 glass-section overflow-hidden">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(26,86,219,0.08)_0%,transparent_70%)]" />
        <div className="absolute inset-0 grid-overlay opacity-[0.03]" />
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        <Reveal>
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 border border-[#1A3A6E] bg-[rgba(14,36,72,0.5)] backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#DA2B36] animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#8CA7CC] uppercase">[01] // EVIDENCE</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase text-[#DFECF4] leading-tight">
              THE NUMBERS ARE PART OF <span className="hero-gradient">THE PRODUCT.</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto font-mono text-sm text-[#8CA7CC]">
              every stat below is signed at the gate — not marketing. run them once and never read them again.
            </p>
          </div>
        </Reveal>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.12}>
              <div className="group relative rounded-xl glass-card px-5 py-10 text-center"
              >
                {/* Top accent line */}
                <span className="absolute inset-x-0 top-0 h-[2px] rounded-t-xl transition-all duration-500 group-hover:h-[3px]" style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />

                {/* Glow effect on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at center top, ${s.color}08, transparent 70%)` }}
                />

                {/* Icon */}
                <div className="mb-4 text-2xl opacity-40" style={{ color: s.color }}>{s.icon}</div>

                {/* Counter */}
                <div className="relative">
                  <Counter value={s.value} suffix={s.suffix} color={s.color} />
                </div>

                {/* Label */}
                <div className="mt-4 font-mono text-[11px] uppercase tracking-[0.25em] text-[#DFECF4] font-semibold">{s.label}</div>
                <div className="mt-1.5 font-mono text-[9px] tracking-[0.2em] text-[#8CA7CC]">// {s.note}</div>

                {/* Bottom glow dot */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 h-1 w-8 rounded-full opacity-0 group-hover:opacity-60 transition-opacity duration-500" style={{ background: s.color, filter: `blur(4px)` }} />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
