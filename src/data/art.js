// Central art manifest for "WHAT IF: Solar Hero vs Reactor Hero" system.
// Files live under public/art/ — export as WebP (PNG fallback optional).
// If a file is missing, <ArtImage> hides itself and the CSS gradient fallback shows,
// so the site never breaks before finals are generated.
//
// Midjourney v6.1 style tag (recommended — best ink + halftone):
//   comic book ink illustration, western graphic novel style, cel-shaded, dramatic cinematic lighting, halftone print texture, high detail, no text, no watermark --style raw --v 6.1
// Global consistency lock (append to every prompt):
//   consistent western comic-ink art direction, cinematic volumetric lighting, halftone texture, dramatic perspective, premium graphic-novel concept-art quality, original characters and environment, no existing superhero logos or costumes, no actor likeness

export const ART_STYLE_MJ =
  'comic book ink illustration, western graphic novel style, cel-shaded, dramatic cinematic lighting, halftone print texture, high detail, no text, no watermark --style raw --v 6.1';

export const ART_LOCK =
  'consistent western comic-ink art direction, cinematic volumetric lighting, halftone texture, dramatic perspective, premium graphic-novel concept-art quality, original characters and environment, no existing superhero logos or costumes, no actor likeness';

export const ART = {
  heroKey: {
    src: '/art/hero-key-16x9.webp',
    fallback: '/art/hero-key-16x9.png',
    alt: 'Original solar hero vs armored reactor hero colliding over a futuristic city',
    ratio: '16:9',
    use: 'Hero background, og:image',
  },
  heroStory: { src: '/art/hero-story-21x9.webp', alt: 'Both heroes facing off on ruined city street', ratio: '21:9', use: 'Story strip' },
  solarPortrait: { src: '/art/hero-solar-3x4.webp', alt: 'Solar-powered hero portrait, blue-white aura', ratio: '3:4', use: 'Faction / login' },
  reactorPortrait: { src: '/art/hero-reactor-3x4.webp', alt: 'Armored reactor hero portrait, red-gold rim light', ratio: '3:4', use: 'Faction / login' },
  vsPoster: { src: '/art/vs-poster-9x16.webp', alt: 'Solar vs Reactor vertical poster', ratio: '9:16', use: 'Event / mobile hero' },
  aboutBg: { src: '/art/about-21x9.webp', alt: 'Command center with 15 domain portals', ratio: '21:9', use: 'About background' },
  trainingBg: { src: '/art/training-16x9.webp', alt: 'Holographic training chambers', ratio: '16:9', use: 'HowItWorks background' },
  registerBg: { src: '/art/register-16x9.webp', alt: 'Registration terminal between heroes', ratio: '16:9', use: 'Registration side art' },
  dashboardBg: { src: '/art/dashboard-16x9.webp', alt: 'Command center dashboard backdrop', ratio: '16:9', use: 'Admin backdrop' },
  finaleBg: { src: '/art/finale-21x9.webp', alt: 'Both heroes together facing digital horizon', ratio: '21:9', use: 'Final CTA background' },
  notFound: { src: '/art/404-16x9.webp', alt: 'Hero flying through a broken digital portal', ratio: '16:9', use: '404 page' },
  denied: { src: '/art/403-16x9.webp', alt: 'Futuristic security gate with red holographic shield', ratio: '16:9', use: '403 page' },
  failure: { src: '/art/500-16x9.webp', alt: 'Damaged reactor core beside corrupted interface', ratio: '16:9', use: '500 page' },
};

// One entry per domain id in src/data/domains.js
export const DOMAIN_ART = {
  'ethical-hacking': '/art/domains/ethical-hacking-16x9.webp',
  'penetration-testing': '/art/domains/penetration-testing-16x9.webp',
  ctf: '/art/domains/ctf-16x9.webp',
  'digital-forensics': '/art/domains/digital-forensics-16x9.webp',
  reversing: '/art/domains/reverse-engineering-16x9.webp',
  cryptography: '/art/domains/cryptography-16x9.webp',
  'web-security': '/art/domains/web-security-16x9.webp',
  'network-security': '/art/domains/network-security-16x9.webp',
  'malware-analysis': '/art/domains/malware-analysis-16x9.webp',
  'binary-exploitation': '/art/domains/binary-exploitation-16x9.webp',
  osint: '/art/domains/osint-16x9.webp',
  'cloud-security': '/art/domains/cloud-security-16x9.webp',
  'incident-response': '/art/domains/incident-response-16x9.webp',
  'zero-day-hunting': '/art/domains/zero-day-16x9.webp',
  'quantum-crypto': '/art/domains/quantum-16x9.webp',
};

export const FACTION_ART = {
  arachnid: '/art/factions/arachnid-3x4.webp',
  bastion: '/art/factions/bastion-3x4.webp',
  reactor: '/art/factions/reactor-3x4.webp',
};

export const PANEL_ART = [
  '/art/panels/01-earth-cracks-4x3.webp',
  '/art/panels/02-solar-descent-4x3.webp',
  '/art/panels/03-reactor-activate-4x3.webp',
  '/art/panels/04-facility-doors-4x3.webp',
  '/art/panels/05-fifteen-portals-4x3.webp',
  '/art/panels/06-three-paths-4x3.webp',
  '/art/panels/07-operative-command-4x3.webp',
  '/art/panels/08-digital-battlefield-4x3.webp',
];

export const TIMELINE_ART = {
  registration: '/art/timeline/registration-4x3.webp',
  training: '/art/timeline/training-4x3.webp',
  chamber: '/art/timeline/chamber-4x3.webp',
  showdown: '/art/timeline/showdown-4x3.webp',
};
