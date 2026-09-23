import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { EVENT, DOMAINS, FACTIONS, factionOf } from '../data/domains';
import { FactionEmblem } from './Emblems';
import CapShield from './CapShield';
import TextScramble from './TextScramble';
import ArtImage from './ArtImage';
import { ART } from '../data/art';

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
  { key: 'd', label: 'DAYS', color: '#DA2B36' },
  { key: 'h', label: 'HRS', color: '#1A56DB' },
  { key: 'm', label: 'MIN', color: '#DA2B36' },
  { key: 's', label: 'SEC', color: '#1A56DB' },
];

const STATUSES = [
  ['hub', 'operational', '#EEC470'],
  ['PADS matrix', 'validating', '#DA2B36'],
  ['flag enclave', 'signed', '#EEC470'],
  ['queue', 'spooling', '#1A56DB'],
];

function useStands() {
  const [n, setN] = useState(0);
  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && typeof d.registrations?.total === 'number') setN(d.registrations.total);
      })
      .catch(() => {});
  }, []);
  return n;
}

function useClimb(target) {
  const [shown, setShown] = useState(0);
  useEffect(() => {
    if (!target) return;
    const t0 = performance.now();
    const dur = 1400;
    let raf;
    const frame = (now) => {
      const p = Math.min(1, (now - t0) / dur);
      setShown(Math.round(target * (1 - Math.pow(1 - p, 3))));
      if (p < 1) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [target]);
  return shown;
}

export default function Hero() {
  const t = useCountdown();
  const count = useStands();
  const climbing = useClimb(count);
  const [status, setStatus] = useState(0);
  useEffect(() => {
    const id = setInterval(() => setStatus((s) => (s + 1) % STATUSES.length), 2200);
    return () => clearInterval(id);
  }, []);

  const [fi, setFi] = useState(0);
  const [manual, setManual] = useState(false);
  useEffect(() => {
    if (manual) return;
    const id = setInterval(() => setFi((i) => (i + 1) % FACTIONS.length), 5000);
    return () => clearInterval(id);
  }, [manual]);

  const faction = FACTIONS[fi];
  const [label, color] = STATUSES[status];

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#061228]">
      {/* Key art backdrop — hidden until /art/hero-key-16x9.webp exists */}
      <div className="pointer-events-none absolute inset-0">
        <ArtImage
          src={ART.heroKey.src}
          alt={ART.heroKey.alt}
          eager
          opacity={0.45}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#061228]/70 via-[#061228]/55 to-[#061228]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#061228]/80 via-transparent to-[#061228]/60" />
      </div>
      {/* Ambient glow orbs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-[radial-gradient(circle,rgba(26,86,219,0.12)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-[radial-gradient(circle,rgba(218,43,54,0.08)_0%,transparent_70%)] blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-[radial-gradient(circle,rgba(238,196,112,0.05)_0%,transparent_60%)] blur-3xl" />
        {/* Grid overlay */}
        <div className="absolute inset-0 grid-overlay opacity-[0.04]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-8 px-5 pt-28 pb-14 lg:grid-cols-[1fr_1fr] lg:items-center md:px-8">
        {/* Left — text content */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="text-center lg:text-left"
        >
          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.5 }}
            className="mb-6 inline-flex items-center gap-2 border border-[#1A3A6E] bg-[rgba(14,36,72,0.6)] backdrop-blur-sm px-4 py-2 rounded-full"
          >
            <span className="h-2 w-2 animate-pulse rounded-full bg-[#EEC470]" />
            <span className="font-mono text-[10px] tracking-[0.25em] text-[#8CA7CC] uppercase">
              DEP-CYS · Reverse Hackathon 2026
            </span>
          </motion.div>

          {/* Title */}
          <h1 className="relative z-10">
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.7 }}
              className="block font-sans text-[clamp(3rem,10vw,6.5rem)] font-black uppercase leading-[0.9] tracking-[-0.02em]"
            >
              <TextScramble text="REVERSE" delay={0.6} duration={1.2} className="text-[#DFECF4]" />
              <span className="hero-gradient">.</span>
            </motion.span>
            <motion.span
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.75, duration: 0.7 }}
              className="block font-sans text-[clamp(2rem,6vw,4rem)] font-black uppercase leading-none mt-1"
            >
              <span className="text-[#DFECF4]">with </span>
              <TextScramble text="proof" delay={1.0} duration={0.8} className="hero-gradient" />
              <span className="text-[#DFECF4]">.</span>
            </motion.span>
          </h1>

          {/* Description */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
            className="mt-6 max-w-lg text-base md:text-lg text-[#8CA7CC] leading-relaxed mx-auto lg:mx-0"
          >
            A 3-hour sprint across <span className="text-[#DFECF4] font-semibold">15 signed domains</span>, live targets, and a leaderboard that trusts{' '}
            <span className="text-[#EEC470]">signatures, not stories</span>. Deploy your pod, verify every flag, wake up on the board.
          </motion.p>

          {/* Live status */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0 }}
            className="mt-6 inline-flex items-center gap-3 border border-[#1A3A6E] bg-[rgba(14,36,72,0.5)] backdrop-blur-sm px-4 py-2.5 rounded-lg"
          >
            <span className="h-1.5 w-1.5 animate-pulse rounded-full" style={{ background: color }} />
            <span className="font-mono text-[11px] tracking-[0.15em] text-[#DFECF4]">{label}</span>
            <span className="font-mono text-[10px] text-[#8CA7CC]">·</span>
            <span className="flex items-center gap-1.5 font-mono text-[10px]">
              {['hub', 'PADS', 'flags'].map((k, i) => (
                <span key={k} className={`px-1.5 py-0.5 border rounded-sm ${i === status ? 'border-[#DA2B36] text-[#DFECF4]' : 'border-[#1A3A6E] text-[#8CA7CC]'}`}>{k}</span>
              ))}
            </span>
          </motion.div>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.1 }}
            className="mt-8"
          >
            <div className="mb-3 flex items-center justify-center gap-2.5 lg:justify-start">
              <span className="bg-[#DA2B36] px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-[#DFECF4] rounded-sm">T-MINUS</span>
              <span className="font-mono text-[10px] tracking-[0.2em] text-[#8CA7CC]">UNTIL LAUNCH</span>
            </div>
            <div className="flex items-center justify-center gap-3 lg:justify-start">
              {units.map((u) => (
                <div key={u.key} className="flex flex-col items-center gap-1.5">
                  <div
                    className="relative w-16 sm:w-20 border border-[#1A3A6E] bg-[rgba(14,36,72,0.6)] backdrop-blur-sm px-2 py-3 sm:py-4 rounded-md"
                    style={{ boxShadow: `inset 0 0 20px rgba(26,86,219,0.08), 0 0 15px rgba(26,86,219,0.05)` }}
                  >
                    <span className="font-mono text-xl sm:text-2xl md:text-3xl text-[#DFECF4] font-bold">{PAD(t[u.key])}</span>
                    <span className="absolute right-1.5 top-1 text-[8px] font-bold" style={{ color: u.color }}>▮</span>
                  </div>
                  <span className="font-mono text-[9px] tracking-[0.25em] text-[#8CA7CC]">{u.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Counter */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-6 flex items-baseline gap-3 justify-center lg:justify-start"
          >
            <span className="font-sans text-3xl md:text-4xl font-black text-[#DFECF4]">{String(climbing).padStart(2, '0')}</span>
            <span className="font-mono text-[10px] tracking-[0.2em] text-[#8CA7CC]">STANDS DEPLOYED</span>
          </motion.div>

          {/* CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:justify-start"
          >
            <a href="#register" className="btn-neon w-full sm:w-auto text-center">
              Register Your Stand
            </a>
            <a href="#domains" className="btn-ghost w-full sm:w-auto text-center">
              Explore Domains
            </a>
          </motion.div>

          {/* Meta badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="mt-5 flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] tracking-[0.15em] text-[#8CA7CC] lg:justify-start"
          >
            <span className="border border-[#1A3A6E] bg-[rgba(14,36,72,0.4)] px-3 py-1 rounded-md">▣ {EVENT.duration}</span>
            <span className="border border-[#1A3A6E] bg-[rgba(14,36,72,0.4)] px-3 py-1 rounded-md">◉ {EVENT.demoTime}</span>
            <span className="border border-[#1A3A6E] bg-[rgba(14,36,72,0.4)] px-3 py-1 rounded-md">◈ {EVENT.teamSize}</span>
          </motion.div>
        </motion.div>

        {/* Right — Shield + faction card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex items-center justify-center"
        >
          {/* Shield centerpiece */}
          <div className="relative">
            <CapShield size={320} glow={true} className="float-y" />

            {/* Orbiting faction badges */}
            <AnimatePresence mode="wait">
              <motion.div
                key={faction.id}
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="absolute -top-4 -right-4 z-20"
              >
                <div className="flex items-center gap-2 border border-[#1A3A6E] bg-[rgba(14,36,72,0.9)] backdrop-blur-md px-3 py-2 rounded-lg shadow-xl">
                  <FactionEmblem id={faction.id} color={faction.color} accent={faction.accent} ink={faction.ink} className="h-8 w-8" />
                  <div className="text-left">
                    <div className="font-display text-xs font-bold uppercase" style={{ color: faction.color }}>{faction.name}</div>
                    <div className="font-mono text-[8px] text-[#8CA7CC]">{faction.codename}</div>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Bottom info card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.0 }}
              className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-[90%]"
            >
              <div className="border border-[#1A3A6E] bg-[rgba(14,36,72,0.7)] backdrop-blur-md rounded-lg p-4 text-center">
                <div className="font-mono text-[9px] tracking-[0.25em] text-[#8CA7CC] mb-2">// FACTION DOMAINS</div>
                <div className="flex flex-wrap justify-center gap-1.5">
                  {faction.domains.slice(0, 3).map((did) => {
                    const d = DOMAINS.find((x) => x.id === did);
                    return d ? (
                      <span key={did} className="border border-[#1A3A6E] bg-[rgba(14,36,72,0.4)] px-2 py-0.5 font-mono text-[8px] text-[#DFECF4] rounded-sm">
                        {d.icon} {d.title.split(' ')[0].toUpperCase()}
                      </span>
                    ) : null;
                  })}
                </div>
                <div className="mt-2 font-mono text-[9px] text-[#8CA7CC]">
                  + {faction.domains.length - 3} more · <span className="text-[#EEC470]">{faction.domains.length} total</span>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </div>

      {/* Scroll down indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-2 cursor-pointer"
        onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
      >
        <span className="font-mono text-[9px] tracking-[0.3em] text-[#8CA7CC] uppercase">Scroll</span>
        <div className="relative w-6 h-10 border border-[#1A3A6E] rounded-full flex justify-center pt-2 bg-[rgba(14,36,72,0.3)] backdrop-blur-sm">
          <motion.div
            className="w-1 h-2.5 rounded-full bg-[#EEC470]"
            animate={{ y: [0, 12, 0], opacity: [1, 0.3, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          />
        </div>
        <motion.svg
          width="16" height="10" viewBox="0 0 16 10" fill="none"
          animate={{ y: [0, 4, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M1 1L8 8L15 1" stroke="#8CA7CC" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </motion.svg>
      </motion.div>

      {/* Bottom ticker */}
      <div className="relative z-10 border-t border-[#1A3A6E] bg-[rgba(14,36,72,0.5)] backdrop-blur-sm py-3 overflow-hidden">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5">
          <span className="border border-[#DA2B36]/40 px-3 py-1 font-mono text-[9px] text-[#DFECF4] rounded-sm">EDGE · 15 PoPs</span>
          {DOMAINS.slice(0, 5).map((d, i) => (
            <span key={d.id} className="flex items-center gap-2 font-mono text-xs text-[#8CA7CC]">
              <span className="text-[#DFECF4]">N{i + 1}</span>
              <span className="text-[#5A6A8A]">·</span>
              <span>{d.icon}</span>
              <span>{d.title.split(' ')[0]}</span>
            </span>
          ))}
          <a href="#domains" className="font-mono text-xs text-[#EEC470] hover:text-[#DFECF4] transition-colors">+10 →</a>
        </div>
      </div>
    </section>
  );
}
