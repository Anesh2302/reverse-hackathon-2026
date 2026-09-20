import { motion } from 'framer-motion';

const FEATURES = [
  {
    n: '01',
    tag: 'CONSENSUS',
    title: 'Every flag, one defensible answer.',
    desc: 'No single view is trusted alone. Judges challenge, refine and cryptographically sign every flag before your pod advances.',
    accent: '#C75C35',
    icon: '⚖',
  },
  {
    n: '02',
    tag: 'EDGE',
    title: 'Fast where the targets are.',
    desc: 'Workloads route automatically to the nearest healthy domain bus — reversing, forensics, web, pwn — no hand-offs, no lag.',
    accent: '#D9261E',
    icon: '◎',
  },
  {
    n: '03',
    tag: 'DEVELOPER FIRST',
    title: 'Three lines from intent to runtime.',
    desc: 'Pick a domain, pick a pod, deploy. The gate signs you in and the chamber opens on the countdown.',
    accent: '#D9261E',
    icon: '⧉',
    code: true,
  },
  {
    n: '04',
    tag: 'ENCLAVES',
    title: 'Your panel never leaves the hub.',
    desc: 'Roll number and registration ID are hardware-isolated. Zero retention between scores — per-pod proof, nothing else.',
    accent: '#8A4A28',
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
    <section id="how" className="relative py-24 md:py-32 px-5 bg-[#060606]">
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
            <div className="inline-flex items-center gap-2 rounded-none border border-[#111E34] bg-[#0A0203] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.3em] text-[#1A0A0A] shadow-sm mb-5">[03] // HOW IT WORKS</div>
            <h2 className="font-display text-2xl md:text-4xl font-bold uppercase text-[#1A0A0A] leading-tight">
              BUILT FOR THE GAP BETWEEN <span className="text-[#1A0A0A]">DEMO AND PRODUCTION.</span>
            </h2>
          </div>
          <p className="font-mono text-sm md:text-base text-[#7A686B] md:pb-1.5 md:text-right">
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
              className="relative rounded-none border border-[#111E34] bg-[#0A1220] p-7"
              style={{ boxShadow: '0 8px 22px rgba(0,0,0,0.45), inset 0 0 22px rgba(0,0,0,0.25)' }}
            >
              <span className="absolute left-0 top-0 h-full w-[2px]" style={{ background: f.accent }} />
              <div className="mb-6 flex items-center justify-between">
                <span className="font-mono text-xs tracking-[0.3em]" style={{ color: f.accent }}>
                  {f.n} <span className="text-[#7A686B]">/</span> {f.tag}
                </span>
                <span className="text-xl" style={{ color: f.accent }}>{f.icon}</span>
              </div>
              <h3 className="mb-3 font-display text-lg md:text-xl font-bold uppercase text-[#1A0A0A] leading-snug">{f.title}</h3>

              {f.code ? (
                <pre className="mt-4 overflow-x-auto rounded-none border border-[#111E34] bg-[#060606] p-4 font-mono text-[12px] leading-6 text-[#1A0A0A]">
                  <code>
                    {SNIPPET.split('\n').map((ln, j) => (
                      <span key={j} className="block whitespace-pre">
                        <span className="select-none text-[#4A3D3F]">{String(i + 1).padStart(2, '0')}</span>{' '}
                        <span className={ln.startsWith('  pod') ? 'text-[#1C0A0A]' : ln.includes('//') ? 'text-[#1A0A0A]' : ''}>{ln}</span>
                      </span>
                    ))}
                  </code>
                </pre>
              ) : (
                <p className="text-sm leading-relaxed text-[#7A686B]">{f.desc}</p>
              )}
            </motion.div>
          ))}
        </div>

        {/* After the night */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          className="mt-10 rounded-none border border-[#111E34] bg-[#0A1220] px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-[0_6px_18px_rgba(0,0,0,0.45)]"
        >
          <div className="font-mono text-xs tracking-[0.18em] text-[#7A686B]">
            <span className="text-[#1A0A0A]">07:00</span>&nbsp;· LEDGER CLOSED, BOARD VERIFIED, FLAGS SEALED.
          </div>
          <a href="#register" className="inline-flex items-center justify-center rounded-none bg-[#D9261E] px-5 py-2.5 font-mono text-xs font-bold tracking-wide uppercase text-[#1A0A0A] transition-colors hover:bg-[#D9261E] shrink-0">Deploy Your Stand</a>
        </motion.div>
      </div>
    </section>
  );
}