import { motion } from 'framer-motion';

const STEPS = [
  {
    n: '01',
    title: 'Pick Your Battlefield',
    desc: 'Choose one of the 15 cyber domains that fits your rank. Every domain links to live training platforms so you can sharpen first.',
    grad: 'linear-gradient(135deg, #e03131 0%, #3b82f6 100%)',
    icon: '⌖',
  },
  {
    n: '02',
    title: 'Enlist Solo or as a Duo',
    desc: 'Fly solo, or pair up with one partner. Lock your registration ID with your roll number and year (I/II/III) — it is your key at check-in.',
    grad: 'linear-gradient(135deg, #3b82f6 0%, #e09c08 100%)',
    icon: '⚡',
  },
  {
    n: '03',
    title: 'Hunt, Reverse & Exploit',
    desc: 'On event day you get 3 hours flat to attack live targets, reverse binaries, and burn CTF flags in your chosen domain.',
    grad: 'linear-gradient(135deg, #e09c08 0%, #ff5c52 100%)',
    icon: '⛨',
  },
  {
    n: '04',
    title: 'Showcase — 5 Minutes',
    desc: 'Every solo or pod explains what they did in a 5-minute live showcase to the judges. Fastest runs and cleanest exploits top the leaderboard.',
    grad: 'linear-gradient(135deg, #ffb020 0%, #ff5c52 100%)',
    icon: '♛',
  },
];

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-24 md:py-32 px-5">
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
            <div className="font-mono text-xs tracking-[0.4em] text-[#e03131] mb-4">&lt;PROTOCOL.SEQ /&gt;</div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#0c1a33]">
              HOW THE <span className="text-gradient">OPERATION</span> RUNS
            </h2>
          </div>
          <p className="text-base md:text-lg text-[#43536e] md:text-right md:pb-1.5">
            Four clean steps, 3 hours, and a 5-minute showcase between you and the leaderboard. No filler.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {STEPS.map((s, i) => (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="glass-card group relative overflow-hidden rounded-xl p-7"
            >
              <div className="absolute inset-x-0 top-0 h-1" style={{ background: s.grad }} />
              <div
                className="pointer-events-none absolute -left-10 -bottom-10 h-28 w-28 rounded-full opacity-20 blur-3xl transition-opacity group-hover:opacity-50"
                style={{ background: s.grad }}
              />
              <div className="mb-6 flex items-center justify-between">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-lg text-xl text-[#ffffff]"
                  style={{ background: s.grad, boxShadow: '0 8px 22px rgba(0,0,0,0.45)' }}
                >
                  {s.icon}
                </span>
                <span
                  className="font-display text-5xl font-black"
                  style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', backgroundImage: s.grad, opacity: 0.85 }}
                >
                  {s.n}
                </span>
              </div>
              <h3 className="mb-2 font-display text-lg font-bold tracking-wide text-[#0c1a33]">{s.title}</h3>
              <p className="text-sm leading-relaxed text-[#43536e]">{s.desc}</p>

              {i < STEPS.length - 1 && (
                <span className="absolute -right-2 top-1/2 hidden lg:block -translate-y-1/2 text-[#e03131]/50 text-2xl">▸</span>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}