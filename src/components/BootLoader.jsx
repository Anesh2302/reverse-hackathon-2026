import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CapShield from './CapShield';

const LINES = [
  '[ok]   deploying runtime — REVERSE HACKATHON 2026',
  '[ok]   edge online :: 15 domains :: years I II III',
  '[ok]   consensus layer up ······ flags signed',
  '[ok]   enclaves sealed :: solo/duo pods :: ledger ready',
  '[>]   chamber opens — deploy your stand',
];

export default function BootLoader({ onDone }) {
  const [visibleLines, setVisibleLines] = useState([]);

  useEffect(() => {
    const timers = [];
    LINES.forEach((line, i) => {
      timers.push(
        setTimeout(() => {
          setVisibleLines((prev) => [...prev, line]);
        }, 400 + i * 500)
      );
    });
    timers.push(setTimeout(onDone, 400 + LINES.length * 500 + 800));

    const sec = document.getElementById('root');
    if (sec) sec.style.height = '100vh';
    return () => {
      timers.forEach(clearTimeout);
      if (sec) sec.style.height = '';
    };
  }, [onDone]);

  return (
    <motion.div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-[#061228] px-6 overflow-hidden"
      exit={{ opacity: 0, scale: 1.1, filter: 'blur(12px)' }}
      transition={{ duration: 0.6 }}
    >
      {/* Ambient glow */}
      <div className="absolute inset-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(26,86,219,0.15)_0%,transparent_70%)]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(218,43,54,0.08)_0%,transparent_70%)]" />
      </div>

      <div className="relative z-10 w-full max-w-2xl text-center">
        {/* Shield */}
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
          className="mb-8"
        >
          <CapShield size={160} glow={true} />
        </motion.div>

        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className="font-display text-4xl md:text-5xl uppercase text-[#DFECF4] tracking-wider mb-2"
        >
          REVERSE<span className="text-[#DA2B36]">HACK</span>
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0, duration: 0.4 }}
          className="font-mono text-[11px] tracking-[0.3em] text-[#8CA7CC] mb-8"
        >
          REVERSE HACKATHON 2026
        </motion.p>

        {/* Terminal */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2, duration: 0.5 }}
          className="border border-[#1A3A6E] bg-[rgba(14,36,72,0.5)] backdrop-blur-md rounded-lg p-6 text-left max-w-lg mx-auto"
        >
          <AnimatePresence>
            {visibleLines.map((line, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25 }}
                className={`font-mono text-sm leading-relaxed ${i === visibleLines.length - 1 ? 'text-[#EEC470]' : 'text-[#8CA7CC]'}`}
              >
                {line}
              </motion.div>
            ))}
          </AnimatePresence>
          <motion.span
            animate={{ opacity: [1, 0] }}
            transition={{ duration: 0.8, repeat: Infinity }}
            className="inline-block w-2 h-4 bg-[#DA2B36] mt-1"
          />
        </motion.div>
      </div>
    </motion.div>
  );
}
