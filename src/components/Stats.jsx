import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';

const STATS = [
  { value: 15, suffix: '', label: 'Cyber Domains', note: 'one per battlefield' },
  { value: 3, suffix: ' hrs', label: 'Total Runtime', note: 'nonstop sprint' },
  { value: 2, suffix: '', label: 'Team Size', note: 'solo or a duo' },
  { value: 5, suffix: ' min', label: 'Showcase / Pod', note: 'explain what you did' },
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
    <span ref={ref} className="font-display text-5xl md:text-6xl text-[#fffdf6]" style={{ textShadow: '3px 3px 0 rgba(20,20,20,0.9)' }}>
      {n}
      {suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section id="stats" className="relative px-5 pb-16 md:pb-20 -mt-2">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {STATS.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, scale: 0.7, rotate: i % 2 ? 2 : -2 }}
              whileInView={{ opacity: 1, scale: 1, rotate: i % 2 ? 2 : -2 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className={`comic-card flex flex-col items-center justify-center gap-1 px-4 py-9 text-center ${
                i % 2 ? 'rotate-[2deg]' : 'rotate-[-2deg]'
              } ${['bg-[#e3352d]', 'bg-[#1e63d8]', 'bg-[#ffd34d]', 'bg-[#e3352d]'][i]}`}
            >
              <Counter value={s.value} suffix={s.suffix} accent={s.accent} />
              <div className="mt-2 font-display text-lg tracking-wide text-[#fffdf6]" style={{ textShadow: '2px 2px 0 rgba(20,20,20,0.85)' }}>
                {s.label}
              </div>
              <div className="font-mono text-[10px] tracking-[0.25em] text-[#efe9d9]">// {s.note}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}