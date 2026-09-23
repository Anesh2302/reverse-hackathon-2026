import { motion } from 'framer-motion';
import Reveal from './Reveal';
import ArtImage from './ArtImage';
import { ART } from '../data/art';

const PILLARS = [
  { code: '01', icon: '🔍', title: 'Reverse', desc: 'Decompile, decrypt, deconstruct. Understand what machines really do behind the screen.', color: '#DA2B36', glow: '#DA2B3640' },
  { code: '02', icon: '💥', title: 'Exploit', desc: 'Chain the vulnerabilities you found into real, working attacks against our live targets.', color: '#1A56DB', glow: '#1A56DB40' },
  { code: '03', icon: '🛡️', title: 'Defend', desc: 'Flip perspectives — patch, harden and defend a live infrastructure from a team of attackers.', color: '#EEC470', glow: '#EEC47040' },
];

const ELIGIBLE = [
  { year: 'I', label: 'First Year', note: 'Fresh recruits. Bring curiosity.', color: '#DA2B36' },
  { year: 'II', label: 'Second Year', note: 'Sharpening. Bring skills.', color: '#1A56DB' },
  { year: 'III', label: 'Third Year', note: 'The vanguard. Bring dominance.', color: '#EEC470' },
];

export default function About() {
  return (
    <section id="about" className="relative py-24 md:py-32 px-5 glass-section overflow-hidden">
      {/* Command-center wide art — hidden until generated */}
      <div className="pointer-events-none absolute inset-0">
        <ArtImage src={ART.aboutBg.src} alt={ART.aboutBg.alt} opacity={0.28} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#040D1F] via-transparent to-[#040D1F]" />
      </div>
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-[radial-gradient(circle,rgba(218,43,54,0.06)_0%,transparent_70%)]" />
        <div className="absolute inset-0 grid-overlay opacity-[0.03]" />
      </div>

      <div className="mx-auto max-w-7xl relative z-10">
        {/* Header */}
        <Reveal>
          <div className="text-center mb-16 md:mb-20">
            <div className="inline-flex items-center gap-2 border border-[#1A3A6E] bg-[rgba(14,36,72,0.5)] backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1A56DB] animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#8CA7CC] uppercase">[02] // ABOUT</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase text-[#DFECF4] leading-tight">
              A HACKATHON THAT<br />
              <span className="hero-gradient">FLIPS THE SCRIPT</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto font-mono text-sm text-[#8CA7CC]">
              most runtimes ship apps. this one ships <span className="text-[#DFECF4]">cracked targets</span> — 3-hour sprint,
              5-minute showcase, then you rebuild them stronger.
            </p>
          </div>
        </Reveal>

        {/* Pillars */}
        <div className="grid md:grid-cols-3 gap-5 mb-16">
          {PILLARS.map((p, i) => (
            <Reveal key={p.code} delay={i * 0.15}>
              <div className="group relative overflow-hidden rounded-xl glass-card p-7 transition-all duration-500"
              >
                {/* Top gradient line */}
                <span className="absolute inset-x-0 top-0 h-[2px] transition-all duration-500 group-hover:h-[3px]"
                  style={{ background: `linear-gradient(90deg, transparent, ${p.color}, transparent)` }}
                />

                {/* Glow on hover */}
                <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: `radial-gradient(ellipse at top, ${p.glow}, transparent 70%)` }}
                />

                <div className="relative flex items-center justify-between mb-6">
                  <div className="flex h-14 w-14 items-center justify-center rounded-xl text-2xl transition-transform duration-300 group-hover:scale-110"
                    style={{ background: `linear-gradient(135deg, ${p.color}20, ${p.color}08)`, border: `1px solid ${p.color}30` }}
                  >
                    {p.icon}
                  </div>
                  <span className="font-display text-5xl font-black opacity-15 group-hover:opacity-25 transition-opacity duration-300" style={{ color: p.color }}>
                    {p.code}
                  </span>
                </div>

                <h3 className="relative font-display text-xl font-bold uppercase text-[#DFECF4] tracking-wide mb-3 group-hover:text-white transition-colors">{p.title}</h3>
                <p className="relative text-sm leading-relaxed text-[#8CA7CC]">{p.desc}</p>

                {/* Bottom glow dot */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 h-1 w-12 rounded-full opacity-0 group-hover:opacity-50 transition-opacity duration-500" style={{ background: p.color, filter: 'blur(4px)' }} />
              </div>
            </Reveal>
          ))}
        </div>

        {/* Eligibility */}
        <Reveal delay={0.2}>
          <div className="relative overflow-hidden rounded-xl glass-card">
            <div className="grid lg:grid-cols-[auto_1fr] items-stretch">
              {/* Left */}
              <div className="relative flex flex-col justify-center gap-3 border-b border-[#1A3A6E] p-8 lg:border-b-0 lg:border-r lg:min-w-[320px]">
                <div className="absolute inset-0 bg-[radial-gradient(ellipse at left,rgba(26,86,219,0.06)_0%,transparent_60%)]" />
                <div className="relative font-mono text-xs tracking-[0.4em] text-[#8CA7CC]">// ACCESS CONTROL</div>
                <h3 className="relative font-display text-2xl font-bold uppercase text-[#DFECF4] leading-snug">
                  STRICTLY FOR<br />
                  <span className="hero-gradient">REVERSE HACKATHON</span>
                </h3>
                <p className="relative text-sm text-[#8CA7CC]">
                  Open to all students. All three years — your time to prove yourselves.
                </p>
              </div>

              {/* Right - Year cards */}
              <div className="grid sm:grid-cols-3">
                {ELIGIBLE.map((e, i) => (
                  <div
                    key={e.year}
                    className={`group flex flex-col items-center justify-center gap-3 px-6 py-10 text-center transition-all duration-300 hover:bg-[rgba(26,58,110,0.2)] ${i > 0 ? 'sm:border-l sm:border-[#1A3A6E]' : ''} ${i === 2 ? '' : 'border-b sm:border-b-0 border-[#1A3A6E]'}`}
                  >
                    <div className="font-display text-6xl font-black transition-all duration-300 group-hover:scale-110" style={{ color: e.color, textShadow: `0 0 30px ${e.color}30` }}>
                      {e.year}
                    </div>
                    <div className="font-mono text-sm tracking-widest text-[#DFECF4]">{e.label}</div>
                    <div className="text-xs text-[#8CA7CC]">{e.note}</div>
                    <div className="h-0.5 w-0 group-hover:w-12 transition-all duration-500 rounded-full" style={{ background: e.color }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
