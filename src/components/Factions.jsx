import Reveal from './Reveal';
import ArtImage from './ArtImage';
import { FACTIONS, DOMAINS } from '../data/domains';
import { FACTION_ART } from '../data/art';
import { FactionEmblem } from './Emblems';

export default function Factions() {
  return (
    <section id="factions" className="relative py-24 md:py-32 px-5 glass-section overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-[0.03]" />
      <div className="mx-auto max-w-7xl relative z-10">
        <Reveal>
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center gap-2 border border-[#1A3A6E] bg-[rgba(14,36,72,0.5)] backdrop-blur-sm px-4 py-2 rounded-full mb-6">
              <span className="h-1.5 w-1.5 rounded-full bg-[#1A56DB] animate-pulse" />
              <span className="font-mono text-[10px] tracking-[0.3em] text-[#8CA7CC] uppercase">[05] // FACTIONS</span>
            </div>
            <h2 className="font-display text-3xl md:text-5xl font-bold uppercase text-[#DFECF4] leading-tight">
              PICK YOUR <span className="hero-gradient">ALLEGIANCE</span>
            </h2>
            <p className="mt-4 max-w-2xl mx-auto font-mono text-sm text-[#8CA7CC]">
              three houses. five domains each. every flag you burn feeds your faction's ledger.
            </p>
          </div>
        </Reveal>

        <div className="grid gap-5 md:grid-cols-3">
          {FACTIONS.map((f, i) => (
            <Reveal key={f.id} delay={i * 0.12}>
              <article className="group relative overflow-hidden rounded-xl glass-card">
                <div className="relative h-72 overflow-hidden border-b border-[#1A3A6E]" style={{ background: `linear-gradient(160deg, ${f.color}30 0%, transparent 65%)` }}>
                  <ArtImage
                    src={FACTION_ART[f.id]}
                    alt={`${f.name} faction poster`}
                    opacity={0.9}
                    className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#061228] via-[#061228]/20 to-transparent" />
                  <div className="absolute left-4 top-4 flex items-center gap-2 border border-[#1A3A6E] bg-[rgba(6,18,40,0.8)] backdrop-blur-sm px-3 py-1.5 rounded-lg">
                    <FactionEmblem id={f.id} color={f.color} accent={f.accent} ink={f.ink} className="h-6 w-6" />
                    <span className="font-mono text-[9px] tracking-[0.25em] text-[#8CA7CC]">{f.codename}</span>
                  </div>
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl font-bold uppercase" style={{ color: f.color }}>{f.name}</h3>
                  <div className="mt-1 font-mono text-[10px] tracking-[0.3em] text-[#EEC470]">{f.tagline}</div>
                  <p className="mt-3 text-sm leading-relaxed text-[#8CA7CC]">{f.blurb}</p>
                  <div className="mt-4 flex flex-wrap gap-1.5 border-t border-[#1A3A6E] pt-4">
                    {f.domains.map((did) => {
                      const d = DOMAINS.find((x) => x.id === did);
                      return d ? (
                        <span key={did} className="border border-[#1A3A6E] bg-[rgba(14,36,72,0.4)] px-2 py-1 font-mono text-[9px] tracking-wider text-[#DFECF4] rounded-sm">
                          {d.icon} {d.title.split(' ')[0].toUpperCase()}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
                <span className="absolute inset-x-0 top-0 h-[2px]" style={{ background: `linear-gradient(90deg, transparent, ${f.color}, transparent)` }} />
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
