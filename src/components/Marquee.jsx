const BRANDS = [
  { name: 'TryHackMe', ms: '08ms', node: '11' },
  { name: 'HackTheBox', ms: '10ms', node: '03' },
  { name: 'PortSwigger', ms: '12ms', node: '07' },
  { name: 'picoCTF', ms: '14ms', node: '09' },
  { name: 'pwn.college', ms: '09ms', node: '02' },
  { name: 'CryptoHack', ms: '11ms', node: '14' },
  { name: 'CyberChef', ms: '07ms', node: '05' },
  { name: 'Crackmes', ms: '13ms', node: '01' },
  { name: 'Ghidra', ms: '08ms', node: '12' },
  { name: 'Wireshark', ms: '12ms', node: '06' },
  { name: 'LetsDefend', ms: '15ms', node: '08' },
  { name: 'OSINT Framework', ms: '10ms', node: '13' },
  { name: 'CloudGoat', ms: '16ms', node: '04' },
  { name: 'OverTheWire', ms: '09ms', node: '10' },
  { name: 'Exploit Education', ms: '13ms', node: '15' },
];

export default function Marquee() {
  return (
    <div className="relative border-y border-[#111E34] bg-[#0A0203] py-4 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-[0.05]" />
      <div className="relative z-10 flex overflow-hidden">
        <div className="marquee-track flex shrink-0 items-center whitespace-nowrap font-mono text-xs uppercase tracking-[0.22em]">
          {[...Array(3)].map((_, dup) => (
            <span key={dup} className="flex shrink-0 items-center" aria-hidden={dup > 0}>
              {BRANDS.map((b, i) => (
                <span key={b.name} className="mx-7 flex items-center gap-7 text-[#1A0A0A]">
                  <span className="text-[#1A0A0A]">{21 + Math.floor(i / 3)}:{String((i * 13) % 60).padStart(2, '0')}</span>
                  <span className="text-[#1C0A0A]">▣</span>
                  <span>edge:{String(b.node).padStart(2, '0')} · {b.name.toLowerCase().replace(/[^a-z0-9]+/g, '_')}</span>
                  <span className="text-[#4A3D3F]">{b.ms} </span>
                  <span className="text-[#1A0A0A]">·</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}