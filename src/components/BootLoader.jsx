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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#101116] px-6"
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
      transition={{ duration: 0.5 }}
    >
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-70" />
      <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 burst rotate-12 bg-[#ff4646]/10" />
      <div className="pointer-events-none absolute -bottom-24 -left-24 h-96 w-96 burst -rotate-6 bg-[#4f8cff]/10" />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            <span className="burst block h-36 w-36 mx-auto bg-[#ffd34d] border-[3px] border-[#4a4e60] flex items-center justify-center [box-shadow:6px_6px_0_0_rgba(0,0,0,0.7)]" style={{ animation: 'burst-pulse 1.2s ease-in-out infinite' }}>
              <span className="font-display text-5xl text-[#ff4646] [text-shadow:3px_3px_0_rgba(0,0,0,0.7)]">✭</span>
            </span>
            <span className="font-display absolute -right-16 top-0 text-3xl rotate-12 text-[#4f8cff] wiggle">✦</span>
          </div>
          <h1 className="mt-6 font-display text-5xl md:text-7xl leading-none text-[#ff4646] [text-shadow:4px_4px_0_rgba(0,0,0,0.7)]">
            REVERSE<span className="text-[#4f8cff]">HACK</span><span className="text-[#ffc53d] cursor-blink">!</span>
          </h1>
          <p className="mt-2 font-mono text-[11px] tracking-[0.4em] text-[#8d90a3]">DEP-CYS · 2026 · OCT 08</p>
        </div>

        <div className="comic-card rounded-sm p-6 md:p-8">
          <AnimatePresence>
            {visibleLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className={i === 0 ? 'font-mono text-sm leading-relaxed text-[#ff4646]' : i === LINES.length - 1 ? 'font-mono text-sm leading-relaxed text-[#4f8cff]' : 'font-mono text-sm leading-relaxed text-[#8d90a3]'}
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