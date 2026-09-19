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
    <section id="faq" className="relative py-24 md:py-32 px-5">
      <div className="mx-auto max-w-3xl">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="mb-12"
        >
          <div className="comic-chip border border-[#ffc53d]/60 px-3 py-1 text-[10px] text-[#ffd34d] mb-5">&lt;queris.db /&gt;</div>
          <h2 className="font-display text-2xl md:text-4xl font-bold text-[#eef0f6]">
            FREQUENTLY <span className="text-gradient">ASKED</span>
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
                className="comic-card group overflow-hidden rounded-md transition-colors duration-300"
                style={isOpen ? { borderColor: '#ffd34d' } : undefined}
              >
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                >
                  <span className="flex items-center gap-3">
                    <span className="font-mono text-xs text-[#ffd34d]">0{i + 1}</span>
                    <span className="font-mono text-sm tracking-wide text-[#eef0f6]">{f.q}</span>
                  </span>
                  <span
                    className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border text-xs transition-all duration-300 ${isOpen ? 'rotate-45 border-[#ffd34d]/60 text-[#ffd34d]' : 'border-[#4a4e60] text-[#c9cbd8] group-hover:border-[#ffd34d]/40 group-hover:text-[#ffd34d]'}`}
                  >
                    +
                  </span>
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="px-5 pb-5 pl-12 text-sm leading-relaxed text-[#c9cbd8]">{f.a}</p>
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