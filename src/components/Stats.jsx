import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { value: 15, suffix: '', label: 'Cyber Domains', note: 'uplinks one per battlefield', accent: '#ffd34d' },
  { value: 3, suffix: ' hrs', label: 'Total Runtime', note: 'nonstop sprint, unattended', accent: '#4f8cff' },
  { value: 2, suffix: '', label: 'Team Size', note: 'solo or a duo on the wire', accent: '#52e0a4' },
  { value: 5, suffix: ' min', label: 'Showcase / Pod', note: 'explain what you did', accent: '#ff8a3d' },
];

function Counter({ value, suffix, accent }) {
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
    <span ref={ref} className="font-display text-4xl md:text-5xl" style={{ color: accent, textShadow: '0 0 24px rgba(255,211,77,0.18)' }}>
      {n}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section id="stats" className="relative px-5 pb-16 md:pb-20">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative border border-[#26272e] bg-[#0d0e11] px-4 py-9 text-center"
              style={{ boxShadow: 'inset 0 0 30px rgba(0,0,0,0.7)' }}
            >
              <span className="absolute inset-x-0 top-0 h-[2px]" style={{ background: s.accent, boxShadow: `0 0 12px ${s.accent}` }} />
              <Counter value={s.value} suffix={s.suffix} accent={s.accent} />
              <div className="mt-3 font-display text-sm md:text-base text-[#eef0f6]">{s.label}</div>
              <div className="mt-1.5 font-mono text-[9px] md:text-[10px] tracking-[0.22em] text-[#8d90a3]">// {s.note}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}