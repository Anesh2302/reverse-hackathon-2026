import Reveal from './Reveal';
import ArtImage from './ArtImage';
import { TIMELINE_ART } from '../data/art';

const STEPS = [
  {
    key: 'registration',
    code: 'T-01',
    title: 'REGISTRATION',
    desc: 'Claim your stand. Solo or duo — your signed ID is the key to the arena gates.',
    color: '#EEC470',
  },
  {
    key: 'training',
    code: 'T-02',
    title: 'TRAINING',
    desc: 'Sharpen on live rigs. Recon, exploit, defend, reverse, analyze, research chambers.',
    color: '#1A56DB',
  },
  {
    key: 'chamber',
    code: 'T-03',
    title: 'CHAMBER',
    desc: 'Enter the facility. A 3-hour sprint across edge-routed targets in 15 domains.',
    color: '#DA2B36',
  },
  {
    key: 'showdown',
    code: 'T-04',
    title: 'FINAL SHOWDOWN',
    desc: 'Five minutes on the wire. Signed flags, a verified board, one surviving legend.',
    color: '#DA2B36',
  },
];

export default function EventTimeline() {
  return (
    <section id="timeline" className="relative py-24 md:py-32 px-5 glass-section overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-[0.03]" />
      <div className="mx-auto max-w-7xl relative z-10">
        <Reveal>
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 border border-[#1A3A6E] bg-[rgba(14,36,72,0.5)] backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#EEC470] animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#8CA7CC] uppercase">[10] // RUNBOOK</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase text-[#DFECF4] leading-tight">
              FOUR GATES TO <span className="hero-gradient">THE BOARD</span>
            </h2>
          </div>
        </Reveal>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((s, i) => (
            <Reveal key={s.key} delay={i * 0.1}>
              <article className="group relative overflow-hidden rounded-xl glass-card">
                <div className="relative aspect-[4/3] overflow-hidden border-b border-[#1A3A6E] bg-[#0E2448]">
                  <ArtImage
                    src={TIMELINE_ART[s.key]}
                    alt={`${s.title} chapter art`}
                    opacity={0.9}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061228]/90 via-transparent to-transparent" />
                  <span className="absolute left-3 top-3 bg-[#061228]/85 border border-[#1A3A6E] px-2 py-0.5 font-mono text-[10px] tracking-[0.25em] text-[#EEC470] rounded-sm">
                    {s.code}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="font-display text-lg font-bold uppercase text-[#DFECF4]">{s.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#8CA7CC]">{s.desc}</p>
                </div>
                <span className="absolute inset-x-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${s.color}, transparent)` }} />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
