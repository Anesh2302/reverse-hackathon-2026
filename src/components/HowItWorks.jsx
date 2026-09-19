import { motion } from 'framer-motion';

const FEATURES = [
  {
    n: '01',
    tag: 'CONSENSUS',
    title: 'Every flag, one defensible answer.',
    desc: 'No single view is trusted alone. Judges challenge, refine and cryptographically sign every flag before your pod advances.',
    accent: '#bd7a00',
    icon: '⚖',
  },
  {
    n: '02',
    tag: 'EDGE',
    title: 'Fast where the targets are.',
    desc: 'Workloads route automatically to the nearest healthy domain bus — reversing, forensics, web, pwn — no hand-offs, no lag.',
    accent: '#3f6376',
    icon: '◎',
  },
  {
    n: '03',
    tag: 'DEVELOPER FIRST',
    title: 'Three lines from intent to runtime.',
    desc: 'Pick a domain, pick a pod, deploy. The gate signs you in and the chamber opens on the countdown.',
    accent: '#5b8f6f',
    icon: '⧉',
    code: true,
  },
  {
    n: '04',
    tag: 'ENCLAVES',
    title: 'Your panel never leaves the hub.',
    desc: 'Roll number and registration ID are hardware-isolated. Zero retention between scores — per-pod proof, nothing else.',
    accent: '#a35c00',
    icon: '⬢',
  },
];

const SNIPPET = `const pod = await Revhack.deploy({
  domain: "reversing",
  pod:    "solo"   // or "duo"
})
pod.id  // REV26-0A1F
pod.note // "signed at the gate"`;

export default function HowItWorks() {
  return (
    <section id="how" className="relative py-24 md:py-32 px-5 bg-[#f5f1e6]">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-[0.06]" />
      <div className="mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end mb-16 md:mb-20"
        >
          <div>
            <div className="inline-flex items-center gap-2 rounded-md border border-[#e0d5b4] bg-[#fbf7ee] px-3 py-1 font-mono text-[10px] tracking-[0.2em] text-[#a35c00] shadow-sm mb-5">&lt;RUNTIME.CORE /&gt;</div>
            <h2 className="font-display text-2xl md:text-4xl font-bold text-[#16171c] leading-tight">
              BUILT FOR THE GAP BETWEEN <span className="text-[#a35c00]">DEMO AND PRODUCTION.</span>
            </h2>
          </div>
          <p className="font-mono text-sm md:text-base text-[#bdb091] md:pb-1.5 md:text-right">
            from intention to a signed leaderboard entry in three lines. no crafts, no stories — a runtime.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-4 md:gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: i * 0.08 }}
              className="relative rounded-lg border border-[#e0d5b4] bg-[#fbf7ee] p-7"
              style={{ boxShadow: '0 8px 22px rgba(90,60,0,0.08), inset 0 0 22px rgba(179,113,0,0.05)' }}
            >
              <span className="absolute left-0 top-0 h-full w-[2px]" style={{ background: f.accent }} />
              <div className="mb-6 flex items-center justify-between">
                <span className="font-mono text-xs tracking-[0.3em]" style={{ color: f.accent }}>
                  {f.n} <span className="text-[#8a7a4a]">/</span> {f.tag}
                </span>
                <span className="text-xl" style={{ color: f.accent }}>{f.icon}</span>
              </div>
              <h3 className="mb-3 font-display text-lg md:text-xl font-bold text-[#16171c] leading-snug">{f.title}</h3>

              {f.code ? (
                <pre className="mt-4 overflow-x-auto rounded-md border border-[#e0d5b4] bg-[#efe9d8] p-4 font-mono text-[12px] leading-6 text-[#4a4639]">
                  <code>
                    {SNIPPET.split('\n').map((ln, j) => (
                      <span key={j} className="block whitespace-pre">
                        <span className="select-none text-[#8a7a4a]">{String(i + 1).padStart(2, '0')}</span>{' '}
                        <span className={ln.includes('//') ? 'text-[#8a7a4a]' : ln.startsWith('  pod') ? 'text-[#5b8f6f]' : ''}>{ln}</span>
                      </span>
                    ))}
                  </code>
                </pre>
              ) : (
                <p className="text-sm leading-relaxed text-[#4a4639]">{f.desc}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* After the night */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          className="mt-10 rounded-lg border border-[#e0d5b4] bg-[#fbf7ee] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_6px_18px_rgba(90,60,0,0.08)]"
        >
          <div className="font-mono text-xs tracking-[0.18em] text-[#8a7a4a]">
            <span className="text-[#5b8f6f]">07:00</span>&nbsp;· NIGHT OVER — LEDGER CLOSED, BOARD VERIFIED, DEP-CYS TAKES THE MORNING.
          </div>
          <a href="#register" className="inline-flex items-center justify-center rounded-md bg-[#16171c] px-5 py-2.5 font-mono text-xs font-bold tracking-wide text-[#f5f1e6] transition-colors hover:bg-[#2a2b30] shrink-0">Deploy Your Stand</a>
        </motion.div>
      </div>
    </section>
  );
}