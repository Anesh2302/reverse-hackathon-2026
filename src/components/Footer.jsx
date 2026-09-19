import { EVENT } from '../data/domains';

const SOCIALS = ['Discord', 'Instagram', 'LinkedIn'];

export default function Footer() {
  return (
    <footer className="relative border-t border-[#e0d5b4] bg-[#f5f1e6] py-16 px-5">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-[0.06]" />
      <div className="mx-auto max-w-6xl relative z-10 text-center">
        <div className="mb-2 font-display text-3xl font-black">
          <span className="text-[#16171c]">REVERSE</span> <span className="text-[#bd7a00]">HACKATHON</span>
        </div>
        <div className="font-mono text-xs tracking-[0.3em] text-[#8a7a4a] mb-6">{EVENT.dateLabel} · {EVENT.venue} · LEDGER CLOSED 07:00</div>

        <div className="mb-8 flex justify-center gap-4">
          {SOCIALS.map((s) => (
            <a
              key={s}
              href="#top"
              className="inline-flex items-center justify-center rounded-lg border border-[#e0d5b4] bg-[#fbf7ee] px-6 py-2.5 font-mono text-xs tracking-[0.25em] text-[#5b3a0a] transition-colors hover:border-[#bd7a00]/60 hover:text-[#bd7a00] [box-shadow:0_10px_22px_rgba(90,60,0,0.08)]"
            >
              {s.toUpperCase()}
            </a>
          ))}
        </div>

        <p className="text-sm text-[#4a4639] max-w-xl mx-auto mb-6">
          Organized by the Cybersecurity department (DEP-CYS). For event updates, notices and
          registrations, reach the organizing committee.
        </p>

        <div className="font-mono text-[10px] tracking-[0.2em] text-[#8a7a4a]">
          © {new Date().getFullYear()} REVERSE HACKATHON · DEP-CYS — CLEARANCE I · II · III ONLY · <a href="#/admin" className="hover:text-[#bd7a00]">admin</a>
        </div>
      </div>
    </footer>
  );
}