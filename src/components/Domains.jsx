import { motion } from 'framer-motion';
import { DOMAINS, DOMAIN_PHASES, factionOf } from '../data/domains';
import { FactionEmblem } from './Emblems';

const PADS = (i) => String(i + 1).padStart(2, '0');

const WARM = {
  '#C75C35': '#F25A1E',
  '#01338E': '#F2B705',
  '#F2B705': '#F2B705',
  '#D9261E': '#D9261E',
  '#E8A507': '#E8A507',
  '#C75C35': '#F25A1E',
  '#465066': '#7A686B',
  '#8A4A28': '#C75C35',
  '#36405A': '#D9261E',
  '#F25A1E': '#C75C35',
  '#7A686B': '#8C98B4',
  '#6A7690': '#D3A5A0',
  '#5E3A22': '#8A4A28',
  '#E3B9B5': '#EAF1FB',
  '#01338E': '#F2B705',
  '#D3A5A0': '#E3B9B5',
  '#EAF1FB': '#D3A5A0',
  '#36405A': '#D9261E',
};

export default function Domains() {
  return (
    <section id="domains" className="relative py-24 md:py-32 px-5 bg-[#060606]">
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
            <div className="inline-flex items-center gap-2 rounded-none border border-[#111E34] bg-[#0A0203] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.3em] text-[#1A0A0A] shadow-sm mb-5">[06] // DOMAINS</div>
            <h2 className="font-display text-2xl md:text-4xl font-bold uppercase text-[#1A0A0A] leading-tight">
              <span className="text-[#1A0A0A]">15 DOMAINS</span> · ONE RUNTIME
            </h2>
          </div>
          <p className="font-mono text-sm md:text-base text-[#7A686B] md:text-right md:pb-1.5">
            pick a workload at deploy time. every domain routes to the live platform where the pros train —
            start sharpening before the chamber opens.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((d, i) => {
            const f = factionOf(d.id);
            return (
            <motion.article
              key={d.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.1 }}
              className="group relative flex flex-col overflow-hidden rounded-none border border-[#111E34] bg-[#0A1220] shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-[#B01713] hover:shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
            >
              {/* Steam-style cover */}
              <span className="absolute left-0 top-0 z-10 h-full w-[2px] bg-[#D9261E] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative h-28 overflow-hidden border-b border-[#111E34]" style={{ background: `linear-gradient(135deg, ${WARM[d.color]}3d 0%, ${WARM[d.color]}14 55%, transparent 100%)` }}>
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
                <span className="absolute right-5 top-5 font-display text-[64px] font-black leading-none text-[#1A0A0A]/10 transition-colors group-hover:text-[#1A0A0A]/25">
                  {PADS(i)}
                </span>
                <span className="absolute bottom-3.5 right-5 font-mono text-[9px] tracking-[0.3em] text-[#1A0A0A]/60">{PADS(i)} // 15</span>
              </div>

              {/* body */}
              <div className="flex flex-1 flex-col p-6 pt-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-bold tracking-wide text-[#1A0A0A] transition-colors group-hover:text-[#1A0A0A]">
                    {d.title}
                  </h3>
                  <span className="flex shrink-0 items-center gap-1.5 rounded-none border px-2 py-1 font-mono text-[9px] tracking-wider" style={{ borderColor: `${f.color}55`, color: f.color, background: '#24080B' }}>
                    <FactionEmblem id={f.id} color={f.color} accent={f.accent} ink={f.ink} className="h-4 w-4" />
                    {DOMAIN_PHASES[d.id]}
                  </span>
                </div>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-[#7A686B]">{d.desc}</p>

                <div className="border-t border-[#111E34] pt-4">
                  <div className="mb-2.5 font-mono text-[10px] tracking-[0.3em] text-[#1A0A0A]">// TRAIN LIVE AT</div>
                  <ul className="space-y-2">
                    {d.sites.map((s) => (
                      <li key={s.url}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/site flex items-center justify-between gap-2 font-mono text-xs text-[#1C0A0A] hover:text-[#1A0A0A] transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-[#1A0A0A]">▸</span>
                            {s.name}
                            <span className="hidden sm:inline font-mono text-[9px] tracking-wider text-[#4A3D3F]">{s.tag}</span>
                          </span>
                          <span className="opacity-0 group-hover/site:opacity-100 transition-opacity text-[#1A0A0A]">↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>

              <div className="mt-4 flex items-center justify-between border-t border-[#111E34] pt-3 font-mono text-[9px] tracking-[0.25em]">
                <span className="text-[#7A686B]">CARRIED BY</span>
                <span className="flex items-center gap-2" style={{ color: f.color }}>
                  <FactionEmblem id={f.id} color={f.color} accent={f.accent} ink={f.ink} className="h-4 w-4" />
                  FACTION {f.name}
                </span>
              </div>
            </div>
            </motion.article>
          );
        })}
      </div>
      </div>
    </section>
  );
}