import ArtImage from './ArtImage';
import { ART } from '../data/art';

const KINDS = {
  404: { art: () => ART.notFound.src, alt: ART.notFound.alt, code: '404', title: 'DIMENSION NOT FOUND', desc: 'The portal you reached for does not exist in this runtime. The board remains intact.' },
  403: { art: () => ART.denied.src, alt: ART.denied.alt, code: '403', title: 'CLEARANCE DENIED', desc: 'Your credentials do not unlock this gate. Fall back and re-authenticate.' },
  500: { art: () => ART.failure.src, alt: ART.failure.alt, code: '500', title: 'SYSTEM FAILURE', desc: 'The reactor faulted mid-cycle. Engineers have been paged — retry shortly.' },
};

export default function ErrorState({ kind = 404 }) {
  const k = KINDS[kind] || KINDS[404];
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#061228] px-5 text-center">
      <div className="pointer-events-none absolute inset-0">
        <ArtImage src={k.art()} alt={k.alt} opacity={0.4} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#061228]/70 via-[#061228]/50 to-[#061228]" />
        <div className="absolute inset-0 grid-overlay opacity-[0.04]" />
      </div>
      <div className="relative z-10 max-w-lg">
        <div className="font-display text-7xl md:text-8xl font-black text-[#DFECF4]" style={{ textShadow: '0 0 40px rgba(218,43,54,0.35)' }}>
          {k.code}
        </div>
        <h1 className="mt-3 font-display text-2xl md:text-3xl font-bold uppercase text-[#DFECF4]">{k.title}</h1>
        <p className="mt-4 font-mono text-sm text-[#8CA7CC]">{k.desc}</p>
        <a href="#top" className="btn-neon mt-8 inline-flex">Return to base</a>
      </div>
    </div>
  );
}
