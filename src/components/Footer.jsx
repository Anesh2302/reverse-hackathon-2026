import { EVENT } from '../data/domains';

const SOCIALS = ['Discord', 'Instagram', 'LinkedIn'];

export default function Footer() {
  return (
    <footer className="relative border-t border-[#262626] bg-[#0F0F0F] py-16 px-5">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-[0.05]" />
      <div className="mx-auto max-w-6xl relative z-10 text-center">
        <div className="mb-2 font-display text-3xl font-black">
          <span className="text-[#F5F5F0]">REVERSE</span> <span className="text-[#FFD600]">HACKATHON</span>
        </div>
        <div className="font-mono text-xs tracking-[0.3em] text-[#6E6E6E] mb-6">{EVENT.dateLabel} · {EVENT.venue} · LEDGER CLOSED 07:00</div>

        <div className="mb-8 flex justify-center gap-4">
          {SOCIALS.map((s) => (
            <a
              key={s}
              href="#top"
              className="inline-flex items-center justify-center rounded-none border border-[#262626] bg-[#111111] px-6 py-2.5 font-mono text-xs tracking-[0.25em] text-[#F5F5F0] transition-colors hover:border-[#FFD600] hover:text-[#FFD600] [box-shadow:0_10px_22px_rgba(0,0,0,0.4)]"
            >
              {s.toUpperCase()}
            </a>
          ))}
        </div>

        <p className="text-sm text-[#6E6E6E] max-w-xl mx-auto mb-6">
          Organized for the REVERSE HACKATHON 2026 student community. For event updates, notices and
          registrations, reach the organizing committee.
        </p>

        <p className="text-sm text-[#6E6E6E] max-w-xl mx-auto mb-6">
          Inspired by the <a href="https://v0.app/templates/stack-attack-market-clash-wi1zVbwl7kq" target="_blank" rel="noreferrer" className="text-[#6E6E6E] hover:text-[#FFD600] underline">Stack Attack: Market Clash</a> design template from v0.app.
        </p>

        <div className="font-mono text-[10px] tracking-[0.2em] text-[#555555]">
          © {new Date().getFullYear()} REVERSE HACKATHON 2026 · <a href="#/admin" className="hover:text-[#FFD600]">admin</a>
        </div>
      </div>
    </footer>
  );
}