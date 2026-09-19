import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { value: 15, suffix: '', label: 'SIGNED DOMAINS', note: 'one workload per battlefield', accent: '#bd7a00' },
  { value: 3, suffix: 'H', label: 'RUN WINDOW', note: 'nonstop sprint, verified end-to-end', accent: '#3f6376' },
  { value: 2, suffix: '', label: 'POD TEAM', note: 'solo or a duo on the wire', accent: '#5b8f6f' },
  { value: 5, suffix: ' MIN', label: 'SHOWCASE', note: 'present the exploit, not the story', accent: '#a35c00' },
];

function Counter({ value, suffix }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const duration = 1400;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const p = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setN(Math.round(eased * value));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-mono text-5xl md:text-6xl tracking-tight">
      {n}
      <span className="text-[0.45em] align-super ml-1">{suffix}</span>
    </span>
  );
}

export default function Stats() {
  return (
    <section id="proof" className="relative py-24 md:py-32 px-5 bg-[#f5f1e6]">
      <div className="mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end mb-16 md:mb-20"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-[#e0d5b4] bg-[#fbf7ee] px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-[#a35c00] shadow-sm mb-5">&lt;EVIDENCE.DB /&gt;</div>
            <h2 className="font-display text-2xl md:text-4xl font-bold text-[#16171c] leading-tight">
              THE NUMBERS ARE PART OF <span className="text-[#a35c00]">THE PRODUCT.</span>
            </h2>
          </div>
          <p className="font-mono text-sm md:text-base text-[#bdb091] md:pb-1.5 md:text-right">
            every stat below is signed at the gate — not marketing. run them once and never read them again.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative rounded-lg border border-[#e0d5b4] bg-[#fbf7ee] px-5 py-10 text-center"
              style={{ boxShadow: '0 8px 22px rgba(90,60,0,0.08), inset 0 1px 0 rgba(255,255,255,0.7)' }}
            >
              <span className="absolute inset-x-0 top-0 h-[2px]" style={{ background: s.accent }} />
              <div className="text-[#16171c]" style={{ color: s.accent }}>
                <Counter value={s.value} suffix={s.suffix} />
              </div>
              <div className="mt-4 font-mono text-[11px] tracking-[0.3em] text-[#16171c]">{s.label}</div>
              <div className="mt-1.5 font-mono text-[9px] tracking-[0.22em] text-[#8a7a4a]">// {s.note}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}