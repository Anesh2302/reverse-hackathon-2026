import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { EVENT, DOMAINS } from '../data/domains';

const PAD = (n) => String(n).padStart(2, '0');

function useCountdown() {
  const target = new Date(EVENT.date).getTime();
  const [left, setLeft] = useState(target - Date.now());
  useEffect(() => {
    const t = setInterval(() => setLeft(target - Date.now()), 1000);
    return () => clearInterval(t);
  }, [target]);
  if (left < 0) return { d: 0, h: 0, m: 0, s: 0 };
  return {
    d: Math.floor(left / 86400000),
    h: Math.floor((left / 3600000) % 24),
    m: Math.floor((left / 60000) % 60),
    s: Math.floor((left / 1000) % 60),
  };
}

const units = [
  { key: 'd', label: 'DAYS', accent: '#e3352d' },
  { key: 'h', label: 'HRS', accent: '#1e63d8' },
  { key: 'm', label: 'MIN', accent: '#f8b800' },
  { key: 's', label: 'SEC', accent: '#e3352d' },
];

// Comic onomatopoeia sprinkles
const EFFECTS = [
  { text: 'PWN!', x: '8%', y: '14%', rot: -8, accent: '#e3352d' },
  { text: 'BOOM!', x: '74%', y: '12%', rot: 6, accent: '#1e63d8' },
  { text: 'SNIFF', x: '6%', y: '58%', rot: -5, accent: '#f8b800' },
  { text: 'ZAP!', x: '88%', y: '46%', rot: 10, accent: '#e3352d' },
  { text: 'CRACK', x: '68%', y: '74%', rot: -10, accent: '#1e63d8' },
  { text: 'EXPLOIT', x: '12%', y: '84%', rot: 4, accent: '#e3352d' },
];

const HERO_DOMAINS = DOMAINS.slice(0, 5);

export default function Hero() {
  const t = useCountdown();

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden">
      {/* Comic paper backdrop */}
      <div className="pointer-events-none absolute inset-0 bg-[#f7f3e8]">
        <div className="absolute inset-0 grid-overlay opacity-60" />
        <div className="absolute -top-24 -left-24 h-96 w-96 burst rotate-[-8deg] opacity-90" style={{ background: 'rgba(227,53,45,0.10)' }} />
        <div className="absolute bottom-[-140px] right-[-100px] h-[420px] w-[420px] burst rotate-[10deg] opacity-90" style={{ background: 'rgba(30,99,216,0.10)' }} />
        <div className="absolute inset-y-0 -left-32 w-64 speedlines opacity-30" />
        <div className="absolute inset-y-0 -right-32 w-64 speedlines opacity-30" />

        {/* Floating onomatopoeia */}
        {EFFECTS.map((e, i) => (
          <span
            key={e.text}
            className="font-display absolute select-none text-3xl md:text-5xl opacity-20 burst-pulse"
            style={{ left: e.x, top: e.y, color: e.accent, transform: `rotate(${e.rot}deg)`, animationDelay: `${i * 0.35}s`, textShadow: '2px 2px 0 rgba(20,20,20,0.25)' }}
          >
            {e.text}
          </span>
        ))}
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-12 px-5 pt-32 pb-16 lg:grid-cols-[1.2fr_0.8fr] lg:items-center md:px-8">
        {/* Left — comic editorial */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 14, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: 0.7 }}
            className="mb-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <span className="comic-chip bg-[#ffd34d] px-4 py-1.5 text-[11px] text-[#141414]">
              <span className="h-2 w-2 rounded-full bg-[#e3352d] animate-pulse" />
              DEP-CYS PRESENTS
            </span>
            <span className="comic-chip bg-[#fffdf6] px-4 py-1.5 text-[11px] text-[#1e63d8]">YEARS I · II · III</span>
          </motion.div>

          <div className="relative inline-block">
            <motion.h1
              initial={{ opacity: 0, y: 26 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.7 }}
              className="font-display leading-[0.9] tracking-tight relative z-10"
            >
              <span className="block text-[clamp(1.6rem,4vw,3rem)] text-[#141414] tracking-[0.1em]">
                {EVENT.dateLabel}
              </span>
              <span className="mt-1 block text-[clamp(3.4rem,10vw,7.5rem)] text-[#e3352d] [text-shadow:4px_4px_0_#141414]">
                REVERSE<span className="text-[#f8b800]">HACK</span>
              </span>
              <span className="block text-[clamp(3rem,8vw,6rem)]">
                <span className="text-gradient [text-shadow:none]">ATHLON</span>
              </span>
            </motion.h1>
            {/* burst star behind */}
            <span
              className="font-display absolute -right-8 -top-6 z-0 text-4xl origin-center rotate-12 text-[#1e63d8] pop-in"
              style={{ animationDelay: '1.2s' }}
            >
              ♦
            </span>
            <span className="font-display absolute -left-6 bottom-2 z-0 text-2xl -rotate-6 text-[#e3352d] wiggle" style={{ animationDelay: '1.5s' }}>
              ★
            </span>
          </div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.9 }}
            className="mx-auto mt-7 max-w-xl text-base md:text-lg text-[#322c22] font-medium lg:mx-0"
          >
            <span className="font-mono text-[#e3352d]">{EVENT.tagline}</span>
            {' '}— {EVENT.description}
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="mt-9"
          >
            <div className="mb-3 font-mono text-[11px] tracking-[0.4em] text-[#141414] [text-shadow:1px_1px_0_#f8b800]">T-MINUS UNTIL DEPLOYMENT</div>
            <div className="flex items-center justify-center gap-2.5 lg:justify-start sm:gap-3">
              {units.map((u) => (
                <div key={u.label} className="flex flex-col items-center gap-1.5">
                  <div
                    className="relative w-16 sm:w-20 rounded-sm border-[3px] border-[#141414] px-2 py-3 sm:py-4"
                    style={{ background: u.accent === '#f8b800' ? '#ffd34d' : u.accent, boxShadow: '4px 4px 0 0 #141414', transform: u.accent === '#f8b800' ? 'rotate(0.5deg)' : 'rotate(-0.5deg)' }}
                  >
                    <span className="font-display text-2xl sm:text-3xl text-[#fffdf6] [text-shadow:2px_2px_0_#141414]">
                      {PAD(t[u.key])}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] tracking-[0.25em] text-[#6d6455] sm:text-[10px]">{u.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.45 }}
            className="mt-9 flex flex-col items-center gap-4 sm:flex-row lg:justify-start sm:justify-center"
          >
            <a href="#register" className="btn-neon pulse-ring text-base px-10 w-full sm:w-auto">// Enlist Now</a>
            <a href="#domains" className="btn-ghost text-base px-10 w-full sm:w-auto">Explore 15 Domains</a>
          </motion.div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#7c7263] lg:justify-start">
            <span className="comic-chip bg-[#f7efc4] px-3 py-1 text-[#141414]"><span className="text-[#e3352d]">■</span>{EVENT.duration}</span>
            <span className="comic-chip bg-[#f7efc4] px-3 py-1 text-[#141414]"><span className="text-[#ffd500]">◉</span>{EVENT.demoTime}</span>
            <span className="comic-chip bg-[#f7efc4] px-3 py-1 text-[#141414]"><span className="text-[#f8b800]">◈</span>{EVENT.teamSize}</span>
          </div>
        </div>

        {/* Right — hero profile card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.9 }}
          className="relative hidden lg:block"
        >
          <div className="relative mx-auto w-full max-w-md">
            {/* Shield */}
            <div className="relative mx-auto flex h-80 w-80 items-center justify-center">
              <div className="shield float-y absolute inset-4 opacity-90" style={{ '--tilt': '0deg', animationDuration: '14s' }} />
              <div className="shield float-y absolute inset-14 opacity-95" style={{ '--tilt': '0deg' }} />
              <div className="burst-pulse absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-6xl text-[#fffdf6] [text-shadow:3px_3px_0_#141414]">✭</span>
                <span className="mt-2 font-mono text-[10px] tracking-[0.45em] text-[#fffdf6] [text-shadow:1px_1px_0_#141414]">REVERSE</span>
              </div>
            </div>

            {/* floating burst badges */}
            <div className="comic-card absolute -left-10 top-12 rounded-sm px-5 py-3 float-y" style={{ '--tilt': '-4deg' }}>
              <div className="font-mono text-[9px] tracking-[0.3em] text-[#6d6455]">RUNTIME</div>
              <div className="font-display text-3xl text-[#e3352d]">3 HRS</div>
            </div>
            <div className="comic-card absolute -right-12 bottom-28 rounded-sm px-5 py-3 float-y" style={{ '--tilt': '4deg', animationDelay: '1.4s' }}>
              <div className="font-mono text-[9px] tracking-[0.3em] text-[#6d6455]">FORMAT</div>
              <div className="font-display text-2xl text-[#1e63d8]">SOLO · DUO</div>
            </div>
            <div className="comic-card absolute -bottom-8 left-6 rounded-sm px-5 py-3 burst-pulse" style={{ '--tilt': '0deg' }}>
              <div className="flex items-center gap-2.5">
                <span className="burst flex h-9 w-9 items-center justify-center">
                  <span className="font-display text-lg text-[#fffdf6] [text-shadow:1px_1px_0_#141414]">✦</span>
                </span>
                <span className="font-mono text-xs tracking-wider text-[#141414]">5-MIN SHOWCASE / POD</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Domain ticker row */}
      <div className="relative z-10 border-y-[3px] border-[#141414] bg-[#ffd34d] py-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5">
          <span className="comic-chip bg-[#e3352d] px-3 py-1 text-[9px] text-[#fffdf6]">FEATURED</span>
          {HERO_DOMAINS.map((d) => (
            <span key={d.id} className="flex items-center gap-2 font-mono text-xs font-bold text-[#141414]">
              <span>{d.icon}</span>
              {d.title}
            </span>
          ))}
          <a href="#domains" className="font-display text-base text-[#1e63d8] hover:text-[#e3352d] transition-colors">+ 10 MORE →</a>
        </div>
      </div>
    </section>
  );
}