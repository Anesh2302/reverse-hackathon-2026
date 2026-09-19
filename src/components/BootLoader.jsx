import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINES = [
  '[ok]  deploying runtime — REVERSE HACKATHON 2026 · v2026.0',
  '[ok]  edge online :: 15 domains :: DEP-CYS :: YEARS I II III',
  '[ok]  consensus layer up ······ flags signed',
  '[ok]  enclaves sealed :: solo/duo pods :: ledger ready',
  '[>]   chamber opens on the countdown — deploy your stand',
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#0F0F0F] px-6"
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
      transition={{ duration: 0.5 }}
    >
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-[0.06]" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 border border-[#FFD600]/20" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-64 w-64 border border-[#FF6B35]/15" />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            <span className="relative block h-32 w-56 mx-auto border-[3px] border-[#262626] bg-[#111111] flex items-center justify-center [box-shadow:inset_0_0_18px_rgba(255,214,0,0.06)]">
              <span className="dc-bullet h-16 w-28 text-4xl">DC</span>
              <span className="pointer-events-none absolute inset-0 scanline" />
              <span className="absolute -top-2 -left-2 h-3 w-3 bg-[#FFD600]" />
              <span className="absolute -bottom-2 -right-2 h-3 w-3 bg-[#FF6B35]" />
            </span>
          </div>
          <h1 className="mt-6 font-display text-4xl md:text-6xl uppercase leading-none text-[#F5F5F0] [text-shadow:0_0_30px_rgba(255,214,0,0.12)]">
            REVERSE<span className="text-[#FFD600]">HACK</span><span className="text-[#FF6B35] cursor-blink">!</span>
          </h1>
          <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.4em] text-[#6E6E6E]">DEP-CYS · NIGHT OPS · v2026.0</p>
        </div>

        <div className="border border-[#262626] bg-[#111111] p-6 md:p-8">
          <AnimatePresence>
            {visibleLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className={i === 0 ? 'font-mono text-sm leading-relaxed text-[#FFD600]' : i === LINES.length - 1 ? 'font-mono text-sm leading-relaxed text-[#FF6B35]' : 'font-mono text-sm leading-relaxed text-[#6E6E6E]'}
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