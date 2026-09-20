// dw-bluesweep.cjs — cast out the LAST two CA-blue tokens (#01338E royal azure,
// #36405A steel-blue) from every spot they still live, replacing with the DW
// chrome-yellow / hot-red / red-black family. Byte-level, role-agnostic per file.
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

// exact token -> replacement, scoped per file so semantics stay intentional
const PLAN = {
  'src/components/Admin.jsx': {
    // stat-card accent bars
    "'#01338E'": "'#F2B705'", // chrome yellow
    "'#36405A'": "'#D9261E'", // hot red
  },
  'src/components/ChatBot.jsx': {
    // chatbot chrome borders (muted maroon-red, keeps red-black canvas)
    'border-[#36405A]': 'border-[#472020]',
    "bg-[#0A0203]": "bg-[#0A0203]",
  },
  'src/components/Emblems.jsx': {
    // shield emblem defaults: royal->chrome, steel->hot red, ink->red-black
    "#01338E": "#F2B705",
    "#36405A": "#D9261E",
    "#050B1F": "#120203",
  },
  'src/components/Hero.jsx': {
    // status-marker labels + pill borders + pulse
    "'#36405A'": "'#E8A507'",
    'border-[#36405A]/40': 'border-[#E8A507]/40',
    'bg-[#36405A]': 'bg-[#E8A507]',
  },
  'src/components/HowItWorks.jsx': {
    "'#36405A'": "'#D9261E'", // hot red accents
  },
  'src/components/Stats.jsx': {
    "'#36405A'": "'#F2B705'", // chrome-yellow accent chips
  },
  'src/data/domains.js': {
    // domain swatch colours: azure->chrome, steel->hot red
    "color: '#01338E'": "color: '#F2B705'",
    "color: '#36405A'": "color: '#D9261E'",
    "accent: '#36405A'": "accent: '#E8A507'",
    "accent: '#01338E'": "accent: '#D9261E'",
  },
};

const touched = [];
for (const [rel, map] of Object.entries(PLAN)) {
  const f = path.join(ROOT, rel);
  if (!fs.existsSync(f)) {
    console.log('SKIP missing: ' + rel);
    continue;
  }
  let src = fs.readFileSync(f, 'utf8');
  let changed = false;
  for (const [from, to] of Object.entries(map)) {
    const n = src.split(from).length - 1;
    if (n > 0) {
      src = src.split(from).join(to);
      changed = true;
      console.log('  ' + rel + ' :: ' + n + 'x  ' + from + ' -> ' + to);
    }
  }
  if (changed) {
    // count remaining blue tokens after remap before writing
    const left = (src.match(/#01338E|#36405A/gi) || []).length;
    fs.writeFileSync(f, src);
    touched.push(rel + (left ? '  [left=' + left + ']' : ''));
  }
}
console.log('BLUE-SWEPT-FILES: ' + touched.length);
touched.forEach((x) => console.log('  TOUCHED ' + x));
console.log('DONE-BLUE-SWEEP');
