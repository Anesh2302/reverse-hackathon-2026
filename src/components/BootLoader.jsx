import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const LINES = [
  '[ok]   deploying runtime — REVERSE HACKATHON 2026 · v2026.0',
  '[ok]   edge online :: 15 domains :: years I II III :: ledger signed',
  '[ok]   consensus layer up ······ flags signed',
  '[ok]   enclaves sealed :: solo/duo pods :: ledger ready',
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
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#060606] px-6"
      exit={{ opacity: 0, scale: 1.04, filter: 'blur(6px)' }}
      transition={{ duration: 0.5 }}
    >
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-[0.06]" />
      <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 border border-[#B01713]/20" />
      <div className="pointer-events-none absolute -bottom-16 -left-10 h-64 w-64 border border-[#8A4A28]/15" />

      <div className="relative z-10 w-full max-w-2xl">
        <div className="mb-8 text-center">
          <div className="relative inline-block">
            <span className="relative block h-32 w-56 mx-auto border-[3px] border-[#111E34] bg-[#0A0203] flex items-center justify-center [box-shadow:inset_0_0_18px_rgba(217,64,21,0.06)]">
              <span className="rh-bullet h-16 w-28 text-4xl">RH</span>
              <span className="pointer-events-none absolute inset-0 scanline" />
              <span className="absolute -top-2 -left-2 h-3 w-3 bg-[#D9261E]" />
              <span className="absolute -bottom-2 -right-2 h-3 w-3 bg-[#8A4A28]" />
            </span>
          </div>
          <h1 className="mt-6 font-display text-4xl md:text-6xl uppercase leading-none text-[#1A0A0A] [text-shadow:0_0_30px_rgba(217,64,21,0.12)]">
            REVERSE<span className="text-[#1A0A0A]">HACK</span><span className="text-[#1A0A0A] cursor-blink">!</span>
          </h1>
          <p className="mt-2 font-mono text-[11px] tracking-[0.3em] text-[#7A686B]">REVERSE HACKATHON 2026 · v2026.0</p>
        </div>

        <div className="border border-[#111E34] bg-[#0A0203] p-6 md:p-8">
          <AnimatePresence>
            {visibleLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className={i === 0 ? 'font-mono text-sm leading-relaxed text-[#1A0A0A]' : i === LINES.length - 1 ? 'font-mono text-sm leading-relaxed text-[#1A0A0A]' : 'font-mono text-sm leading-relaxed text-[#7A686B]'}
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