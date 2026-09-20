import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { EVENT, DOMAINS, FACTIONS, factionOf } from '../data/domains';
import { FactionEmblem } from './Emblems';

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
  { key: 'd', label: 'DAYS', ink: '#C75C35' },
  { key: 'h', label: 'HRS', ink: '#8A4A28' },
  { key: 'm', label: 'MIN', ink: '#C75C35' },
  { key: 's', label: 'SEC', ink: '#8A4A28' },
];

const STATUSES = [
  ['hub', 'operational', '#36405A'],
  ['PADS matrix', 'validating', '#C75C35'],
  ['flag enclave', 'signed', '#36405A'],
  ['queue', 'spooling', '#8A4A28'],
];

const HERO_DOMAINS = DOMAINS.slice(0, 5);

function useStands() {
  const [n, setN] = useState(0);
  const [prev, setPrev] = useState(null);
  useEffect(() => {
    fetch('/api/stats')
      .then((r) => r.json())
      .then((d) => {
        if (d?.ok && typeof d.registrations?.total === 'number') {
          setPrev(d.registrations.total);
          setN(d.registrations.total);
        }
      })
      .catch(() => {});
  }, []);
  return { n, prev };
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

const SLAM = {
  initial: { scale: 2.4, opacity: 0, rotate: -16 },
  animate: { scale: 1, opacity: 1, rotate: 0 },
};

export default function Hero() {
  const t = useCountdown();
  const { n, prev } = useStands();
  const climbing = useClimb(n);
  const isNew = prev !== null && n > prev;
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
  const fDomains = faction.domains.map((id) => DOMAINS.find((d) => d.id === id));

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#060606]">
      {/* Character takeover backdrop — the live "revolution" of the three heroes */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-overlay opacity-[0.06]" />
        <div className="float-drift absolute -top-32 left-[8%] h-[440px] w-[440px] blur-3xl transition-colors duration-700" style={{ background: `radial-gradient(circle, ${faction.color}14 0%, transparent 70%)` }} />
        <div className="float-drift absolute -bottom-40 right-[4%] h-[480px] w-[480px] blur-3xl transition-colors duration-700" style={{ background: `radial-gradient(circle, ${faction.accent}12 0%, transparent 70%)`, animationDelay: '2.5s' }} />
        {/* Giant watermark emblem of the active character */}
        <AnimatePresence mode="wait">
          <motion.div
            key={faction.id}
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: 0.07, scale: 1 }}
            exit={{ opacity: 0, scale: 1.15 }}
            transition={{ duration: 0.9, ease: 'easeOut' }}
            className="float-emblem absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 lg:block"
            style={{ ['--scale']: '1', ['--tilt']: '-6deg' }}
          >
            <FactionEmblem id={faction.id} color={faction.color} accent={faction.accent} ink={faction.ink} className="h-[560px] w-[560px]" />
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-12 px-5 pt-32 pb-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center md:px-8">
        {/* Left — the front porch */}
        <motion.div className="text-center lg:text-left" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8 }}>
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-6 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start"
          >
            <span className="border border-[#111E34] bg-[#0A0203] px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-[#7A686B]"><span className="text-[#1A0A0A]">[00]</span> // REVERSE HACKATHON 2026</span>
            <span className="border border-[#111E34] bg-[#0A0203] px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-[#7A686B]"><span className="text-[#1A0A0A]">[01]</span> // {faction.name} · FACTION {PAD(fi + 1)}/03</span>
            <span className="border border-[#36405A]/40 bg-[#0A0203] px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-[#1C0A0A]">
              <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse bg-[#36405A]" />[02] // HUB ONLINE
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="relative z-10"
          >
            <span className="block font-sans text-[clamp(2.6rem,9vw,5.5rem)] font-black uppercase leading-[0.95] tracking-[-0.02em] text-[#1A0A0A]">
              REVERSE<span className="text-[#1A0A0A]">.</span>
            </span>
            <span className="mt-2 block font-sans text-[clamp(1.8rem,5.5vw,3.6rem)] font-black uppercase leading-none text-[#1A0A0A] [text-shadow:0_0_40px_rgba(217,64,21,0.14)]">
              with <span className="text-[#1A0A0A]">proof</span>.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.9 }}
            className="mx-auto mt-7 max-w-xl text-base md:text-lg text-[#7A686B] font-medium lg:mx-0"
          >
            A deterministic way to spend one night: 15 signed domains, live targets, and a leaderboard that trusts
            <span className="text-[#1A0A0A]"> signatures, not stories</span>. Deploy your pod, verify every flag, wake up on the board.
          </motion.p>

          {/* Live status tape */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-6 flex max-w-xl items-center justify-between gap-4 border border-[#111E34] bg-[#0A1220] px-4 py-2.5 mx-auto lg:mx-0"
          >
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-[#7A686B]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-none" style={{ background: color }} />
              <span className="text-[#1A0A0A]">{label}</span>
              <span style={{ color }}>{color}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-[#7A686B]">
              {['hub', 'PADS', 'flags', 'queue'].map((k, i) => (
                <span key={k} className={`px-1.5 py-0.5 border ${i === status ? 'border-[#B01713] text-[#1A0A0A]' : 'border-[#111E34]'}`}>{k}</span>
              ))}
            </div>
          </motion.div>

          {/* Live counter */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="mt-6 inline-flex items-baseline gap-3"
          >
            <span className="font-sans text-4xl md:text-5xl font-black text-[#1A0A0A]">
              {String(climbing).padStart(2, '0')}
            </span>
            <span className="font-mono text-[11px] tracking-[0.25em] text-[#7A686B]">
              STANDING ORDER COUNT
              <span className="block text-[#4A3D3F]">{isNew ? <span className="text-[#1C0A0A]">+1 · VERIFIED</span> : 'EVERY FLAG CRYPTO-SIGNED'}</span>
            </span>
          </motion.div>

          {/* Countdown — plain, legible */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4 }}
            className="mt-8"
          >
            <div className="mb-3 flex items-center justify-center gap-2.5 lg:justify-start">
              <span className="border border-[#B01713] bg-[#D9261E] px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-[#1A0A0A]">T-MINUS</span>
              <span className="font-mono text-[11px] tracking-[0.3em] text-[#7A686B]">UNTIL REGISTRATION CLOSES</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 lg:justify-start sm:gap-3">
              {units.map((u) => (
                <div key={u.key} className="flex flex-col items-center gap-1.5">
                  <div className="relative w-16 sm:w-20 border border-[#111E34] bg-[#0A1220] px-2 py-3 sm:py-4" style={{ boxShadow: 'inset 0 0 18px rgba(217,64,21,0.05)' }}>
                    <span className="font-mono text-xl sm:text-2xl md:text-3xl text-[#1A0A0A]">
                      {PAD(t[u.key])}
                    </span>
                    <span className="absolute right-1.5 top-1 text-[8px]" style={{ color: u.ink }}>▮</span>
                  </div>
                  <span className="font-mono text-[9px] tracking-[0.25em] text-[#7A686B] sm:text-[10px]">{u.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.55 }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start sm:justify-center"
          >
            <a href="#register" className="inline-block w-full text-center bg-[#D9261E] px-10 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.15em] text-[#1A0A0A] transition-all hover:bg-[#D9261E] hover:shadow-[0_0_24px_rgba(217,64,21,0.4)] sm:w-auto">Register Your Stand</a>
            <a href="#domains" className="inline-block w-full text-center border border-[#B01713] px-10 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.15em] text-[#1A0A0A] transition-all hover:bg-[#D9261E]/10 hover:shadow-[0_0_18px_rgba(217,64,21,0.25)] sm:w-auto">Explore the Runtime</a>
          </motion.div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#7A686B] lg:justify-start">
            <span className="border border-[#111E34] bg-[#0A0203] px-3 py-1 text-[#1A0A0A]"><span className="text-[#1A0A0A]">▣</span>{EVENT.duration}</span>
            <span className="border border-[#111E34] bg-[#0A0203] px-3 py-1 text-[#1A0A0A]"><span className="text-[#1A0A0A]">◉</span>{EVENT.demoTime}</span>
            <span className="border border-[#111E34] bg-[#0A0203] px-3 py-1 text-[#1A0A0A]"><span className="text-[#1A0A0A]">◈</span>{EVENT.teamSize}</span>
          </div>
        </motion.div>

        {/* Right — live character takeover card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.9 }}
          className="relative"
        >
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative overflow-hidden border border-[#111E34] bg-[#0A1220]" style={{ boxShadow: '0 24px 70px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
              <span className="absolute left-0 top-0 z-20 h-3 w-3 border-l-2 border-t-2" style={{ borderColor: faction.color }} />
              <span className="absolute right-0 top-0 z-20 h-3 w-3 border-r-2 border-t-2" style={{ borderColor: faction.color }} />
              <span className="absolute bottom-0 left-0 z-20 h-3 w-3 border-b-2 border-l-2" style={{ borderColor: faction.color }} />
              <span className="absolute bottom-0 right-0 z-20 h-3 w-3 border-b-2 border-r-2" style={{ borderColor: faction.color }} />

              {/* Card header — animated website chrome */}
              <div className="flex items-center justify-between border-b border-[#111E34] bg-[#0A0203] px-4 py-2.5">
                <div className="font-mono text-[10px] tracking-[0.25em]" style={{ color: faction.color }}>
                  CHARACTER <span className="text-[#1A0A0A]">0{fi + 1}</span> / 03 · <span className="text-[#7A686B]">LIVE FEED</span>
                </div>
                <div className="flex items-center gap-3 font-mono text-[9px] tracking-[0.2em] text-[#7A686B]">
                  <span className="text-[#1A0A0A]">UTC+05:30</span>
                  <span className="flex items-center gap-1.5" style={{ color: faction.accent }}>
                    <span className="ticker-blink inline-block h-1.5 w-1.5" style={{ background: faction.accent }} />
                    REC
                  </span>
                </div>
              </div>

              {/* Takeover panel — swaps with the active character */}
              <div className="relative min-h-[420px] sm:min-h-[460px] overflow-hidden" style={{ background: `linear-gradient(160deg, ${faction.color}26 0%, ${faction.color}0d 40%, transparent 100%)` }}>
                <div className="pointer-events-none absolute inset-0 grid-overlay opacity-[0.07]" />
                <div className="speed-storm pointer-events-none absolute inset-0 opacity-40" />

                <AnimatePresence mode="wait">
                  <motion.div
                    key={faction.id}
                    initial={{ opacity: 0, clipPath: 'inset(0 100% 0 0)' }}
                    animate={{ opacity: 1, clipPath: 'inset(0 0% 0 0)' }}
                    exit={{ opacity: 0, clipPath: 'inset(0 0% 0 100%)' }}
                    transition={{ duration: 0.55, ease: 'easeInOut' }}
                    className="relative flex flex-col items-center px-5 pb-5 pt-8 text-center"
                  >
                    {/* Comic burst + emblem slam */}
                    <div className="relative flex h-36 w-36 items-center justify-center">
                      <span className="burst burst-rotate absolute inset-0 opacity-90" style={{ background: faction.color, backgroundImage: 'radial-gradient(rgba(255,255,255,0.22) 1px, transparent 1.6px)', backgroundSize: '10px 10px', boxShadow: `0 0 40px ${faction.color}55` }} />
                      <motion.div {...SLAM} transition={{ type: 'spring', stiffness: 240, damping: 18, delay: 0.15 }} className="absolute inset-3">
                        <FactionEmblem id={faction.id} color={faction.color} accent="#EAF1FB" ink={faction.ink} className="h-full w-full" />
                      </motion.div>
                    </div>

                    {/* Character reveal type */}
                    <motion.div
                      initial={{ scale: 2.2, opacity: 0, y: 10 }}
                      animate={{ scale: 1, opacity: 1, y: 0 }}
                      transition={{ type: 'spring', stiffness: 300, damping: 22, delay: 0.28 }}
                      className="mt-4 font-display text-5xl font-black uppercase tracking-wide leading-none"
                      style={{ color: faction.color, textShadow: `0 0 26px ${faction.color}66` }}
                    >
                      {faction.name}
                    </motion.div>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.35em] text-[#1A0A0A]"
                    >
                      <span className="text-[#7A686B]">// {faction.codename}</span> · {faction.hero}
                    </motion.div>

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-3 max-w-xs text-sm leading-relaxed text-[#DCE6F8]"
                    >
                      {faction.blurb}
                    </motion.p>

                    {/* The 5 domains this character carries */}
                    <motion.ul
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.6 }}
                      className="mt-5 grid w-full grid-cols-2 gap-2"
                    >
                      {fDomains.map((d) => (
                        <li key={d.id} className="flex items-center justify-between gap-2 border border-[#0E182A] bg-[#0A0203]/80 px-3 py-2 font-mono text-[10px] tracking-wide">
                          <span className="truncate text-[#1A0A0A]">{d.title.toUpperCase()}</span>
                          <span className="shrink-0" style={{ color: faction.color }}>{PAD(21 + fDomains.indexOf(d))}</span>
                        </li>
                      ))}
                    </motion.ul>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.72 }}
                      className="mt-5 inline-flex items-center gap-2 border px-3 py-1.5 font-mono text-[9px] tracking-[0.25em]"
                      style={{ borderColor: `${faction.color}66`, color: faction.color }}
                    >
                      <span className="ticker-blink inline-block h-1.5 w-1.5" style={{ background: faction.color }} />
                      {faction.tagline}
                    </motion.div>
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Card footer — faction switcher */}
              <div className="grid grid-cols-3 border-t border-[#111E34] bg-[#0A0203]">
                {FACTIONS.map((f, i) => (
                  <button
                    key={f.id}
                    onClick={() => { setManual(true); setFi(i); }}
                    aria-label={`Faction ${f.name}`}
                    className={`relative flex flex-col items-center gap-1.5 px-2 py-3 transition-colors ${
                      i === fi ? 'bg-[#0A1220]' : 'opacity-55 hover:opacity-100'
                    }`}
                  >
                    <FactionEmblem id={f.id} color={f.color} accent={f.accent} ink={f.ink} className="h-9 w-9" />
                    <span className="font-mono text-[8px] tracking-[0.25em] text-[#1A0A0A]">{f.name}</span>
                    <span className="h-[2px] w-8 transition-colors" style={{ background: i === fi ? f.color : '#1E3660' }} />
                  </button>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Domain ticker — plain strip with faction tags */}
      <div className="relative z-10 border-y border-[#111E34] bg-[#0A1220] py-3 overflow-hidden">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5">
          <span className="border border-[#B01713]/50 px-3 py-1 font-mono text-[9px] text-[#1A0A0A]">EDGE · 15 PoPs</span>
          {HERO_DOMAINS.map((d, i) => {
            const f = factionOf(d.id);
            return (
              <span key={d.id} className="flex items-center gap-2 font-mono text-xs text-[#7A686B]">
                <span className="text-[#1A0A0A]">N{i + 1}</span>
                <span className="text-[#4A3D3F]">·</span>
                <span style={{ color: f?.color }}>{d.icon}</span>
                <span>{d.title}</span>
              </span>
            );
          })}
          <a href="#domains" className="font-mono text-xs text-[#1A0A0A] hover:text-[#1A0A0A] transition-colors">+10 PoPs →</a>
        </div>
      </div>
    </section>
  );
}