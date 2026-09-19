import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINES = [
  '[ok]  raising the signal — REVERSE HACKATHON 2026',
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0b0b0d] px-6"
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
      transition={{ duration: 0.5 }}
    >
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-70" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 border border-[#ffc53d]/15" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-64 w-64 border border-[#4f8cff]/10" />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            <span className="relative block h-32 w-56 mx-auto border-[3px] border-[#ffc53d]/40 bg-[#0e0e11] flex items-center justify-center [box-shadow:0_0_50px_rgba(255,197,61,0.15),inset_0_0_40px_rgba(0,0,0,0.8)]">
              <span className="dc-bullet h-16 w-28 text-4xl">DC</span>
              <span className="pointer-events-none absolute inset-0 scanline" />
              <span className="absolute -top-2 -left-2 h-3 w-3 bg-[#ffd34d]" />
              <span className="absolute -bottom-2 -right-2 h-3 w-3 bg-[#4f8cff]" />
            </span>
          </div>
          <h1 className="mt-6 font-display text-4xl md:text-6xl leading-none text-[#ffd34d] [text-shadow:0_0_30px_rgba(255,211,77,0.4)]">
            REVERSE<span className="text-[#4f8cff]">HACK</span><span className="text-[#ffc53d] cursor-blink">!</span>
          </h1>
          <p className="mt-2 font-mono text-[11px] tracking-[0.4em] text-[#8d90a3]">DEP-CYS · 2026 · LIGHTS OUT</p>
        </div>

        <div className="comic-card rounded-sm p-6 md:p-8">
          <AnimatePresence>
            {visibleLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className={i === 0 ? 'font-mono text-sm leading-relaxed text-[#ffd34d]' : i === LINES.length - 1 ? 'font-mono text-sm leading-relaxed text-[#4f8cff]' : 'font-mono text-sm leading-relaxed text-[#8d90a3]'}
              >
                {line}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}