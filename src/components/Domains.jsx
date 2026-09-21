import { motion } from 'framer-motion';
import Reveal from './Reveal';
import TiltCard from './TiltCard';
import { DOMAINS, DOMAIN_PHASES, factionOf } from '../data/domains';
import { FactionEmblem } from './Emblems';

const PADS = (i) => String(i + 1).padStart(2, '0');

const WARM = {
  '#DA2B36': '#DA2B36',
  '#01338E': '#EEC470',
  '#EEC470': '#EEC470',
  '#465066': '#8CA7CC',
  '#1A56DB': '#DA2B36',
  '#36405A': '#DA2B36',
  '#8CA7CC': '#8C98B4',
  '#6A7690': '#D3A5A0',
  '#5E3A22': '#1A56DB',
  '#DFECF4': '#D3A5A0',
  '#D3A5A0': '#DFECF4',
};

export default function Domains() {
  return (
    <section id="domains" className="relative py-24 md:py-32 px-5 glass-section">
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
            <div className="inline-flex items-center gap-2 rounded-none border border-[#1A3A6E] bg-[#0E2448] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.3em] text-[#DFECF4] shadow-sm mb-5">[06] // DOMAINS</div>
            <h2 className="font-display text-2xl md:text-4xl font-bold uppercase text-[#DFECF4] leading-tight">
              <span className="text-[#DFECF4]">15 DOMAINS</span> · ONE RUNTIME
            </h2>
          </div>
          <p className="font-mono text-sm md:text-base text-[#8CA7CC] md:text-right md:pb-1.5">
            pick a workload at deploy time. every domain routes to the live platform where the pros train —
            start sharpening before the chamber opens.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((d, i) => {
            const f = factionOf(d.id);
            return (
            <Reveal key={d.id} delay={i * 0.05}>
            <TiltCard glowColor={WARM[d.color]}>
            <motion.article
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.1 }}
              className="group relative flex flex-col overflow-hidden rounded-lg glass-card transition-all duration-300 hover:-translate-y-1"
            >
              {/* Steam-style cover */}
              <span className="absolute left-0 top-0 z-10 h-full w-[2px] bg-[#DA2B36] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative h-28 overflow-hidden border-b border-[#1A3A6E]" style={{ background: `linear-gradient(135deg, ${WARM[d.color]}3d 0%, ${WARM[d.color]}14 55%, transparent 100%)` }}>
                <div
                  className="absolute inset-0 opacity-[0.12] transition-opacity duration-300 group-hover:opacity-30"
                  style={{ backgroundImage: `linear-gradient(135deg, ${WARM[d.color]} 0%, transparent 70%)` }}
                />
                <div className="pointer-events-none absolute inset-0 -translate-x-[130%] bg-gradient-to-r from-transparent via-white/10 to-transparent transition-transform duration-700 ease-out group-hover:translate-x-[130%]" />
                <div
                  className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-none opacity-30 blur-3xl transition-opacity group-hover:opacity-70"
                  style={{ background: WARM[d.color] }}
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-5xl drop-shadow-[0_4px_10px_rgba(0,0,0,0.5)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  {d.icon}
                </span>
                <span className="absolute right-5 top-5 font-display text-[64px] font-black leading-none text-[#DFECF4] opacity-15 transition-colors group-hover:opacity-30">
                  {PADS(i)}
                </span>
                <span className="absolute bottom-3.5 right-5 font-mono text-[9px] tracking-[0.3em] text-[#DFECF4] opacity-70">{PADS(i)} // 15</span>
              </div>

              {/* body */}
              <div className="flex flex-1 flex-col p-6 pt-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-bold tracking-wide text-[#DFECF4] transition-colors group-hover:text-[#DFECF4]">
                    {d.title}
                  </h3>
                  <span className="flex shrink-0 items-center gap-1.5 rounded-none border px-2 py-1 font-mono text-[9px] tracking-wider" style={{ borderColor: `${f.color}55`, color: f.color, background: 'rgba(14,36,72,0.4)' }}>
                    <FactionEmblem id={f.id} color={f.color} accent={f.accent} ink={f.ink} className="h-4 w-4" />
                    {DOMAIN_PHASES[d.id]}
                  </span>
                </div>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-[#8CA7CC]">{d.desc}</p>

                <div className="border-t border-[#1A3A6E] pt-4">
                  <div className="mb-2.5 font-mono text-[10px] tracking-[0.3em] text-[#DFECF4]">// TRAIN LIVE AT</div>
                  <ul className="space-y-2">
                    {d.sites.map((s) => (
                      <li key={s.url}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/site flex items-center justify-between gap-2 font-mono text-xs text-[#DFECF4] hover:text-[#DFECF4] transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-[#DFECF4]">▸</span>
                            {s.name}
                            <span className="hidden sm:inline font-mono text-[9px] tracking-wider text-[#8CA7CC]">{s.tag}</span>
                          </span>
                          <span className="opacity-0 group-hover/site:opacity-100 transition-opacity text-[#DFECF4]">↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#1A3A6E] pt-3 font-mono text-[9px] tracking-[0.25em]">
                <span className="text-[#8CA7CC]">CARRIED BY</span>
                <span className="flex items-center gap-2" style={{ color: f.color }}>
                  <FactionEmblem id={f.id} color={f.color} accent={f.accent} ink={f.ink} className="h-4 w-4" />
                  FACTION {f.name}
                </span>
              </div>
            </div>
            </motion.article>
            </TiltCard>
            </Reveal>
          );
        })}
      </div>
      </div>
    </section>
  );
}