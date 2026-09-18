import { motion } from 'framer-motion';

const PILLARS = [
  { code: '01', icon: '🔍', title: 'Reverse', desc: 'Decompile, decrypt, deconstruct. Understand what machines really do behind the screen.', grad: 'linear-gradient(135deg, #e03131 0%, #1e63d8 100%)' },
  { code: '02', icon: '💥', title: 'Exploit', desc: 'Chain the vulnerabilities you found into real, working attacks against our live targets.', grad: 'linear-gradient(135deg, #f8b800 0%, #ff5c52 100%)' },
  { code: '03', icon: '🛡️', title: 'Defend', desc: 'Flip perspectives — patch, harden and defend a live infrastructure from a team of attackers.', grad: 'linear-gradient(135deg, #ffd500 0%, #ff5c52 100%)' },
];

const ELIGIBLE = [
  { year: 'I', label: 'First Year', note: 'Fresh recruits. Bring curiosity.', grad: 'linear-gradient(135deg, #e03131 0%, #1e63d8 100%)' },
  { year: 'II', label: 'Second Year', note: 'Sharpening. Bring skills.', grad: 'linear-gradient(135deg, #1e63d8 0%, #f8b800 100%)' },
  { year: 'III', label: 'Third Year', note: 'The vanguard. Bring dominance.', grad: 'linear-gradient(135deg, #f8b800 0%, #ff5c52 100%)' },
];

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 px-5">
      <div className="mx-auto max-w-7xl">
        {/* Editorial split header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end mb-16 md:mb-20"
        >
          <div>
            <div className="comic-chip bg-[#ffd34d] px-3 py-1 text-[10px] text-[#141414] mb-5">&lt;ABOUT.EXE /&gt;</div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#141414] leading-tight">
              A HACKATHON<br />
              <span className="text-gradient">THAT FLIPS THE SCRIPT</span>
            </h2>
          </div>
          <p className="text-base md:text-lg text-[#322c22] md:pb-1.5 md:text-right">
            Most hackathons make you build apps. This one makes you break them — then rebuild them stronger.
            For 3 hours you'll live on the front line of cybersecurity.
          </p>
        </motion.div>

        {/* Pillars — editorial numbered rows */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {PILLARS.map((p, i) => (
            <motion.div
              key={p.code}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ duration: 0.55, delay: i * 0.12 }}
              className="comic-card group relative overflow-hidden rounded-md p-7"
            >
              <div
                className="pointer-events-none absolute inset-x-0 top-0 h-1 opacity-80"
                style={{ background: p.grad }}
              />
              <div
                className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full opacity-0 blur-3xl transition-opacity duration-300 group-hover:opacity-40"
                style={{ background: p.grad }}
              />
              <div className="mb-6 flex items-center justify-between">
                <span
                  className="flex h-12 w-12 items-center justify-center rounded-lg text-xl text-[#ffffff] shadow-lg"
                  style={{ background: p.grad, boxShadow: '0 8px 24px rgba(0,0,0,0.4)' }}
                >
                  {p.icon}
                </span>
                <span
                  className="font-display text-5xl font-black"
                  style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', backgroundImage: p.grad, opacity: 0.9 }}
                >
                  {p.code}
                </span>
              </div>
              <h3 className="font-display text-xl font-bold text-[#141414] tracking-wide mb-2">{p.title}</h3>
              <p className="text-sm leading-relaxed text-[#322c22]">{p.desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Eligibility — hairline-divided cells */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="relative overflow-hidden rounded-xl border border-[#cfc6a9] bg-[#fffdf6]"
        >
          <div className="grid lg:grid-cols-[auto_1fr] items-stretch">
            <div className="relative flex flex-col justify-center gap-3 border-b border-[#cfc6a9] p-7 lg:border-b-0 lg:border-r">
              <div className="font-mono text-xs tracking-[0.4em] text-[#1e63d8]">// ELIGIBILITY CHECK</div>
              <h3 className="font-display text-2xl font-bold text-[#141414] leading-snug">
                STRICTLY FOR<br />
                <span className="text-gradient">DEP-CYS</span>
              </h3>
              <p className="text-sm text-[#322c22]">
                Reserved for Cybersecurity students. All three years — your time to prove yourselves.
              </p>
            </div>

            <div className="grid sm:grid-cols-3">
              {ELIGIBLE.map((e, i) => (
                <motion.div
                  key={e.year}
                  initial={{ opacity: 0, scale: 0.96 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.45, delay: i * 0.1 }}
                  className={`flex flex-col items-center justify-center gap-2 px-6 py-10 text-center ${i > 0 ? 'sm:border-l sm:border-[#cfc6a9]' : ''} ${i === 2 ? '' : 'border-b border-[#cfc6a9] sm:border-b-0'}`}
                >
                  <div className="font-display text-6xl font-black" style={{ WebkitBackgroundClip: 'text', backgroundClip: 'text', color: 'transparent', backgroundImage: e.grad }}>
                    {e.year}
                  </div>
                  <div className="font-mono text-sm tracking-widest text-[#141414]">{e.label}</div>
                  <div className="text-xs text-[#6d6455]">{e.note}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}