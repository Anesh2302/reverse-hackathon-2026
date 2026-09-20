// DW (Deadpool & Wolverine) re-theme — overwrite of the CA harness with DW anchors.
// Role-aware: bg-[#..]/border-[#..] -> DW surfaces/lines, text-[#..] -> DW pigments.
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// CA anchors now in tree -> DW { sf: surface, ln: line, tx: pigment }
const MAP = {
  // canvas family (navy-black -> DW red-black)
  '#070B17': { sf: '#0A0203', ln: '#2E0C0C', tx: '#FBFCFE' },
  '#05070F': { sf: '#050103', ln: '#280A0A', tx: '#FBFCFE' },
  '#0D1220': { sf: '#120404', ln: '#3A1010', tx: '#FBFCFE' },
  '#0A0E1C': { sf: '#0C0303', ln: '#300B0B', tx: '#FBFCFE' },
  '#090C18': { sf: '#0B0303', ln: '#2C0A0A', tx: '#FBFCFE' },
  '#0F1526': { sf: '#140505', ln: '#401212', tx: '#FBFCFE' },

  // lines / ink
  '#1B2338': { sf: '#241112', ln: '#241112', tx: '#FBFCFE' },
  '#1B2338': { sf: '#241112', ln: '#241112', tx: '#FBFCFE' },
  '#101A30': { sf: '#170707', ln: '#452828', tx: '#FBFCFE' },

  // chrome-yellow -> halftone yellow (the DW poster pigment)
  '#095EE4': { sf: '#F2B705', ln: '#D99205', tx: '#1A0A00' },
  '#01338E': { sf: '#D9A006', ln: '#C98905', tx: '#1A0A00' },
  '#052B7C': { sf: '#C99E08', ln: '#B8860B', tx: '#1A0A00' },
  '#0A3A9E': { sf: '#F2C005', ln: '#D9A006', tx: '#1A0A00' },

  // hot red accents
  '#C75C35': { sf: '#D9261E', ln: '#B01713', tx: '#FFF3EC' },
  '#A10704': { sf: '#C21D16', ln: '#8A0A04', tx: '#FFF3EC' },
  '#5E2A28': { sf: '#7E120D', ln: '#5A0A06', tx: '#FFF3EC' },

  // muted/steel -> dusty red-gray
  '#8CA0C3': { sf: '#A98A86', ln: '#C0AAA6', tx: '#2A0A0A' },
  '#A9B8D4': { sf: '#C0ACA8', ln: '#D8C6C2', tx: '#2A0A0A' },
  '#C7D6EE': { sf: '#D9C8C4', ln: '#E6D8D4', tx: '#2A0A0A' },
  '#EAF1FB': { sf: '#EFE2DE', ln: '#F4E8E4', tx: '#1C0A0A' },
  '#FBFCFE': { sf: '#FBFCFE', ln: '#F0F4F8', tx: '#1A0A0A' },
};

const FILES = [];
function walk(dir) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const p = path.join(abs, e.name);
    if (e.isDirectory()) {
      if (!['node_modules', '.vite', 'dist'].includes(e.name)) walk(path.join(dir, e.name));
    } else if (/\.(jsx?|js|css|html|svg)$/i.test(e.name)) FILES.push(path.join(dir, e.name));
  }
}
walk('src');
['index.html'].forEach((f) => { if (fs.existsSync(path.join(ROOT, f))) FILES.push(f); });

const touched = [];
for (const rel of FILES) {
  const f = path.join(ROOT, rel);
  let c = fs.readFileSync(f, 'utf8');
  const orig = c;
  const isSvg = /\.svg$/i.test(rel);
  for (const [h, v] of Object.entries(MAP)) {
    const q = esc(h);
    // bg-[#..] / border-[#..] -> surface/line
    c = c.replace(new RegExp('(bg|border)-\\[' + q + '\\]', 'g'), (m, r) => r + '-[' + (r === 'border' ? v.ln : v.sf) + ']');
    // text-[#..] / fill / stroke -> pigment
    c = c.replace(new RegExp('(text|fill|stroke|ring|from|to|via)-\\[' + q + '\\]', 'g'), (m) => m.replace('[' + q + ']', '[' + (isSvg ? v.sf : v.tx) + ']'));
    if (isSvg) c = c.replace(new RegExp('(fill|stroke)="' + q + '"', 'g'), (m, r) => r + '="' + v.sf + '"');
  }
  if (c !== orig) {
    fs.writeFileSync(f, c, 'utf8');
    touched.push(rel);
  }
}

// css var remap (index.css :root)
for (const f of ['src/index.css']) {
  const abs = path.join(ROOT, f);
  if (!fs.existsSync(abs)) continue;
  let c = fs.readFileSync(abs, 'utf8');
  const orig = c;
  for (const [k, v] of Object.entries({
    '--bg': '#0A0203', '--bg-deep': '#050103', '--paper': '#120404',
    '--ink': '#170707', '--ink-line': '#241112', '--line': '#241112',
    '--red': '#D9261E', '--blue': '#F2B705', '--accent': '#F2B705',
    '--accent-deep': '#D99205', '--danger': '#D9261E',
    '--green': '#7E120D', '--muted': '#A98A86', '--muted-2': '#C0ACA8',
    '--grad-pop': 'linear-gradient(90deg, #F2B705 0%, #D9261E 50%, #8A0A04 100%)',
    '--glow-red': '0 0 26px rgba(217, 38, 30, 0.32)',
    '--glow-blue': '0 0 26px rgba(242, 183, 5, 0.30)',
    '--glow-green': '0 0 26px rgba(126, 18, 13, 0.45)',
  })) {
    c = c.replace(new RegExp('(' + esc(k) + '):\\s*[^;]+'), '$1: ' + v);
  }
  if (c !== orig) { fs.writeFileSync(abs, c, 'utf8'); touched.push(f); }
}

console.log('TOUCHED-DW:');
touched.forEach((t) => console.log('  ' + t));
console.log('DONE-DW-THEME');
