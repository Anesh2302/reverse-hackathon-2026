import { EVENT } from '../data/domains';

const SOCIALS = ['Discord', 'Instagram', 'LinkedIn'];

export default function Footer() {
  return (
    <footer className="relative border-t border-[#e03131]/20 bg-[#f7f3e8] py-16 px-5">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-20" />
      <div className="mx-auto max-w-6xl relative z-10 text-center">
        <div className="mb-2 font-display text-3xl font-black">
          <span className="text-[#141414]">REVERSE</span> <span className="text-gradient">HACKATHON</span>
        </div>
        <div className="font-mono text-xs tracking-[0.3em] text-[#e03131] mb-6">{EVENT.dateLabel} · {EVENT.venue}</div>

        <div className="mb-8 flex justify-center gap-4">
          {SOCIALS.map((s) => (
            <a
              key={s}
              href="#top"
              className="glass-card rounded px-6 py-2.5 font-mono text-xs tracking-[0.25em] text-[#322c22] hover:text-[#e03131] hover:border-[#e03131]/50 transition-colors"
            >
              {s.toUpperCase()}
            </a>
          ))}
        </div>

        <p className="text-sm text-[#322c22] max-w-xl mx-auto mb-6">
          Organized by the Cybersecurity department (DEP-CYS). For event updates, notices and
          registrations, reach the organizing committee.
        </p>

        <div className="font-mono text-[10px] tracking-[0.2em] text-[#7c7263]">
          © {new Date().getFullYear()} REVERSE HACKATHON · DEP-CYS — FOR I · II · III ONLY · <a href="#/admin" className="hover:text-[#e03131]">admin</a>
        </div>
      </div>
    </footer>
  );
}