import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINES = [
  '[ok]  raising the shield — REVERSE HACKATHON 2026',
  '[ok]  mustering troops :: DEP-CYS :: YEARS I II III',
  '[ok]  arming 15 battlegrounds ... done',
  '[ok]  briefing 3-hour sprint :: 5-min showcase/pod',
  '[>]   assembly complete — welcome, soldier',
];

export default function BootLoader({ onDone }) {
  const [visibleLines, setVisibleLines] = useState([]);

  useEffect(() => {
    const timers = [];
    LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, line]);
        }, 300 + i * 420)
      );
    });
    timers.push(setTimeout(onDone, 300 + LINES.length * 420 + 650));

    const sec = document.getElementById('root');
    if (sec) sec.style.height = '100vh';
    return () => {
      timers.forEach(clearTimeout);
      if (sec) sec.style.height = '';
    };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-start justify-start bg-[#f1f5fc] px-6 py-14 md:py-16 md:px-16"
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
      transition={{ duration: 0.5 }}
    >
      <div className="w-full max-w-3xl font-mono text-sm leading-relaxed">
        <div className="mb-6 text-[#e03131] neon-text text-lg md:text-2xl font-bold tracking-widest">
          &gt; SHIELD RISING<span className="cursor-blink">_</span>
        </div>
        <AnimatePresence>
          {visibleLines.map((line, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -12 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25 }}
              className={i === 0 ? 'text-[#e03131]' : i === LINES.length - 1 ? 'text-[#3b82f6]' : 'text-[#5b6b87]'}
            >
              {line}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-40" />
    </motion.div>
  );
}