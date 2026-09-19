const BRANDS = [
  'TryHackMe',
  'Hack The Box',
  'PortSwigger',
  'picoCTF',
  'pwn.college',
  'CryptoHack',
  'CyberChef',
  'Crackmes',
  'Ghidra',
  'Wireshark',
  'LetsDefend',
  'OSINT Framework',
  'CloudGoat',
  'OverTheWire',
  'Exploit Education',
];

export default function Marquee() {
  return (
    <div className="relative border-y border-[#26272e] bg-[#0d0e11] py-4 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-20" />
      <div className="relative z-10 flex overflow-hidden">
        <div className="marquee-track flex shrink-0 items-center whitespace-nowrap font-mono text-xs tracking-[0.22em]">
          {[...Array(3)].map((_, dup) => (
            <span key={dup} className="flex shrink-0 items-center" aria-hidden={dup > 0}>
              {BRANDS.map((b, i) => (
                <span key={b} className="mx-7 flex items-center gap-7 text-[#8d90a3]">
                  <span className="text-[#ffc53d]">{21 + Math.floor(i / 3)}:{String((i * 13) % 60).padStart(2, '0')}</span>
                  <span>b_{b.toLowerCase().replace(/[^a-z0-9]+/g, '_')}</span>
                  <span className="text-[#ffd34d]">·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}