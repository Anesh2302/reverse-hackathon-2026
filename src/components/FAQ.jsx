import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Reveal from './Reveal';

const FAQS = [
  {
    q: 'Who can register?',
    a: "REVERSE HACKATHON 2026 is open to students in Year I, Year II and Year III. If you are outside these years, this arena isn't open to you — yet.",
  },
  {
    q: 'Can I participate solo or do I need a team?',
    a: 'Both. Register as a Solo Run, or roll as a Team Duo of exactly 2 (you + one partner). Solo and duos compete in the same arena with the same 3-hour clock and a 5-minute showcase each.',
  },
  {
    q: 'Do I need to be an expert?',
    a: "No. The 15 domains range from beginner-friendly (OSINT, web security) to hardcore (binary exploitation, zero-day hunting). Pick a domain, and we link every domain to the live training platforms where the pros practice — start grinding before Oct 8.",
  },
  {
    q: 'Do I need my own device?',
    a: "Yes — bring your laptop and charger. A mouse helps for fine attacks. We'll provide the network, targets, and power outlets.",
  },
  {
    q: 'How long is the event and what happens at the end?',
    a: "The arena runs for 3 hours flat on Oct 8. At the end, every solo and duo gets 5 minutes to explain and show exactly what they did — your attack, your flag rows, your demo. Judges score the showcase plus the run.",
  },
  {
    q: 'What happens after I register?',
    a: "You'll receive a registration ID immediately. Save it — you'll verify with it at check-in. Keep an eye on the event notice boards and your email for the arena guide.",
  },
  {
    q: 'Is there a registration fee?',
    a: 'Registration is free for all students. Just show up, sign in and dominate.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative py-24 md:py-32 px-5 glass-section">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-none border border-[#1A3A6E] bg-[#0E2448] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.3em] text-[#DFECF4] shadow-sm mb-5">[08] // FAQ</div>
          <h2 className="font-display text-2xl md:text-4xl font-bold uppercase text-[#DFECF4] leading-tight">
            FREQUENTLY <span className="text-[#DFECF4]">ASKED</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <Reveal key={i} delay={i * 0.08}>
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group relative overflow-hidden rounded-lg glass-card transition-colors duration-300"
                style={isOpen ? { borderColor: '#DA2B36' } : undefined}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#DFECF4]">0{i + 1}</span>
                    <span className="font-mono text-sm tracking-wide text-[#DFECF4]">{f.q}</span>
                  </span>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-none border text-xs transition-all duration-300 ${isOpen ? 'rotate-45 border-[#DA2B36] text-[#DFECF4]' : 'border-[#1A3A6E] text-[#8CA7CC] group-hover:border-[#DA2B36]/50 group-hover:text-[#DFECF4]'}`}
                  >
                    +
                  </span>
                </button>
                <span className="absolute left-0 top-0 h-[2px] w-full bg-[#DA2B36] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-5 pb-5 pl-12 text-sm leading-relaxed text-[#8CA7CC]">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}