import { EVENT } from '../data/domains';
import Reveal from './Reveal';
import CapShield from './CapShield';

const SOCIALS = [
  { name: 'Discord', icon: '💬' },
  { name: 'Instagram', icon: '📸' },
  { name: 'LinkedIn', icon: '💼' },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-[#1A3A6E] bg-[#061228] overflow-hidden">
      {/* Top gradient line */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#DA2B36] to-transparent opacity-50" />

      <div className="pointer-events-none absolute inset-0">
        <div className="absolute inset-0 grid-overlay opacity-[0.03]" />
      </div>

      <div className="relative z-10 mx-auto max-w-6xl px-5 py-16 md:py-20">
        <Reveal>
          <div className="flex flex-col items-center text-center">
            {/* Shield */}
            <div className="mb-6 opacity-30">
              <CapShield size={60} glow={false} interactive={false} />
            </div>

            {/* Logo */}
            <div className="mb-2 font-display text-3xl md:text-4xl font-black tracking-wide">
              <span className="text-[#DFECF4]">REVERSE</span>{' '}
              <span className="text-[#DFECF4]">HACKATHON</span>
            </div>
            <div className="font-mono text-xs tracking-[0.3em] text-[#8CA7CC] mb-8">{EVENT.dateLabel} · LEDGER CLOSED 07:00</div>

            {/* Socials */}
            <div className="mb-8 flex justify-center gap-3">
              {SOCIALS.map((s) => (
                <a
                  key={s.name}
                  href="#top"
                  className="group flex items-center gap-2 rounded-xl glass-card px-5 py-2.5 font-mono text-xs tracking-[0.2em] text-[#DFECF4] transition-all duration-300 hover:border-[#DA2B36]"
                >
                  <span className="text-sm group-hover:scale-110 transition-transform">{s.icon}</span>
                  {s.name.toUpperCase()}
                </a>
              ))}
            </div>

            {/* Divider */}
            <div className="w-full max-w-md h-[1px] bg-gradient-to-r from-transparent via-[#1A3A6E] to-transparent mb-8" />

            {/* Links */}
            <div className="flex flex-wrap justify-center gap-6 mb-8 font-mono text-xs tracking-[0.15em]">
              <a href="#top" className="text-[#8CA7CC] hover:text-[#DFECF4] transition-colors">HOME</a>
              <a href="#about" className="text-[#8CA7CC] hover:text-[#DFECF4] transition-colors">ABOUT</a>
              <a href="#domains" className="text-[#8CA7CC] hover:text-[#DFECF4] transition-colors">DOMAINS</a>
              <a href="#register" className="text-[#8CA7CC] hover:text-[#DFECF4] transition-colors">REGISTER</a>
              <a href="#faq" className="text-[#8CA7CC] hover:text-[#DFECF4] transition-colors">FAQ</a>
              <a href="#/admin" className="text-[#8CA7CC] hover:text-[#DFECF4] transition-colors">ADMIN</a>
            </div>

            {/* Credits */}
            <p className="text-xs text-[#8CA7CC] max-w-xl mx-auto mb-8 leading-relaxed">
              Built by <span className="text-[#DFECF4] font-semibold">Simon Peter</span> from <span className="text-[#DFECF4] font-semibold">SRM VEC</span>
            </p>

            {/* Copyright */}
            <div className="font-mono text-[10px] tracking-[0.2em] text-[#5A6A8A]">
              © {new Date().getFullYear()} REVERSE HACKATHON 2026
            </div>
          </div>
        </Reveal>
      </div>
    </footer>
  );
}
