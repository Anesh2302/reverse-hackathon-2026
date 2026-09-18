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
    <div className="relative border-y border-[#e03131]/20 bg-[#efe9d9] py-5 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-20" />
      <div className="relative z-10 flex overflow-hidden">
        <div className="marquee-track flex shrink-0 items-center whitespace-nowrap font-mono text-sm tracking-[0.3em]">
          {[...Array(2)].map((_, dup) => (
            <span key={dup} className="flex shrink-0 items-center" aria-hidden={dup === 1}>
              {BRANDS.map((b) => (
                <span key={b} className="mx-8 flex items-center gap-8 text-[#6d6455]">
                  {b}
                  <span className="text-[#e03131]">✦</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}