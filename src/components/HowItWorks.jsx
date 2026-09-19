import { motion } from 'framer-motion';

const STEPS = [
  {
    n: '01',
    time: '21:00',
    status: 'QUEUED',
    color: '#4f8cff',
    title: 'Pick Your Battlefield',
    desc: 'Choose one of the 15 cyber domains that fits your rank. Every domain links to live training platforms so you can sharpen first.',
    icon: '⌖',
  },
  {
    n: '02',
    time: '21:12',
    status: 'AUTO',
    color: '#ffc53d',
    title: 'Enlist Solo or as a Duo',
    desc: 'Fly solo, or pair up with one partner. Lock your registration ID with your roll number and year (I/II/III) — it is your key at check-in.',
    icon: '⚡',
  },
  {
    n: '03',
    time: '23:57',
    status: 'RUNS UNATTENDED',
    color: '#52e0a4',
    title: 'Hunt, Reverse & Exploit',
    desc: 'On event day you get 3 hours flat to attack live targets, reverse binaries, and burn CTF flags in your chosen domain.',
    icon: '⛨',
  },
  {
    n: '04',
    time: '04:30',
    status: 'NEEDS YOU',
    color: '#ff8a3d',
    title: 'Showcase — 5 Minutes',
    desc: 'Every solo or pod explains what they did in a 5-minute live showcase to the judges. Fastest runs and cleanest exploits top the leaderboard.',
    icon: '♛',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-24 md:py-32 px-5 bg-[#0b0b0d]">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-20" />
      <div className="mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end mb-16 md:mb-20"
        >
          <div>
            <div className="comic-chip border border-[#ffc53d]/60 px-3 py-1 text-[10px] text-[#ffd34d] mb-5">&lt;QUEUE.SELF-ASSEMBLIES /&gt;</div>
            <h2 className="font-display text-2xl md:text-4xl font-bold text-[#eef0f6]">
              THE QUEUE <span className="text-gradient">ASSEMBLES</span> ITSELF
            </h2>
          </div>
          <p className="font-mono text-sm md:text-base text-[#989bb0] md:text-right md:pb-1.5">
            nothing here is a summary. four jobs are queued overnight, each attributed to a shift you signed up for.
          </p>
        </motion.div>

        {/* Night timeline */}
        <div className="relative">
          <div className="pointer-events-none absolute left-[18px] top-2 bottom-2 w-px bg-[#26272e] md:left-1/2" />
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: i * 0.08 }}
              className="relative mb-8 md:mb-10"
            >
              <div
                className="absolute left-[18px] top-2 h-3 w-3 -translate-x-1/2 border"
                style={{ background: s.color, borderColor: '#0b0b0d', boxShadow: `0 0 14px ${s.color}` }}
              />
              <div className={`flex md:items-center gap-5 pl-10 ${i % 2 === 1 ? 'md:justify-end md:pl-0' : ''}`}>
                <div
                  className={`glass-card relative w-full overflow-hidden px-5 py-5 ${i % 2 === 1 ? 'md:max-w-[46%] md:text-right' : 'md:max-w-[46%]'}`}
                  style={{ borderLeft: `2px solid ${s.color}` }}
                >
                  <div className="mb-3 flex flex-wrap items-center gap-3 md:justify-start">
                    <span className="font-mono text-sm text-[#ffd34d] tracking-[0.2em]">{s.time}</span>
                    <span className="font-mono text-[9px] tracking-[0.22em] px-2 py-0.5" style={{ background: s.color, color: '#0b0b0d' }}>
                      {s.status}
                    </span>
                    <span className="font-mono text-[9px] tracking-[0.2em] text-[#8d90a3]">run #{s.n}</span>
                  </div>
                  <div className="mb-2 flex items-center gap-3">
                    <span className="text-xl" style={{ color: s.color }}>{s.icon}</span>
                    <h3 className="font-display text-base md:text-lg font-bold tracking-wide text-[#eef0f6]">{s.title}</h3>
                  </div>
                  <p className="text-sm leading-relaxed text-[#c9cbd8]">{s.desc}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* After the night */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          className="mt-12 border border-[#26272e] bg-[#0d0e11] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div className="font-mono text-xs tracking-[0.18em] text-[#989bb0]">
            <span className="text-[#52e0a4]">07:00</span>&nbsp;· NIGHT OVER — LOGS FILED, LEADERBOARD COLD, DEP-CYS TAKES THE MORNING.
          </div>
          <a href="#register" className="btn-neon text-xs px-5 py-2.5 shrink-0">Join the Night</a>
        </motion.div>
      </div>
    </section>
  );
}