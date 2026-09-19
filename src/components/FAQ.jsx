import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const FAQS = [
  {
    q: 'Who can register?',
    a: "Only DEP-CYS students in Year I, Year II and Year III. If you are from another department or year, this arena isn't open to you — yet.",
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
    a: "You'll receive a registration ID immediately. Save it — you'll verify with it at check-in. Keep an eye on the DEP-CYS notice boards and your email for the arena guide.",
  },
  {
    q: 'Is there a registration fee?',
    a: 'Registration is free for DEP-CYS students. Just show up, sign in and dominate.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section id="faq" className="relative py-24 md:py-32 px-5 bg-[#0F0F0F]">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="inline-flex items-center gap-2 rounded-none border border-[#262626] bg-[#111111] px-3 py-1 font-mono text-[11px] uppercase tracking-[0.3em] text-[#FFD600] shadow-sm mb-5">[08] // FAQ</div>
          <h2 className="font-display text-2xl md:text-4xl font-bold uppercase text-[#F5F5F0] leading-tight">
            FREQUENTLY <span className="text-[#FFD600]">ASKED</span>
          </h2>
        </motion.div>

        <div className="space-y-3">
          {FAQS.map((f, i) => {
            const isOpen = open === i;
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
                className="group relative overflow-hidden rounded-none border border-[#262626] bg-[#161616] shadow-[0_8px_24px_rgba(0,0,0,0.45)] transition-colors duration-300"
                style={isOpen ? { borderColor: '#FFD600' } : undefined}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#FFD600]">0{i + 1}</span>
                    <span className="font-mono text-sm tracking-wide text-[#F5F5F0]">{f.q}</span>
                  </span>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-none border text-xs transition-all duration-300 ${isOpen ? 'rotate-45 border-[#FFD600] text-[#FFD600]' : 'border-[#262626] text-[#6E6E6E] group-hover:border-[#FFD600]/50 group-hover:text-[#FFD600]'}`}
                  >
                    +
                  </span>
                </button>
                <span className="absolute left-0 top-0 h-[2px] w-full bg-[#FFD600] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-5 pb-5 pl-12 text-sm leading-relaxed text-[#6E6E6E]">{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}