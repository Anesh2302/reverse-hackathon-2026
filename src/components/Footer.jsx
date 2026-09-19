import { EVENT } from '../data/domains';

const SOCIALS = ['Discord', 'Instagram', 'LinkedIn'];

export default function Footer() {
  return (
    <footer className="relative border-t border-[#ffc53d]/20 bg-[#0b0b0d] py-16 px-5">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-20" />
      <div className="mx-auto max-w-6xl relative z-10 text-center">
        <div className="mb-2 font-display text-3xl font-black">
          <span className="text-[#eef0f6]">REVERSE</span> <span className="text-gradient">HACKATHON</span>
        </div>
        <div className="font-mono text-xs tracking-[0.3em] text-[#ffd34d] mb-6">{EVENT.dateLabel} · {EVENT.venue} · LEDGER CLOSED 07:00</div>

        <div className="mb-8 flex justify-center gap-4">
          {SOCIALS.map((s) => (
            <a
              key={s}
              href="#top"
              className="glass-card rounded px-6 py-2.5 font-mono text-xs tracking-[0.25em] text-[#c9cbd8] hover:text-[#ffd34d] hover:border-[#ffc53d]/50 transition-colors"
            >
              {s.toUpperCase()}
            </a>
          ))}
        </div>

        <p className="text-sm text-[#c9cbd8] max-w-xl mx-auto mb-6">
          Organized by the Cybersecurity department (DEP-CYS). For event updates, notices and
          registrations, reach the organizing committee.
        </p>

        <div className="font-mono text-[10px] tracking-[0.2em] text-[#989bb0]">
          © {new Date().getFullYear()} REVERSE HACKATHON · DEP-CYS — CLEARANCE I · II · III ONLY · <a href="#/admin" className="hover:text-[#ffd34d]">admin</a>
        </div>
      </div>
    </footer>
  );
}