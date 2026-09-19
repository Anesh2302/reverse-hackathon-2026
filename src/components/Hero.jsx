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

// Live task pills — the queue assembling itself
const PILLS = [
  { tag: 'DONE', title: 'stand #042 booked', color: '#52e0a4' },
  { tag: 'DONE', title: 'hub: PADS uplink verified', color: '#52e0a4' },
  { tag: 'WORKING', title: 'scanning 15 domains', color: '#ffc53d' },
  { tag: 'QUEUED', title: 'doors at 21:00 — lights out', color: '#4f8cff' },
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

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col overflow-hidden bg-[#0b0b0d]">
      {/* Night console backdrop */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-overlay opacity-40" />
        <div className="float-drift absolute -top-32 left-[8%] h-[420px] w-[420px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(255,197,61,0.10) 0%, transparent 70%)' }} />
        <div className="float-drift absolute -bottom-40 right-[4%] h-[460px] w-[460px] rounded-full blur-3xl" style={{ background: 'radial-gradient(circle, rgba(79,140,255,0.08) 0%, transparent 70%)', animationDelay: '2.5s' }} />
        <div className="absolute inset-y-0 -left-32 w-64 opacity-20" style={{ background: 'repeating-linear-gradient(90deg, transparent 0 26px, rgba(255,211,77,0.10) 26px 28px)' }} />
        <div className="absolute right-0 top-0 h-40 w-40 opacity-[0.07] font-mono text-[10px] leading-4 text-[#ffd34d] overflow-hidden select-none">
          {'DD:TRACE[0]'.repeat(60)}
        </div>
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-12 px-5 pt-32 pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center md:px-8">
        {/* Left — the night shift */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-7 flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <span className="comic-chip border border-[#ffc53d]/60 bg-[#ffd34d] px-4 py-1.5 text-[10px] text-[#0b0b0d]">
              <span className="h-1.5 w-1.5 animate-pulse bg-[#0b0b0d]" />
              DEP-CYS · NIGHT SHIFT
            </span>
            <span className="comic-chip border border-[#3a3d4d] px-4 py-1.5 text-[10px] text-[#4f8cff]">YEARS I · II · III</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.7 }}
            className="font-display relative z-10 leading-[1.1]"
          >
            <span className="mb-4 block font-mono text-[11px] md:text-sm tracking-[0.4em] text-[#989bb0]">
              ══ {EVENT.dateLabel} · LIGHTS OUT {EVENT.lightsOut || '21:00'} ══
            </span>
            <span className="block text-[clamp(1.9rem,7vw,5.5rem)] text-[#ffd34d] [text-shadow:0_0_30px_rgba(255,211,77,0.35)]">
              REVERSE
            </span>
            <span className="block text-[clamp(1.9rem,7vw,5.5rem)] text-[#eef0f6]">
              HACKATHON
              <span className="ml-3 align-baseline text-[#ffc53d]">2K26</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.9 }}
            className="mx-auto mt-7 max-w-xl text-base md:text-lg text-[#c9cbd8] font-medium lg:mx-0"
          >
            <span className="font-mono text-[13px] text-[#ffd34d]">&gt; {EVENT.tagline}</span>
            <br className="hidden sm:block" />
            <span className="mt-1 inline-block">{EVENT.description}</span>
          </motion.p>

          {/* Live counter — the night clock */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-8 inline-flex items-center gap-4 border border-[#26272e] bg-[#0e0e11]/80 px-5 py-3"
          >
            <div className="font-display text-3xl md:text-4xl text-[#ffd34d] [text-shadow:0_0_20px_rgba(255,211,77,0.4)]">
              {String(climbing).padStart(2, '0')}
            </div>
            <div className="text-left">
              <div className="font-mono text-[11px] tracking-[0.25em] text-[#eef0f6]">STANDS BOOKED</div>
              <div className="font-mono text-[10px] tracking-[0.15em] text-[#8d90a3]">
                {isNew ? <span className="text-[#52e0a4]">+1 · QUEUE MOVING</span> : 'QUEUE SELF-ASSEMBLING'}
              </div>
            </div>
          </motion.div>

          {/* Countdown — runs on your own clock */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="mt-9"
          >
            <div className="mb-4 inline-flex items-center gap-2">
              <span className="comic-chip border border-[#ffc53d]/60 px-3 py-1 text-[10px] text-[#ffd34d]">T-MINUS</span>
              <span className="font-mono text-[11px] tracking-[0.4em] text-[#989bb0]">UNTIL DOORS</span>
            </div>
            <div className="flex items-center justify-center gap-2.5 lg:justify-start sm:gap-3">
              {units.map((u) => (
                <div key={u.label} className="flex flex-col items-center gap-1.5">
                  <div
                    className="relative w-16 sm:w-20 border border-[#2b2d36] bg-[#0d0e12] px-2 py-3 sm:py-4"
                    style={{ boxShadow: 'inset 0 0 22px rgba(0,0,0,0.8)', color: u.accent }}
                  >
                    <span className="font-display text-xl sm:text-2xl md:text-3xl text-[#eef0f6]">
                      {PAD(t[u.key])}
                    </span>
                    <span className="pointer-events-none absolute inset-0 scanline" />
                    <span className="absolute right-1.5 top-1 text-[8px] leading-none text-[#ffd34d]">▮</span>
                  </div>
                  <span className="font-mono text-[9px] tracking-[0.25em] text-[#8d90a3] sm:text-[10px]">{u.label}</span>
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
            <a href="#register" className="btn-neon pulse-ring w-full sm:w-auto">// Join the Night</a>
            <a href="#domains" className="btn-ghost w-full sm:w-auto">Scope the Night</a>
          </motion.div>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#989bb0] lg:justify-start">
            <span className="comic-chip border border-[#2b2d36] bg-[#0e0e11] px-3 py-1 text-[#eef0f6]"><span className="text-[#ffd34d]">■</span>{EVENT.duration}</span>
            <span className="comic-chip border border-[#2b2d36] bg-[#0e0e11] px-3 py-1 text-[#eef0f6]"><span className="text-[#ffc53d]">◉</span>{EVENT.demoTime}</span>
            <span className="comic-chip border border-[#2b2d36] bg-[#0e0e11] px-3 py-1 text-[#eef0f6]"><span className="text-[#ffc53d]">◈</span>{EVENT.teamSize}</span>
          </div>
        </div>

        {/* Right — the hub */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.9 }}
          className="relative hidden lg:block"
        >
          <div className="relative mx-auto flex h-[520px] w-full max-w-md flex-col items-center justify-center">
            {/* DC signal disc */}
            <div className="relative flex h-72 w-72 items-center justify-center">
              <div
                className="absolute inset-0 rounded-full opacity-20"
                style={{ background: 'radial-gradient(circle, rgba(255,211,77,0.4) 0%, rgba(255,211,77,0.04) 55%, transparent 72%)' }}
              />
              <div
                className="absolute inset-3 float-y rounded-full border-[4px] border-[#0b0c10] bg-[#ffc53d]"
                style={{ '--tilt': '-3deg', animationDuration: '16s', boxShadow: '0 0 0 2px rgba(255,197,61,0.35), 0 0 70px rgba(255,197,61,0.4), inset 0 -10px 20px rgba(0,0,0,0.3)' }}
              />
              <div
                className="absolute inset-8 float-y rounded-full border-[4px] border-[#0b0c10] bg-[#0d0e13]"
                style={{ '--tilt': '3deg', animationDelay: '1.1s', boxShadow: '0 0 0 2px rgba(255,197,61,0.12), inset 0 0 40px rgba(255,197,61,0.2)' }}
              />
              <div className="relative flex flex-col items-center justify-center">
                <div className="dc-bullet h-20 w-36 text-5xl">DC</div>
                <span className="mt-5 font-mono text-[10px] tracking-[0.5em] text-[#ffd34d]">REVERSE HACKATHON</span>
              </div>
            </div>

            {/* Task pills — the live queue */}
            <div className="absolute inset-0 flex flex-col justify-center gap-2">
              {PILLS.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -18 : 18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4 + i * 0.18 }}
                  className="flex w-fit items-center gap-3 border border-[#26272e] bg-[#0e0e11]/90 px-4 py-2"
                  style={{ alignSelf: i % 2 === 0 ? 'flex-start' : 'flex-end' }}
                >
                  <span className="font-mono text-[9px] tracking-[0.2em] text-[#0b0b0d]" style={{ background: p.color, padding: '2px 6px' }}>
                    {p.tag}
                  </span>
                  <span className="font-mono text-[11px] tracking-[0.08em] text-[#c9cbd8]">{p.title}</span>
                </motion.div>
              ))}
            </div>

            {/* floating mono badges */}
            <div className="comic-card absolute left-0 top-4 flex items-center gap-3 px-4 py-2.5 float-y" style={{ '--tilt': '0deg' }}>
              <span className="font-mono text-[9px] tracking-[0.3em] text-[#8d90a3]">RUNTIME</span>
              <span className="font-display text-2xl text-[#ffd34d]">3 HRS</span>
            </div>
            <div className="comic-card absolute right-0 bottom-16 flex items-center gap-3 px-4 py-2.5 float-y" style={{ '--tilt': '0deg', animationDelay: '1.2s' }}>
              <span className="font-mono text-[9px] tracking-[0.3em] text-[#8d90a3]">FORMAT</span>
              <span className="font-display text-xl text-[#4f8cff]">SOLO·DUO</span>
            </div>
            <div className="comic-card absolute left-4 bottom-4 flex items-center gap-2.5 border-l-2 px-4 py-2.5">
              <span className="h-1.5 w-1.5 animate-pulse bg-[#52e0a4]" />
              <span className="font-mono text-xs tracking-[0.12em] text-[#eef0f6]">5-MIN SHOWCASE / POD</span>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Domain ticker row — the log */}
      <div className="relative z-10 border-y border-[#26272e] bg-[#0d0e11] py-3 overflow-hidden">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5">
          <span className="comic-chip border border-[#ffc53d]/60 px-3 py-1 text-[9px] text-[#ffd34d]">LOG · FEED</span>
          {HERO_DOMAINS.map((d, i) => (
            <span key={d.id} className="flex items-center gap-2 font-mono text-xs text-[#989bb0]">
              <span className="text-[#ffc53d]">{PAD(21 + i)}</span>
              <span className="text-[#8d90a3]">·</span>
              <span>{d.icon}</span>
              <span>{d.title} uplink</span>
            </span>
          ))}
          <a href="#domains" className="font-mono text-xs text-[#ffd34d] hover:text-[#fffdf6] transition-colors">+10 MORE →</a>
        </div>
      </div>
    </section>
  );
}