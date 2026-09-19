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
  { key: 'd', label: 'DAYS', ink: '#FFD600' },
  { key: 'h', label: 'HRS', ink: '#FF6B35' },
  { key: 'm', label: 'MIN', ink: '#FFD600' },
  { key: 's', label: 'SEC', ink: '#FF6B35' },
];

const STATUSES = [
  ['hub', 'operational', '#15803d'],
  ['PADS matrix', 'validating', '#FFD600'],
  ['flag enclave', 'signed', '#22c55e'],
  ['queue', 'spooling', '#FF6B35'],
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

  const [label, color] = STATUSES[status];

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0F0F0F]">
      {/* Dark industrial backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-overlay opacity-[0.06]" />
        <div className="float-drift absolute -top-32 left-[8%] h-[420px] w-[420px] rounded-none blur-3xl" style={{ background: 'radial-gradient(circle, rgba(255,214,0,0.05) 0%, transparent 70%)' }} />
        <div className="float-drift absolute -bottom-40 right-[4%] h-[460px] w-[460px] rounded-none blur-3xl" style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.05) 0%, transparent 70%)', animationDelay: '2.5s' }} />
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
            <span className="border border-[#262626] bg-[#111111] px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-[#6E6E6E]"><span className="text-[#FFD600]">[00]</span> // REVERSE HACKATHON 2026</span>
            <span className="border border-[#262626] bg-[#111111] px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-[#6E6E6E]"><span className="text-[#FFD600]">[01]</span> // DEP-CYS · v2026.0</span>
            <span className="border border-[#22c55e]/40 bg-[#111111] px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-[#22c55e]">
              <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse bg-[#22c55e]" />[02] // HUB ONLINE
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="relative z-10"
          >
            <span className="block font-sans text-[clamp(2.6rem,9vw,5.5rem)] font-black uppercase leading-[0.95] tracking-[-0.02em] text-[#F5F5F0]">
              REVERSE<span className="text-[#FFD600]">.</span>
            </span>
            <span className="mt-2 block font-sans text-[clamp(1.8rem,5.5vw,3.6rem)] font-black uppercase leading-none text-[#F5F5F0] [text-shadow:0_0_40px_rgba(255,214,0,0.14)]">
              with <span className="text-[#FF6B35]">proof</span>.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.9 }}
            className="mx-auto mt-7 max-w-xl text-base md:text-lg text-[#6E6E6E] font-medium lg:mx-0"
          >
            A deterministic way to spend one night: 15 signed domains, live targets, and a leaderboard that trusts
            <span className="text-[#FFD600]"> signatures, not stories</span>. Deploy your pod, verify every flag, wake up on the board.
          </motion.p>

          {/* Live status tape */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-6 flex max-w-xl items-center justify-between gap-4 border border-[#262626] bg-[#161616] px-4 py-2.5 mx-auto lg:mx-0"
          >
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-[#6E6E6E]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-none" style={{ background: color }} />
              <span className="text-[#F5F5F0]">{label}</span>
              <span style={{ color }}>{color}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-[#6E6E6E]">
              {['hub', 'PADS', 'flags', 'queue'].map((k, i) => (
                <span key={k} className={`px-1.5 py-0.5 border ${i === status ? 'border-[#FFD600] text-[#FFD600]' : 'border-[#262626]'}`}>{k}</span>
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
            <span className="font-sans text-4xl md:text-5xl font-black text-[#F5F5F0]">
              {String(climbing).padStart(2, '0')}
            </span>
            <span className="font-mono text-[11px] tracking-[0.25em] text-[#6E6E6E]">
              STANDING ORDER COUNT
              <span className="block text-[#555555]">{isNew ? <span className="text-[#15803d]">+1 · VERIFIED</span> : 'EVERY FLAG CRYPTO-SIGNED'}</span>
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
              <span className="border border-[#FFD600] bg-[#FFD600] px-3 py-1 font-mono text-[10px] tracking-[0.25em] text-[#0F0F0F]">T-MINUS</span>
              <span className="font-mono text-[11px] tracking-[0.4em] text-[#6E6E6E]">UNTIL NIGHT OPS</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 lg:justify-start sm:gap-3">
              {units.map((u) => (
                <div key={u.key} className="flex flex-col items-center gap-1.5">
                  <div className="relative w-16 sm:w-20 border border-[#262626] bg-[#161616] px-2 py-3 sm:py-4" style={{ boxShadow: 'inset 0 0 18px rgba(255,214,0,0.05)' }}>
                    <span className="font-mono text-xl sm:text-2xl md:text-3xl text-[#F5F5F0]">
                      {PAD(t[u.key])}
                    </span>
                    <span className="absolute right-1.5 top-1 text-[8px]" style={{ color: u.ink }}>▮</span>
                  </div>
                  <span className="font-mono text-[9px] tracking-[0.25em] text-[#6E6E6E] sm:text-[10px]">{u.label}</span>
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
            <a href="#register" className="inline-block w-full text-center bg-[#FFD600] px-10 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.15em] text-[#0F0F0F] transition-all hover:bg-[#FFC800] hover:shadow-[0_0_24px_rgba(255,214,0,0.4)] sm:w-auto">Register Your Stand</a>
            <a href="#domains" className="inline-block w-full text-center border border-[#FFD600] px-10 py-3.5 font-mono text-sm font-bold uppercase tracking-[0.15em] text-[#FFD600] transition-all hover:bg-[#FFD600]/10 hover:shadow-[0_0_18px_rgba(255,214,0,0.25)] sm:w-auto">Explore the Runtime</a>
          </motion.div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#6E6E6E] lg:justify-start">
            <span className="border border-[#262626] bg-[#111111] px-3 py-1 text-[#F5F5F0]"><span className="text-[#FFD600]">▣</span>{EVENT.duration}</span>
            <span className="border border-[#262626] bg-[#111111] px-3 py-1 text-[#F5F5F0]"><span className="text-[#FFD600]">◉</span>{EVENT.demoTime}</span>
            <span className="border border-[#262626] bg-[#111111] px-3 py-1 text-[#F5F5F0]"><span className="text-[#FFD600]">◈</span>{EVENT.teamSize}</span>
          </div>
        </motion.div>

        {/* Right — plain, honest card */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.9 }}
          className="relative hidden lg:block"
        >
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative border border-[#262626] bg-[#161616] p-6" style={{ boxShadow: '0 24px 70px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.05)' }}>
              <span className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-[#FFD600]" />
              <span className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-[#FFD600]" />
              <span className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-[#FFD600]" />
              <span className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-[#FFD600]" />

              <div className="mb-6 flex items-center justify-between">
                <div className="font-mono text-[11px] tracking-[0.25em] text-[#6E6E6E]">STAND · 07 <span className="text-[#F5F5F0]">/</span> REV-01</div>
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#22c55e]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-none bg-[#22c55e]" />OPEN
                </div>
              </div>

              <div className="relative mx-auto flex h-60 w-60 items-center justify-center">
                <div className="absolute inset-0 rounded-none opacity-20" style={{ background: 'radial-gradient(circle, rgba(255,107,53,0.14) 0%, transparent 70%)' }} />
                <div className="dc-bullet h-24 w-44 text-6xl">DC</div>
                <span className="absolute -bottom-1 font-mono text-[9px] tracking-[0.5em] text-[#FF6B35]">NIGHT OPS DIVISION</span>
              </div>

              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  ['COUNTDOWN', 'X-DAY', 'INCUBATING'],
                  ['DOMAINS', '15', 'SIGNED'],
                  ['RUNTIME', '3H', `${n || 0} STANDING`],
                ].map(([k, v, s]) => (
                  <div key={k} className="border border-[#262626] bg-[#111111] px-2 py-3 text-center">
                    <div className="font-mono text-[8px] tracking-[0.25em] text-[#6E6E6E]">{k}</div>
                    <div className="mt-1 font-sans text-xl font-black text-[#F5F5F0]">{v}</div>
                    <div className="font-mono text-[8px] tracking-[0.2em] text-[#22c55e]">{s}</div>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between border border-[#262626] px-3 py-2 font-mono text-[10px] tracking-[0.15em]">
                  <span className="text-[#6E6E6E]">What to bring</span>
                  <span className="text-[#F5F5F0]">laptop · cert · grit</span>
                </div>
                <div className="flex items-center justify-between border border-[#262626] px-3 py-2 font-mono text-[10px] tracking-[0.15em]">
                  <span className="text-[#6E6E6E]">Grounds</span>
                  <span className="text-[#F5F5F0]">SOLO·DUO</span>
                </div>
                <div className="flex items-center justify-between border border-[#262626] px-3 py-2 font-mono text-[10px] tracking-[0.15em]">
                  <span className="text-[#6E6E6E]">Ledger</span>
                  <span className="text-[#22c55e]">signed · 1 chain</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Domain ticker — plain strip */}
      <div className="relative z-10 border-y border-[#262626] bg-[#161616] py-3 overflow-hidden">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5">
          <span className="border border-[#FFD600]/50 px-3 py-1 font-mono text-[9px] text-[#FFD600]">EDGE · 15 PoPs</span>
          {HERO_DOMAINS.map((d, i) => (
            <span key={d.id} className="flex items-center gap-2 font-mono text-xs text-[#6E6E6E]">
              <span className="text-[#FFD600]">N{i + 1}</span>
              <span className="text-[#555555]">·</span>
              <span>{d.icon}</span>
              <span>{d.title}</span>
            </span>
          ))}
          <a href="#domains" className="font-mono text-xs text-[#FFD600] hover:text-[#F5F5F0] transition-colors">+10 PoPs →</a>
        </div>
      </div>
    </section>
  );
}