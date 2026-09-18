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
            style={{ background: 'rgba(255,70,70,0.18)' }}
          />
          <div className="relative z-10">
            <div className="comic-chip bg-[#ffd34d] px-3 py-1 text-[10px] text-[#17181f] mb-5">&lt;DEPLOY_READY /&gt;</div>
            <h2 className="font-display text-3xl md:text-6xl font-black text-[#eef0f6] neon-text">
              READY TO <span className="text-gradient">BREAK IN?</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[#c9cbd8]">
              {EVENT.dateLabel} · {EVENT.venue}. 3 hours, 15 domains, and a 5-minute showcase per pod.
            Slots are capped at 300 and it's exclusively DEP-CYS I, II &amp; III. Register now, lock
            your ID, and sharpen your toolchain before the gate opens.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#register" className="btn-neon pulse-ring text-center text-sm px-12">// Enlist Now</a>
              <a href="#domains" className="btn-ghost text-center text-sm px-12">Browse Domains</a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}