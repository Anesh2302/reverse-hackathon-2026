import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { value: 15, suffix: '', label: 'Cyber Domains', note: 'one per battlefield', accent: '#e03131' },
  { value: 3, suffix: ' hrs', label: 'Total Runtime', note: 'nonstop sprint', accent: '#3b82f6' },
  { value: 2, suffix: '', label: 'Team Size', note: 'solo or a duo', accent: '#e09c08' },
  { value: 5, suffix: ' min', label: 'Showcase / Pod', note: 'explain what you did', accent: '#ff5c52' },
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
    <span ref={ref} className="font-display font-black text-5xl md:text-6xl" style={{ color: accent, textShadow: `0 0 30px ${accent}55` }}>
      {n}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section id="stats" className="relative px-5 pb-24 -mt-2">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden rounded-xl border border-[#d7e0ee] bg-[#fbfcfe]">
          <div className="h-1 w-full bg-linear-to-r from-[#e03131] via-[#3b82f6] to-[#e09c08]" />
          <div className="grid grid-cols-2 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <motion.div
                key={s.label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className={`flex flex-col items-center justify-center gap-1 px-4 py-10 text-center border-[#d7e0ee] ${
                  i === 1
                    ? 'border-l'
                    : i === 2
                      ? 'border-t lg:border-t-0 lg:border-l'
                      : i === 3
                        ? 'border-t border-l lg:border-t-0'
                        : ''
                }`}
              >
                <Counter value={s.value} suffix={s.suffix} accent={s.accent} />
                <div className="mt-2 font-display font-bold tracking-wide text-[#0c1a33]">{s.label}</div>
                <div className="font-mono text-[10px] tracking-[0.25em] text-[#5b6b87]">{s.note}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}