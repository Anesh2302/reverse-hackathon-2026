import { motion } from 'framer-motion';
import { DOMAINS, DOMAIN_PHASES } from '../data/domains';

const PADS = (i) => String(i + 1).padStart(2, '0');

export default function Domains() {
  return (
    <section id="domains" className="relative py-24 md:py-32 px-5 bg-[#eef3fb]/60">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-30" />
      <div className="mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end mb-16 md:mb-20"
        >
          <div>
            <div className="font-mono text-xs tracking-[0.4em] text-[#e03131] mb-4">&lt;CATALOG.CY /&gt;</div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#0c1a33]">
              <span className="text-gradient">15 DOMAINS</span> OF CYBER
            </h2>
          </div>
          <p className="text-base md:text-lg text-[#43536e] md:text-right md:pb-1.5">
            Pick your battleground when you register. Each domain links to the live platforms
            where the pros train — start sharpening before Oct 8.
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
              className="glass-card group relative flex flex-col overflow-hidden rounded-xl transition-transform duration-300 hover:-translate-y-1.5"
            >
              {/* Steam-style cover */}
              <div className="relative h-28 overflow-hidden" style={{ background: `linear-gradient(135deg, ${d.color}3d 0%, ${d.color}14 55%, rgba(255,255,255,0) 100%)` }}>
                <div
                  className="absolute inset-0 opacity-[0.12] transition-opacity duration-300 group-hover:opacity-30"
                  style={{ backgroundImage: `linear-gradient(135deg, ${d.color} 0%, transparent 70%)` }}
                />
                <div
                  className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full opacity-30 blur-3xl transition-opacity group-hover:opacity-70"
                  style={{ background: d.color }}
                />
                <span className="absolute left-6 top-1/2 -translate-y-1/2 text-5xl drop-shadow-[0_4px_10px_rgba(12,26,51,0.25)] transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-3">
                  {d.icon}
                </span>
                <span className="absolute right-5 top-5 font-display text-[64px] font-black leading-none text-[#0c1a33]/10 transition-colors group-hover:text-[#e03131]/25">
                  {PADS(i)}
                </span>
                <span className="absolute bottom-3.5 right-5 font-mono text-[9px] tracking-[0.3em] text-[#0c1a33]/60">0{i + 1} // 15</span>
              </div>

              {/* body */}
              <div className="flex flex-1 flex-col p-6 pt-4">
                <div className="mb-2 flex items-center justify-between gap-3">
                  <h3 className="font-display text-lg font-bold tracking-wide text-[#0c1a33] transition-colors group-hover:text-[#e03131]">
                    {d.title}
                  </h3>
                  <span className="shrink-0 rounded-full border border-[#cfd9ea] bg-[#eef2fa] px-2.5 py-1 font-mono text-[9px] tracking-wider text-[#43536e]">
                    {DOMAIN_PHASES[d.id]}
                  </span>
                </div>
                <p className="mb-5 flex-1 text-sm leading-relaxed text-[#43536e]">{d.desc}</p>

                <div className="border-t border-[#e3e9f4] pt-4">
                  <div className="mb-2.5 font-mono text-[10px] tracking-[0.3em] text-[#5b6b87]">// TRAIN LIVE AT</div>
                  <ul className="space-y-2">
                    {d.sites.map((s) => (
                      <li key={s.url}>
                        <a
                          href={s.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="group/site flex items-center justify-between gap-2 font-mono text-xs text-[#3b82f6] hover:text-[#e03131] transition-colors"
                        >
                          <span className="flex items-center gap-2">
                            <span className="text-[#e03131]">▸</span>
                            {s.name}
                            <span className="hidden sm:inline font-mono text-[9px] tracking-wider text-[#64748c]">{s.tag}</span>
                          </span>
                          <span className="opacity-0 group-hover/site:opacity-100 transition-opacity text-[#e03131]">↗</span>
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