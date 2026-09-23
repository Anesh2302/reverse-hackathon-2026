import { motion } from 'framer-motion';
import { EVENT } from '../data/domains';
import Reveal from './Reveal';
import CapShield from './CapShield';
import ArtImage from './ArtImage';
import { ART } from '../data/art';

export default function FinalCta() {
  return (
    <section className="relative px-5 pb-24 pt-10 glass-section overflow-hidden">
      {/* Background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-[radial-gradient(ellipse,rgba(218,43,54,0.06)_0%,transparent_70%)]" />
        <div className="absolute inset-0 grid-overlay opacity-[0.03]" />
      </div>

      <Reveal>
        <div className="mx-auto max-w-5xl relative z-10">
          <div className="relative overflow-hidden rounded-xl glass-card px-8 py-16 md:py-24 text-center">
            <ArtImage src={ART.finaleBg.src} alt={ART.finaleBg.alt} opacity={0.35} className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#061228]/70 via-[#061228]/40 to-[#061228]/85" />
            {/* Background shield watermark */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none">
              <CapShield size={500} glow={false} interactive={false} />
            </div>

            {/* Glow orbs */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] bg-[radial-gradient(ellipse,rgba(26,86,219,0.1)_0%,transparent_70%)] pointer-events-none" />
            <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[300px] h-[150px] bg-[radial-gradient(ellipse,rgba(218,43,54,0.06)_0%,transparent_70%)] pointer-events-none" />

            <div className="relative z-10">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 border border-[#1A3A6E] bg-[rgba(14,36,72,0.6)] backdrop-blur-sm px-4 py-2 rounded-full mb-8">
                <span className="h-1.5 w-1.5 rounded-full bg-[#DA2B36] animate-pulse" />
                <span className="font-mono text-[10px] tracking-[0.3em] text-[#8CA7CC] uppercase">[09] // ACCESS GATE</span>
              </div>

              {/* Title */}
              <h2 className="font-display text-3xl md:text-6xl font-bold uppercase text-[#DFECF4] leading-tight">
                PUT YOUR HARDEST<br className="hidden md:block" />{' '}
                EXPLOIT ON THE <span className="hero-gradient">WIRE.</span>
              </h2>

              {/* Subtitle */}
              <p className="mx-auto mt-4 max-w-xl font-mono text-sm text-[#EEC470]">
                {EVENT.dateLabel} · LEDGER CLOSED AT 07:00
              </p>

              {/* Description */}
              <p className="mx-auto mt-5 max-w-xl text-sm text-[#8CA7CC] leading-relaxed">
                Tell us which domain you want to burn fastest — we map the right cluster architecture for your pod.
                Slots are capped at 300 and it's open exclusively to Year I, II &amp; III.
              </p>

              {/* CTAs */}
              <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
                <a href="#register" className="btn-neon w-full sm:w-auto">
                  Deploy Your Stand
                </a>
                <a href="#domains" className="btn-ghost w-full sm:w-auto">
                  Scope the Domains
                </a>
              </div>

              {/* Trust badges */}
              <div className="mt-8 flex flex-wrap items-center justify-center gap-4 text-[10px] font-mono tracking-[0.2em] text-[#8CA7CC]">
                <span className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#EEC470]" /> CRYPTO-SIGNED FLAGS
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#DA2B36]" /> LIVE VERIFICATION
                </span>
                <span className="flex items-center gap-2">
                  <span className="h-1 w-1 rounded-full bg-[#1A56DB]" /> 15 DOMAINS
                </span>
              </div>
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
