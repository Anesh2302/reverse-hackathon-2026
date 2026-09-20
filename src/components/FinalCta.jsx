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
          className="relative overflow-hidden rounded-none border border-[#111E34] bg-[#0A1220] px-8 py-14 md:py-20 text-center"
          style={{ boxShadow: '0 24px 70px rgba(0,0,0,0.5), inset 0 20px 45px rgba(0,0,0,0.35)' }}
        >
          <div className="pointer-events-none absolute inset-0 grid-overlay opacity-[0.06]" />
          <div
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 h-64 w-64 rounded-none blur-3xl"
            style={{ background: 'rgba(217,64,21,0.08)' }}
          />
          <div className="pointer-events-none absolute inset-0 paper-texture" />
          <div className="relative z-10">
            <div className="mb-5 inline-flex items-center gap-2 rounded-none border border-[#111E34] bg-[#0A0203] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.3em] text-[#1A0A0A] shadow-sm">[09] // ACCESS GATE</div>
            <h2 className="font-display text-2xl md:text-5xl font-bold uppercase text-[#1A0A0A] leading-tight">
              PUT YOUR HARDEST<br className="hidden md:block" />{' '}
              EXPLOIT ON THE <span className="text-[#1A0A0A] [text-shadow:0_0_40px_rgba(217,64,21,0.25)]">WIRE.</span>
            </h2>
            <p className="mx-auto mt-4 max-w-xl font-mono text-sm text-[#7A686B]">
              {EVENT.dateLabel} · LEDGER CLOSED AT 07:00
            </p>
            <p className="mx-auto mt-4 max-w-xl text-[#7A686B]">
              Tell us which domain you want to burn fastest — we map the right cluster architecture for your pod.
              Slots are capped at 300 and it's open exclusively to Year I, II &amp; III. Deploy now, sign at the gate,
              sharpen the toolchain before the chamber opens.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#register" className="inline-flex items-center justify-center rounded-none bg-[#D9261E] px-12 py-3.5 font-mono text-sm font-bold tracking-wide uppercase text-[#1A0A0A] transition-colors hover:bg-[#D9261E] [box-shadow:0_14px_30px_rgba(217,64,21,0.2)]">Deploy Your Stand</a>
              <a href="#domains" className="inline-flex items-center justify-center rounded-none border border-[#B01713] bg-transparent px-12 py-3.5 font-mono text-sm font-bold tracking-wide uppercase text-[#1A0A0A] transition-colors hover:bg-[#D9261E] hover:text-[#1A0A0A]">Scope the Domains</a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}