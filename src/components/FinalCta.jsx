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
          className="relative overflow-hidden rounded-2xl border border-[#c8b98a] bg-[#fbf7ee] px-8 py-14 md:py-20 text-center"
          style={{ boxShadow: '0 24px 70px rgba(90,60,0,0.14), inset 0 20px 45px rgba(255,255,255,0.6)' }}
        >
          <div className="pointer-events-none absolute inset-0 grid-overlay opacity-[0.06]" />
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full blur-3xl"
            style={{ background: 'rgba(189,122,0,0.10)' }}
          />
          <div className="pointer-events-none absolute inset-0 paper-texture" />
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-md border border-[#e0d5b4] bg-[#fbf7ee] px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-[#bd7a00]">&lt;ACCESS.GATE /&gt;</div>
            <h2 className="font-display text-2xl md:text-5xl font-bold text-[#16171c]">
              PUT YOUR HARDEST<br className="hidden md:block" />{' '}
              EXPLOIT ON THE <span className="text-[#bd7a00] [text-shadow:0_0_40px_rgba(189,122,0,0.25)]">WIRE.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-mono text-sm text-[#8a7a4a]">
              {EVENT.dateLabel} · {EVENT.venue} · LEDGER CLOSED AT 07:00
            </p>
            <p className="mx-auto mt-4 max-w-xl text-[#4a4639]">
              Tell us which domain you want to burn fastest — we map the right cluster architecture for your pod.
              Slots are capped at 300 and it's exclusively DEP-CYS I, II &amp; III. Deploy now, sign at the gate,
              sharpen the toolchain before the chamber opens.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#register" className="inline-flex items-center justify-center rounded-lg bg-[#16171c] px-12 py-3.5 text-sm font-bold tracking-wide text-[#f5f1e6] transition-colors hover:bg-[#2a2b30] [box-shadow:0_14px_30px_rgba(22,23,28,0.16)]">Deploy Your Stand</a>
              <a href="#domains" className="inline-flex items-center justify-center rounded-lg border border-[#16171c] px-12 py-3.5 text-sm font-bold tracking-wide text-[#16171c] transition-colors hover:bg-[#16171c] hover:text-[#f5f1e6]">Scope the Domains</a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}