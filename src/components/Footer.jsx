import { EVENT } from '../data/domains';

const SOCIALS = ['Discord', 'Instagram', 'LinkedIn'];

export default function Footer() {
  return (
    <footer className="relative border-t border-[#111E34] bg-[#060606] py-16 px-5">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-[0.05]" />
      <div className="mx-auto max-w-6xl relative z-10 text-center">
        <div className="mb-2 font-display text-3xl font-black">
          <span className="text-[#1A0A0A]">REVERSE</span> <span className="text-[#1A0A0A]">HACKATHON</span>
        </div>
        <div className="font-mono text-xs tracking-[0.3em] text-[#7A686B] mb-6">{EVENT.dateLabel} · LEDGER CLOSED 07:00</div>

        <div className="mb-8 flex justify-center gap-4">
          {SOCIALS.map((s) => (
            <a
              key={s}
              href="#top"
              className="inline-flex items-center justify-center rounded-none border border-[#111E34] bg-[#0A0203] px-6 py-2.5 font-mono text-xs tracking-[0.25em] text-[#1A0A0A] transition-colors hover:border-[#B01713] hover:text-[#1A0A0A] [box-shadow:0_10px_22px_rgba(0,0,0,0.4)]"
            >
              {s.toUpperCase()}
            </a>
          ))}
        </div>

        <p className="text-sm text-[#7A686B] max-w-xl mx-auto mb-6">
          Organized for the REVERSE HACKATHON 2026 student community. For event updates, notices and
          registrations, reach the organizing committee.
        </p>

        <p className="text-sm text-[#7A686B] max-w-xl mx-auto mb-6">
          Inspired by the <a href="https://v0.app/templates/stack-attack-market-clash-wi1zVbwl7kq" target="_blank" rel="noreferrer" className="text-[#7A686B] hover:text-[#1A0A0A] underline">Stack Attack: Market Clash</a> design template from v0.app.
        </p>

        <div className="font-mono text-[10px] tracking-[0.2em] text-[#4A3D3F]">
          © {new Date().getFullYear()} REVERSE HACKATHON 2026 · <a href="#/admin" className="hover:text-[#1A0A0A]">admin</a>
        </div>
      </div>
    </footer>
  );
}