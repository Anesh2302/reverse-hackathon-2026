import { motion } from 'framer-motion';
import { EVENT } from '../data/domains';

export default function FinalCta() {
  return (
    <section className="relative px-5 pb-24">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 0.6 }}
          className="glass scanline relative overflow-hidden rounded-2xl px-8 py-14 md:py-20 text-center"
        >
          <div className="pointer-events-none absolute inset-0 grid-overlay opacity-30" />
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full blur-3xl"
            style={{ background: 'rgba(255,211,77,0.10)' }}
          />
          <div className="pointer-events-none absolute inset-0 paper-texture" />
          <div className="relative z-10">
            <div className="comic-chip border border-[#ffc53d]/60 px-3 py-1 text-[10px] text-[#ffd34d] mb-5">&lt;HANDOFF_READY /&gt;</div>
            <h2 className="font-display text-2xl md:text-5xl font-bold text-[#eef0f6]">
              HAND THE NIGHT OVER.<br className="hidden md:block" />{' '}
              <span className="text-gradient">KEEP THE MORNING.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-mono text-sm text-[#989bb0]">
              {EVENT.dateLabel} · {EVENT.venue} · LOGS SHUT AT 07:00
            </p>
            <p className="mx-auto mt-4 max-w-xl text-[#c9cbd8]">
              One standing order — register a stand. A shadow night runs in the background while you sharpen:
              3 hours, 15 domains, a 5-minute showcase per pod. Slots are capped at 300 and it's exclusively
              DEP-CYS I, II &amp; III. If the morning report isn't worth reading, cancel before the second night.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#register" className="btn-neon pulse-ring text-center text-sm px-12">Hand It One Job</a>
              <a href="#domains" className="btn-ghost text-center text-sm px-12">Scope the Night</a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}