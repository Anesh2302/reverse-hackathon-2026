import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { EVENT, DOMAINS } from '../data/domains';

function useCountdown(target) {
  const compute = () => {
    const diff = Math.max(0, new Date(target).getTime() - Date.now());
    return {
      days: Math.floor(diff / 86400000),
      hours: Math.floor((diff / 3600000) % 24),
      mins: Math.floor((diff / 60000) % 60),
      secs: Math.floor((diff / 1000) % 60),
    };
  };
  const [t, setT] = useState(compute);
  useEffect(() => {
    const id = setInterval(() => setT(compute()), 1000);
    return () => clearInterval(id);
  }, []);
  return t;
}

const PAD = (n) => String(n).padStart(2, '0');

const HERO_DOMAINS = DOMAINS.slice(0, 5);

export default function Hero() {
  const t = useCountdown(EVENT.date);
  const units = useMemo(
    () => [
      { label: 'Days', value: PAD(t.days), accent: '#e03131' },
      { label: 'Hours', value: PAD(t.hours), accent: '#3b82f6' },
      { label: 'Min', value: PAD(t.mins), accent: '#e09c08' },
      { label: 'Sec', value: PAD(t.secs), accent: '#ff5c52' },
    ],
    [t]
  );

  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] flex-col overflow-hidden"
    >
      {/* Ambient gradient background (no WebGL) */}
      <div className="pointer-events-none absolute inset-0 bg-[#f1f5fc]">
        <div className="absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full opacity-25 blur-[120px]" style={{ background: 'radial-gradient(circle, #e03131 0%, transparent 60%)' }} />
        <div className="absolute top-24 right-[-180px] h-[560px] w-[560px] rounded-full opacity-25 blur-[120px]" style={{ background: 'radial-gradient(circle, #3b82f6 0%, transparent 60%)' }} />
        <div className="absolute bottom-[-160px] left-1/3 h-[480px] w-[480px] rounded-full opacity-20 blur-[130px]" style={{ background: 'radial-gradient(circle, #e09c08 0%, transparent 60%)' }} />
        <div className="absolute inset-0 grid-overlay opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#e9eef7]" />
      </div>

      <div className="relative z-10 mx-auto grid w-full max-w-7xl flex-1 grid-cols-1 gap-12 px-5 pt-32 pb-16 lg:grid-cols-[1.15fr_0.85fr] lg:items-center md:px-8">
        {/* Left — editorial */}
        <div className="text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            className="mb-6 inline-flex flex-wrap items-center justify-center gap-3 lg:justify-start"
          >
            <span className="glass inline-flex items-center gap-2 px-4 py-1.5 font-mono text-[11px] tracking-[0.35em] text-[#e03131]">
              <span className="h-2 w-2 rounded-full bg-[#e03131] animate-pulse" />
              DEP-CYS PRESENTS
            </span>
            <span className="inline-block rounded-full border border-[#cfd9ea] bg-[#eef2fa] px-4 py-1.5 font-mono text-[11px] tracking-[0.25em] text-[#43536e]">
              YEAR I · II · III
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 26 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.85, duration: 0.8 }}
            className="font-display font-black leading-[0.95] tracking-tight"
          >
            <span className="block text-[clamp(2.6rem,7vw,5.4rem)] text-[#43536e]">
              {EVENT.dateLabel}
            </span>
            <span className="mt-2 block text-[clamp(3rem,9vw,7rem)] text-[#0c1a33]">
              REVERSE<span className="cursor-blink text-[#e03131]">_</span>
            </span>
            <span className="block text-[clamp(3.6rem,11vw,8.5rem)]">
              <span className="text-gradient">HACKATHON</span>
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.15, duration: 0.9 }}
            className="mx-auto mt-7 max-w-xl text-base md:text-lg text-[#43536e] lg:mx-0"
          >
            <span className="font-mono text-[#e03131]">{EVENT.tagline}</span>{' '}
            — {EVENT.description}
          </motion.p>

          {/* Countdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.3 }}
            className="mt-9"
          >
            <div className="mb-3 font-mono text-[10px] tracking-[0.45em] text-[#64748c]">TIME UNTIL DEPLOYMENT</div>
            <div className="flex items-center justify-center gap-2.5 lg:justify-start sm:gap-3">
              {units.map((u) => (
                <div key={u.label} className="flex flex-col items-center gap-1.5">
                  <div className="relative w-16 sm:w-20 rounded-lg border px-2 py-3 backdrop-blur-sm sm:py-4" style={{ borderColor: `${u.accent}40`, background: 'rgba(255,255,255,0.7)' }}>
                    <span className="font-display text-2xl font-bold sm:text-3xl" style={{ color: u.accent, textShadow: `0 0 22px ${u.accent}55` }}>
                      {u.value}
                    </span>
                  </div>
                  <span className="font-mono text-[9px] tracking-[0.3em] text-[#5b6b87] sm:text-[10px]">{u.label}</span>
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
            <a href="#register" className="btn-neon pulse-ring text-center text-sm px-10 w-full sm:w-auto">// Enlist Now</a>
            <a href="#domains" className="btn-ghost text-center text-sm px-10 w-full sm:w-auto">Explore 15 Domains</a>
          </motion.div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-2 font-mono text-[10px] tracking-[0.2em] text-[#64748c] lg:justify-start">
            <span className="flex items-center gap-2 rounded-full border border-[#cfd9ea] bg-[#eef2fa] px-3 py-1 text-[#43536e]"><span className="text-[#e03131]">■</span>{EVENT.duration}</span>
            <span className="flex items-center gap-2 rounded-full border border-[#cfd9ea] bg-[#eef2fa] px-3 py-1 text-[#43536e]"><span className="text-[#ffb020]">◉</span>{EVENT.demoTime}</span>
            <span className="flex items-center gap-2 rounded-full border border-[#cfd9ea] bg-[#eef2fa] px-3 py-1 text-[#43536e]"><span className="text-[#e09c08]">◈</span>{EVENT.teamSize}</span>
          </div>
        </div>

        {/* Right — shield emblem */}
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 24 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.9 }}
          className="relative hidden lg:block"
        >
          <div className="relative mx-auto w-full max-w-md">
            {/* Shield */}
            <div className="relative mx-auto flex h-80 w-80 items-center justify-center">
              <div className="shield float-y absolute inset-4 animate-[spin_40s_linear_infinite] opacity-90" />
              <div className="shield float-y absolute inset-14 opacity-95" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="font-display text-5xl font-black text-white">✭</span>
                <span className="mt-1 font-mono text-[10px] tracking-[0.45em] text-[#ffffff]">REVERSE</span>
              </div>
            </div>

            {/* floating stat cards */}
            <div className="glass float-y absolute -left-8 top-10 rounded-xl px-5 py-3.5">
              <div className="font-mono text-[9px] tracking-[0.3em] text-[#5b6b87]">RUNTIME</div>
              <div className="font-display text-xl font-bold text-[#e03131]">3 HRS</div>
            </div>
            <div className="glass float-y absolute -right-10 bottom-20 rounded-xl px-5 py-3.5" style={{ animationDelay: '1.4s' }}>
              <div className="font-mono text-[9px] tracking-[0.3em] text-[#5b6b87]">FORMAT</div>
              <div className="font-display text-lg font-bold text-[#0c1a33]">SOLO · DUO</div>
            </div>
            <div className="glass absolute -bottom-6 left-10 rounded-xl px-5 py-3.5">
              <div className="flex items-center gap-2.5">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e03131]/15 text-[#e03131]">✭</span>
                <span className="font-mono text-xs tracking-wider text-[#0c1a33]">5-MIN SHOWCASE / POD</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* domain ticker row */}
      <div className="relative z-10 border-t border-[#e3e9f4] bg-[#eaf0fa]/60 py-4 overflow-hidden">
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 px-5">
          <span className="font-mono text-[10px] tracking-[0.35em] text-[#64748c]">FEATURED</span>
          {HERO_DOMAINS.map((d) => (
            <span key={d.id} className="flex items-center gap-2 font-mono text-xs text-[#43536e]">
              <span>{d.icon}</span>
              {d.title}
            </span>
          ))}
          <a href="#domains" className="font-mono text-xs text-[#e03131] hover:text-[#e03131] transition-colors">+ 10 MORE →</a>
        </div>
      </div>
    </section>
  );
}