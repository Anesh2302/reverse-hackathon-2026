import { motion } from 'framer-motion';
import { DOMAINS, DOMAIN_PHASES } from '../data/domains';

const PADS = (i) => String(i + 1).padStart(2, '0');

const WARM = {
  '#ff4646': '#FF6B35',
  '#ff8a3d': '#FF6B35',
  '#ff8c42': '#FF6B35',
  '#ff7a70': '#FF6B35',
  '#f43f5e': '#FF6B35',
  '#fb7185': '#FF6B35',
  '#ffc53d': '#FFD600',
  '#4f8cff': '#3f6376',
  '#93c5fd': '#7f9db5',
  '#22d3ee': '#4c7c8f',
  '#00e5ff': '#3f6376',
  '#7dd3fc': '#7f9db5',
  '#5eead4': '#5b8f8a',
  '#52e0a4': '#5b8f6f',
  '#c084fc': '#9a7b9f',
};

export default function Domains() {
  return (
    <section id="domains" className="relative py-24 md:py-32 px-5 bg-[#0F0F0F]">
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
            <div className="inline-flex items-center gap-2 rounded-none border border-[#262626] bg-[#111111] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.3em] text-[#FFD600] shadow-sm mb-5">[06] // DOMAINS</div>
            <h2 className="font-display text-2xl md:text-4xl font-bold uppercase text-[#F5F5F0] leading-tight">
              <span className="text-[#FFD600]">15 DOMAINS</span> · ONE RUNTIME
            </h2>
          </div>
          <p className="font-mono text-sm md:text-base text-[#6E6E6E] md:text-right md:pb-1.5">
            pick a workload at deploy time. every domain routes to the live platform where the pros train —
            start sharpening before the chamber opens.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((d, i) => (
            <motion.article
              key={d.id}
              initial={{ opacity: 0, y: 26 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: (i % 3) * 0.1 }}
              className="group relative flex flex-col overflow-hidden rounded-none border border-[#262626] bg-[#161616] shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-all duration-300 hover:-translate-y-1 hover:border-[#FFD600] hover:shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
            >
              {/* Steam-style cover */}
              <span className="absolute left-0 top-0 z-10 h-full w-[2px] bg-[#FFD600] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <div className="relative h-28 overflow-hidden border-b border-[#262626]" style={{ background: `linear-gradient(135deg, ${WARM[d.color]}3d 0%, ${WARM[d.color]}14 55%, transparent 100%)` }}>
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
                <span className="absolute right-5 top-5 font-display text-[64px] font-black leading-none text-[#F5F5F0]/10 transition-colors group-hover:text-[#FFD600]/25">
                  {PADS(i)}
                </span>
                <span className="absolute bottom-3.5 right-5 font-mono text-[9px] tracking-[0.3em] text-[#F5F5F0]/60">{PADS(i)} // 15</span>
              </div>

              {/* body */}
              <div className="flex flex-1 flex-col p-6 pt-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-bold tracking-wide text-[#F5F5F0] transition-colors group-hover:text-[#FFD600]">
                    {d.title}
                  </h3>
                  <span className="shrink-0 rounded-none border border-[#262626] bg-[#111111] px-2.5 py-1 font-mono text-[9px] tracking-wider text-[#6E6E6E]">
                    {DOMAIN_PHASES[d.id]}
                  </span>
                </div>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-[#6E6E6E]">{d.desc}</p>

                <div className="border-t border-[#262626] pt-4">
                  <div className="mb-2.5 font-mono text-[10px] tracking-[0.3em] text-[#FFD600]">// TRAIN LIVE AT</div>
                  <ul className="space-y-2">
                    {d.sites.map((s) => (
                      <li key={s.url}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/site flex items-center justify-between gap-2 font-mono text-xs text-[#7f9db5] hover:text-[#FFD600] transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-[#FFD600]">▸</span>
                            {s.name}
                            <span className="hidden sm:inline font-mono text-[9px] tracking-wider text-[#555555]">{s.tag}</span>
                          </span>
                          <span className="opacity-0 group-hover/site:opacity-100 transition-opacity text-[#FFD600]">↗</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}