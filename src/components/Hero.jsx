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
  { key: 'd', label: 'DAYS', accent: '#ffc53d' },
  { key: 'h', label: 'HRS', accent: '#4f8cff' },
  { key: 'm', label: 'MIN', accent: '#ffd34d' },
  { key: 's', label: 'SEC', accent: '#ffc53d' },
];

const STATUSES = [
  ['hub', 'operational', '#52e0a4'],
  ['PADS matrix', 'validating', '#ffc53d'],
  ['flag enclave', 'signed', '#4f8cff'],
  ['queue', 'spooling', '#ff8a3d'],
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
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0b0b0d]">
      {/* Runtime backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-overlay opacity-25" />
        <div className="float-drift absolute -top-32 left-[8%] h-[420px] w-[420px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(255,197,61,0.08) 0%, transparent 70%)' }} />
        <div className="float-drift absolute -bottom-40 right-[4%] h-[460px] w-[460px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(79,140,255,0.07) 0%, transparent 70%)', animationDelay: '2.5s' }} />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-12 px-5 pt-32 pb-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-center md:px-8">
        {/* Left — the case */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-6 flex flex-wrap items-center justify-center gap-2.5 lg:justify-start"
          >
            <span className="comic-chip border border-[#ffc53d]/50 px-3 py-1 text-[10px] text-[#fffdf6]">⌖ REVERSE HACKATHON 2026</span>
            <span className="comic-chip border border-[#26272e] px-3 py-1 text-[10px] text-[#8d90a3]">ROLLOUT v2026.0</span>
            <span className="comic-chip border border-[#26272e] px-3 py-1 text-[10px] text-[#52e0a4]">
              <span className="mr-1 inline-block h-1.5 w-1.5 animate-pulse rounded-full bg-[#52e0a4]" />HUB ONLINE
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="relative z-10"
          >
            <span className="block font-display text-[clamp(1.7rem,6.5vw,4rem)] leading-none text-[#eef0f6]">
              REVERSE<sup className="align-top text-[0.35em] text-[#ffc53d]">®</sup>
            </span>
            <span className="mt-2 block font-serif italic text-[clamp(1.6rem,5vw,3.4rem)] leading-none text-[#ffd34d] [text-shadow:0_0_40px_rgba(255,211,77,0.35)]">
              with <em className="not-italic font-bold">proof</em>.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.9 }}
            className="mx-auto mt-7 max-w-xl text-base md:text-lg text-[#c9cbd8] font-medium lg:mx-0"
          >
            A deterministic way to spend one night: 15 signed domains, live targets, and a leaderboard that trusts
            <span className="text-[#ffd34d]"> signatures, not stories</span>. Deploy your pod, verify every flag, wake up on the board.
          </motion.p>

          {/* Live status tape */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.25 }}
            className="mt-6 flex max-w-xl items-center justify-between gap-4 border border-[#26272e] bg-[#0d0e11] px-4 py-2.5 mx-auto lg:mx-0"
          >
            <div className="flex items-center gap-2 font-mono text-[11px] tracking-[0.18em] text-[#8d90a3]">
              <span className="h-1.5 w-1.5 animate-pulse" style={{ background: color }} />
              <span className="text-[#eef0f6]">{label}</span>
              <span style={{ color }}>{color}</span>
            </div>
            <div className="hidden sm:flex items-center gap-1.5 font-mono text-[10px] text-[#5c6073]">
              {['hub', 'PADS', 'flags', 'queue'].map((k, i) => (
                <span key={k} className={`px-1.5 py-0.5 border ${i === status ? 'border-[#ffc53d]/60 text-[#ffd34d]' : 'border-[#26272e]'}`}>{k}</span>
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
            <span className="font-display text-4xl md:text-5xl text-[#ffd34d] [text-shadow:0_0_24px_rgba(255,211,77,0.35)]">
              {String(climbing).padStart(2, '0')}
            </span>
            <span className="font-mono text-[11px] tracking-[0.25em] text-[#989bb0]">
              PODS DEPLOYED
              <span className="block text-[#8d90a3]">{isNew ? <span className="text-[#52e0a4]">+1 · VERIFIED</span> : 'EVERY SIGNATURE CRYPTO-SIGNED'}</span>
            </span>
          </motion.div>

          {/* Countdown — the runtime window */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.35 }}
            className="mt-8"
          >
            <div className="mb-3 flex items-center gap-2">
              <span className="comic-chip border border-[#ffc53d]/50 px-3 py-1 text-[10px] text-[#ffd34d]">T-MINUS</span>
              <span className="font-mono text-[11px] tracking-[0.4em] text-[#8d90a3]">UNTIL CHAMBER OPENS</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 lg:justify-start sm:gap-3">
              {units.map((u) => (
                <div key={u.label} className="flex flex-col items-center gap-1.5">
                  <div
                    className="relative w-16 sm:w-20 border border-[#2b2d36] bg-[#0d0e12] px-2 py-3 sm:py-4"
                    style={{ boxShadow: 'inset 0 0 22px rgba(0,0,0,0.8)' }}
                  >
                    <span className="font-mono text-xl sm:text-2xl md:text-3xl text-[#eef0f6]">
                      {PAD(t[u.key])}
                    </span>
                    <span className="pointer-events-none absolute inset-0 scanline" />
                    <span className="absolute right-1.5 top-1 text-[8px] leading-none" style={{ color: u.accent }}>▮</span>
                  </div>
                  <span className="font-mono text-[9px] tracking-[0.25em] text-[#8d90a3] sm:text-[10px]">{u.label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.5 }}
            className="mt-8 flex flex-col items-center gap-4 sm:flex-row lg:justify-start sm:justify-center"
          >
            <a href="#register" className="btn-neon pulse-ring w-full sm:w-auto">Deploy Your Stand</a>
            <a href="#domains" className="btn-ghost w-full sm:w-auto">Explore the Runtime</a>
          </motion.div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#989bb0] lg:justify-start">
            <span className="comic-chip border border-[#2b2d36] bg-[#0e0e11] px-3 py-1 text-[#eef0f6]"><span className="text-[#ffd34d]">■</span>{EVENT.duration}</span>
            <span className="comic-chip border border-[#2b2d36] bg-[#0e0e11] px-3 py-1 text-[#eef0f6]"><span className="text-[#ffc53d]">◉</span>{EVENT.demoTime}</span>
            <span className="comic-chip border border-[#2b2d36] bg-[#0e0e11] px-3 py-1 text-[#eef0f6]"><span className="text-[#ffc53d]">◈</span>{EVENT.teamSize}</span>
          </div>
        </div>

        {/* Right — node telemetry */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.9 }}
          className="relative hidden lg:block"
        >
          <div className="relative mx-auto w-full max-w-md">
            <div className="relative border border-[#26272e] bg-[#0d0e11]/80 p-6" style={{ boxShadow: '0 0 60px rgba(0,0,0,0.6)' }}>
              {/* corner ticks */}
              <span className="absolute left-0 top-0 h-3 w-3 border-l-2 border-t-2 border-[#ffc53d]" />
              <span className="absolute right-0 top-0 h-3 w-3 border-r-2 border-t-2 border-[#ffc53d]" />
              <span className="absolute bottom-0 left-0 h-3 w-3 border-b-2 border-l-2 border-[#ffc53d]" />
              <span className="absolute bottom-0 right-0 h-3 w-3 border-b-2 border-r-2 border-[#ffc53d]" />

              {/* node header */}
              <div className="mb-6 flex items-center justify-between">
                <div className="font-mono text-[11px] tracking-[0.25em] text-[#8d90a3]">NODE·07 <span className="text-[#ffc53d]">/</span> REV-KN</div>
                <div className="flex items-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#52e0a4]">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#52e0a4]" />OPERATIONAL
                </div>
              </div>

              {/* the disc */}
              <div className="relative mx-auto flex h-60 w-60 items-center justify-center">
                <div
                  className="absolute inset-0 rounded-full opacity-20"
                  style={{ background: 'radial-gradient(circle, rgba(255,211,77,0.5) 0%, transparent 70%)' }}
                />
                <div className="dc-bullet h-24 w-44 text-6xl">DC</div>
                <span className="absolute -bottom-1 font-mono text-[9px] tracking-[0.5em] text-[#ffd34d]">NIGHT OPERATIONS DIVISION</span>
              </div>

              {/* metrics */}
              <div className="mt-6 grid grid-cols-3 gap-3">
                {[
                  ['COUNTDOWN', '21:00', 'LIGHTS OUT'],
                  ['DOMAINS', '15', 'SIGNED'],
                  ['RUNTIME', '3H', `${n || 0} PODS`],
                ].map(([k, v, s]) => (
                  <div key={k} className="border border-[#26272e] bg-[#0a0a0c] px-2 py-3 text-center">
                    <div className="font-mono text-[8px] tracking-[0.25em] text-[#5c6073]">{k}</div>
                    <div className="mt-1 font-display text-xl text-[#ffd34d]">{v}</div>
                    <div className="font-mono text-[8px] tracking-[0.2em] text-[#52e0a4]">{s}</div>
                  </div>
                ))}
              </div>

              {/* agent pills */}
              <div className="mt-4 space-y-2">
                <div className="flex items-center justify-between border border-[#26272e] px-3 py-2 font-mono text-[10px] tracking-[0.15em]">
                  <span className="text-[#c9cbd8]">rev0 agent · check-in</span>
                  <span className="text-[#ffc53d]">{PAD(t.h)}:{PAD(t.m)}</span>
                </div>
                <div className="flex items-center justify-between border border-[#26272e] px-3 py-2 font-mono text-[10px] tracking-[0.15em]">
                  <span className="text-[#c9cbd8]">Synthesis matrix</span>
                  <span className="text-[#ff8a3d]">validating</span>
                </div>
                <div className="flex items-center justify-between border border-[#26272e] px-3 py-2 font-mono text-[10px] tracking-[0.15em]">
                  <span className="text-[#c9cbd8]">Flag enclave</span>
                  <span className="text-[#4f8cff]">signed</span>
                </div>
              </div>
            </div>

            {/* status footer chips */}
            <div className="mt-3 grid grid-cols-2 gap-3 px-1">
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.15em] text-[#8d90a3]">
                <span className="text-[#5c6073]">EDGE</span><span className="text-[#eef0f6]">III NODES</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.15em] text-[#8d90a3]">
                <span className="text-[#5c6073]">UPTIME</span><span className="text-[#eef0f6]">100%</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.15em] text-[#8d90a3]">
                <span className="text-[#5c6073]">MODE</span><span className="text-[#eef0f6]">SOLO·DUO</span>
              </div>
              <div className="flex items-center justify-between font-mono text-[10px] tracking-[0.15em] text-[#8d90a3]">
                <span className="text-[#5c6073]">LEDGER</span><span className="text-[#eef0f6]">1 CHAIN</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Domain ticker — the edge */}
      <div className="relative z-10 border-y border-[#26272e] bg-[#0d0e11] py-3 overflow-hidden">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5">
          <span className="comic-chip border border-[#ffc53d]/50 px-3 py-1 text-[9px] text-[#ffd34d]">EDGE · 15 PoPs</span>
          {HERO_DOMAINS.map((d, i) => (
            <span key={d.id} className="flex items-center gap-2 font-mono text-xs text-[#989bb0]">
              <span className="text-[#ffc53d]">N{i + 1}</span>
              <span className="text-[#5c6073]">·</span>
              <span>{d.icon}</span>
              <span>{d.title}</span>
            </span>
          ))}
          <a href="#domains" className="font-mono text-xs text-[#ffd34d] hover:text-[#fffdf6] transition-colors">+10 PoPs →</a>
        </div>
      </div>
    </section>
  );
}