import Reveal from './Reveal';
import ArtImage from './ArtImage';
import { ART, PANEL_ART } from '../data/art';

const PANEL_LABELS = [
  'CRACKED EARTH',
  'SOLAR DESCENT',
  'REACTOR ONLINE',
  'THE CHAMBER OPENS',
  'FIFTEEN GATES',
  'CHOOSE YOUR FACTION',
  'ENTER THE COMMAND',
  'THE BOARDS BURN',
];

export default function Faceoff() {
  return (
    <section id="faceoff" className="relative py-24 md:py-32 px-5 glass-section overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-[0.03]" />
      <div className="mx-auto max-w-7xl relative z-10">
        <Reveal>
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 border border-[#1A3A6E] bg-[rgba(14,36,72,0.5)] backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#DA2B36] animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#8CA7CC] uppercase">[04] // FACEOFF</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase text-[#DFECF4] leading-tight">
              SOLAR HERO <span className="hero-gradient">VS</span> REACTOR HERO
            </h2>
            <p className="mt-4 max-w-2xl mx-auto font-mono text-sm text-[#8CA7CC]">
              two originals. one runtime. <span className="text-[#DFECF4]">15 domains · one runtime</span>
            </p>
          </div>
        </Reveal>

        {/* 21:9 story banner */}
        <Reveal delay={0.1}>
          <div className="relative overflow-hidden rounded-xl glass-card">
            <div className="relative aspect-[16/9] md:aspect-[21/9] bg-gradient-to-r from-[#1A56DB]/15 via-transparent to-[#DA2B36]/15">
              <ArtImage src={ART.heroStory.src} alt={ART.heroStory.alt} opacity={0.9} className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#061228] via-transparent to-transparent" />
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <span className="inline-block border border-[#1A3A6E] bg-[rgba(6,18,40,0.75)] backdrop-blur-sm px-5 py-2 font-mono text-[10px] md:text-xs tracking-[0.35em] text-[#DFECF4] rounded-md">
                  15 DOMAINS · ONE RUNTIME
                </span>
              </div>
            </div>
          </div>
        </Reveal>

        {/* Portraits vs divider */}
        <div className="mt-6 grid gap-5 md:grid-cols-[1fr_auto_1fr] md:items-stretch">
          {[
            { art: ART.solarPortrait, name: 'SOLAR', sub: 'BLUE-WHITE · DEEP-BLUE SUIT', glow: '#1A56DB' },
            { art: ART.reactorPortrait, name: 'REACTOR', sub: 'RED-GOLD · CYAN CORE', glow: '#DA2B36' },
          ].map((p, i) => (
            <Reveal key={p.name} delay={i * 0.12}>
              <div className="group relative overflow-hidden rounded-xl glass-card">
                <div className="relative aspect-[3/4] max-h-[420px] w-full" style={{ background: `linear-gradient(160deg, ${p.glow}22 0%, transparent 60%)` }}>
                  <ArtImage src={p.art.src} alt={p.art.alt} opacity={0.9} className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061228] via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <div className="font-display text-2xl font-bold uppercase text-[#DFECF4]">{p.name}</div>
                    <div className="mt-1 font-mono text-[10px] tracking-[0.3em] text-[#8CA7CC]">{p.sub}</div>
                  </div>
                </div>
                <span className="absolute inset-x-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${p.glow}, transparent)` }} />
              </div>
            </Reveal>
          ))}
          <div className="hidden md:flex items-center justify-center">
            <div className="burst bg-[#DA2B36] px-8 py-8 font-display text-3xl font-bold text-[#DFECF4] burst-pulse">VS</div>
          </div>
        </div>

        {/* Comic panels — transmission log */}
        <Reveal delay={0.15}>
          <div className="mt-14">
            <div className="mb-5 flex items-center justify-between">
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#8CA7CC]">// TRANSMISSION LOG · 08 PANELS</span>
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#5A6A8A]">SCROLL →</span>
            </div>
            <div className="flex gap-4 overflow-x-auto pb-4 snap-x">
              {PANEL_ART.map((src, i) => (
                <figure key={src} className="group relative shrink-0 w-64 snap-start overflow-hidden rounded-lg glass-card">
                  <div className="relative aspect-[4/3] bg-[#0E2448]">
                    <ArtImage src={src} alt={`Comic panel ${i + 1}: ${PANEL_LABELS[i]}`} opacity={0.9} className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 border-2 border-transparent group-hover:border-[#DA2B36]/50 rounded-lg transition-colors" />
                    <span className="absolute left-3 top-3 bg-[#061228]/85 border border-[#1A3A6E] px-2 py-0.5 font-mono text-[10px] text-[#EEC470] rounded-sm">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                  </div>
                  <figcaption className="border-t border-[#1A3A6E] px-3 py-2.5 font-mono text-[10px] tracking-[0.25em] text-[#8CA7CC]">
                    {PANEL_LABELS[i]}
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
