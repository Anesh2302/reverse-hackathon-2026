import { motion } from 'framer-motion';
import Reveal from './Reveal';
import ArtImage from './ArtImage';
import { ART } from '../data/art';

const FEATURES = [
  {
    n: '01',
    tag: 'CONSENSUS',
    title: 'Every flag, one defensible answer.',
    desc: 'No single view is trusted alone. Judges challenge, refine and cryptographically sign every flag before your pod advances.',
    color: '#DA2B36',
    icon: '⚖',
  },
  {
    n: '02',
    tag: 'EDGE',
    title: 'Fast where the targets are.',
    desc: 'Workloads route automatically to the nearest healthy domain bus — reversing, forensics, web, pwn — no hand-offs, no lag.',
    color: '#1A56DB',
    icon: '◎',
  },
  {
    n: '03',
    tag: 'DEVELOPER FIRST',
    title: 'Three lines from intent to runtime.',
    desc: 'Pick a domain, pick a pod, deploy. The gate signs you in and the chamber opens on the countdown.',
    color: '#EEC470',
    icon: '⧉',
    code: true,
  },
  {
    n: '04',
    tag: 'ENCLAVES',
    title: 'Your panel never leaves the hub.',
    desc: 'Roll number and registration ID are hardware-isolated. Zero retention between scores — per-pod proof, nothing else.',
    color: '#DA2B36',
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
    <section id="how" className="relative py-24 md:py-32 px-5 glass-section overflow-hidden">
      {/* Training-grounds art — hidden until generated */}
      <div className="pointer-events-none absolute inset-0">
        <ArtImage src={ART.trainingBg.src} alt={ART.trainingBg.alt} opacity={0.25} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040D1F] via-transparent to-[#040D1F]" />
      </div>
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/3 left-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(26,86,219,0.06)_0%,transparent_70%)]" />
        <div className="absolute inset-0 grid-overlay opacity-[0.03]" />
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 border border-[#1A3A6E] bg-[rgba(14,36,72,0.5)] backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EEC470] animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#8CA7CC] uppercase">[03] // HOW IT WORKS</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase text-[#DFECF4] leading-tight">
              BUILT FOR THE GAP BETWEEN <span className="hero-gradient">DEMO AND PRODUCTION.</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto font-mono text-sm text-[#8CA7CC]">
              from intention to a signed leaderboard entry in three lines. no crafts, no stories — a runtime.
            </p>
          </div>
        </Reveal>

        {/* Feature cards with timeline */}
        <div className="relative">
          {/* Vertical timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-[2px] bg-gradient-to-b from-[#DA2B36] via-[#1A56DB] to-[#EEC470] opacity-30 hidden md:block" />

          <div className="grid md:grid-cols-2 gap-5 md:gap-6">
            {FEATURES.map((f, i) => (
              <Reveal key={f.n} delay={i * 0.15}>
                <div className="group relative rounded-xl glass-card p-7 transition-all duration-500"
                >
                  {/* Left accent line */}
                  <span className="absolute left-0 top-0 h-full w-[2px] rounded-l-xl transition-all duration-500 group-hover:w-[3px]" style={{ background: f.color }} />

                  {/* Timeline dot */}
                  <div className="absolute -left-[7px] top-8 w-4 h-4 rounded-full border-2 hidden md:block" style={{ borderColor: f.color, background: '#061228' }}>
                    <div className="absolute inset-1 rounded-full" style={{ background: f.color, opacity: 0.6 }} />
                  </div>

                  {/* Header */}
                  <div className="mb-5 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="flex h-10 w-10 items-center justify-center rounded-lg text-lg transition-transform duration-300 group-hover:scale-110"
                        style={{ background: `${f.color}15`, border: `1px solid ${f.color}30`, color: f.color }}
                      >
                        {f.icon}
                      </span>
                      <span className="font-mono text-xs tracking-[0.3em] text-[#8CA7CC]">
                        <span style={{ color: f.color }}>{f.n}</span> / {f.tag}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="mb-3 font-display text-lg md:text-xl font-bold uppercase text-[#DFECF4] leading-snug group-hover:text-white transition-colors">{f.title}</h3>

                  {f.code ? (
                    <pre className="mt-4 overflow-x-auto rounded-lg border border-[#1A3A6E] bg-[#061228]/80 p-4 font-mono text-[12px] leading-6 text-[#DFECF4]">
                      <code>
                        {SNIPPET.split('\n').map((ln, j) => (
                          <span key={j} className="block whitespace-pre">
                            <span className="select-none text-[#5A6A8A]">{String(j + 1).padStart(2, '0')}</span>{' '}
                            <span className={ln.includes('//') ? 'text-[#8CA7CC]' : ''}>{ln}</span>
                          </span>
                        ))}
                      </code>
                    </pre>
                  ) : (
                    <p className="text-sm leading-relaxed text-[#8CA7CC]">{f.desc}</p>
                  )}

                  {/* Bottom glow */}
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 h-1 w-12 rounded-full opacity-0 group-hover:opacity-40 transition-opacity duration-500" style={{ background: f.color, filter: 'blur(4px)' }} />
                </div>
              </Reveal>
            ))}
          </div>
        </div>

        {/* Bottom bar */}
        <Reveal delay={0.3}>
          <div className="mt-10 rounded-xl glass-card px-6 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="h-2 w-2 rounded-full bg-[#EEC470] animate-pulse" />
              <span className="font-mono text-xs tracking-[0.18em] text-[#8CA7CC]">
                <span className="text-[#DFECF4] font-bold">07:00</span> · LEDGER CLOSED, BOARD VERIFIED, FLAGS SEALED.
              </span>
            </div>
            <a href="#register" className="btn-neon text-xs py-2 px-5">
              Deploy Your Stand
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
