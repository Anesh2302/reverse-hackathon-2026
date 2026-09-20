// CA re-theme: navy-black canvas + bright azure/royal/steel/white/copper accents
// Role-aware: bg-[..]/surface -> navy canvas, text-[..] -> chalk/azure, border -> steel.
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

const esc = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// value helper: pick target by css role
const ROLE = {
  // canvas -> navy-black / steel-navy surfaces
  '#160407': { sf: '#070B17', ln: '#101A30', tx: '#FBFCFE' },
  '#180507': { sf: '#05070F', ln: '#0B1320', tx: '#FBFCFE' },
  '#140407': { sf: '#05070F', ln: '#0B1320', tx: '#FBFCFE' },
  '#0D0D0D': { sf: '#070B17', ln: '#0E1626', tx: '#8CA0C3' },
  '#111111': { sf: '#0A1220', ln: '#12203A', tx: '#8CA0C3' },
  '#121212': { sf: '#0A1220', ln: '#12203A', tx: '#8CA0C3' },
  '#141414': { sf: '#0B1424', ln: '#142442', tx: '#8CA0C3' },
  '#151515': { sf: '#0B1424', ln: '#142442', tx: '#8CA0C3' },
  '#171717': { sf: '#0C1626', ln: '#162845', tx: '#8CA0C3' },
  '#1A1A1A': { sf: '#0E182A', ln: '#182C4C', tx: '#A9B8D4' },
  '#1B1B1B': { sf: '#0E182A', ln: '#182C4C', tx: '#A9B8D4' },
  '#1E1E1E': { sf: '#0F1A2E', ln: '#1A3050', tx: '#A9B8D4' },
  '#1F1F1F': { sf: '#0F1A2E', ln: '#1A3050', tx: '#A9B8D4' },
  '#202020': { sf: '#101C30', ln: '#1C3254', tx: '#A9B8D4' },
  '#222222': { sf: '#111E34', ln: '#1E3658', tx: '#A9B8D4' },
  '#232323': { sf: '#111E34', ln: '#1E3658', tx: '#A9B8D4' },
  '#242424': { sf: '#122038', ln: '#203A5E', tx: '#A9B8D4' },
  '#252525': { sf: '#122038', ln: '#203A5E', tx: '#A9B8D4' },
  '#262626': { sf: '#13223C', ln: '#223E64', tx: '#A9B8D4' },
  '#2A2A2A': { sf: '#15263F', ln: '#244264', tx: '#A9B8D4' },
  '#2E2E2E': { sf: '#172A48', ln: '#2A4A70', tx: '#A9B8D4' },
  '#303030': { sf: '#182C4C', ln: '#2C4E78', tx: '#B4C0D8' },
  '#343434': { sf: '#1A3054', ln: '#325A88', tx: '#B4C0D8' },
  '#383838': { sf: '#1C3460', ln: '#386698', tx: '#B4C0D8' },
  '#3A3939': { sf: '#1D3664', ln: '#3A6898', tx: '#B4C0D8' },
  '#202327': { sf: '#101C30', ln: '#1C3254', tx: '#A9B8D4' },
  '#2A2D31': { sf: '#15263F', ln: '#244264', tx: '#A9B8D4' },
  '#111827': { sf: '#0A1220', ln: '#12203A', tx: '#8CA0C3' },
  '#0B1120': { sf: '#070B17', ln: '#0E1626', tx: '#8CA0C3' },
  '#0B0F17': { sf: '#070B17', ln: '#0E1626', tx: '#8CA0C3' },

  // raspberry/maroon leftovers -> navy/steel
  '#1C0709': { sf: '#101A30', ln: '#16243F', tx: '#FBFCFE' },
  '#20080A': { sf: '#101A30', ln: '#16243F', tx: '#FBFCFE' },
  '#20090B': { sf: '#101A30', ln: '#182A48', tx: '#FBFCFE' },
  '#22080A': { sf: '#121C34', ln: '#1A2C4C', tx: '#FBFCFE' },
  '#22090B': { sf: '#121C34', ln: '#1A2C4C', tx: '#FBFCFE' },
  '#24090B': { sf: '#14203C', ln: '#1E345A', tx: '#FBFCFE' },
  '#320A0C': { sf: '#182440', ln: '#2A4468', tx: '#FBFCFE' },
  '#300A0D': { sf: '#182440', ln: '#2A4468', tx: '#FBFCFE' },
  '#30090C': { sf: '#182440', ln: '#2A4468', tx: '#FBFCFE' },
  '#3A0D10': { sf: '#1A2A48', ln: '#2E4C72', tx: '#FBFCFE' },
  '#4A0F12': { sf: '#1E3660', ln: '#3A64A0', tx: '#FBFCFE' },
  '#4A0F11': { sf: '#1E3660', ln: '#3A64A0', tx: '#FBFCFE' },
  '#521114': { sf: '#223E68', ln: '#4876B8', tx: '#FBFCFE' },
  '#521213': { sf: '#223E68', ln: '#4876B8', tx: '#FBFCFE' },
  '#581014': { sf: '#2A4A74', ln: '#5484C8', tx: '#FBFCFE' },

  // ---- hero legible accents on black -> CA brights ----
  '#D94015': { sf: '#C75C35', ln: '#C75C35', tx: '#FBFCFE' },   // chrome red -> copper
  '#E84A1B': { sf: '#C75C35', ln: '#C75C35', tx: '#FBFCFE' },
  '#A10704': { sf: '#8A4A28', ln: '#8A4A28', tx: '#FBFCFE' },  // deep red -> deep copper
  '#6C0402': { sf: '#5E3A22', ln: '#5E3A22', tx: '#FBFCFE' },
  '#F0D5D2': { sf: '#EAF1FB', ln: '#C7D6EE', tx: '#101A30' },  // chalk -> pale azure-white
  '#F0D5D5': { sf: '#EAF1FB', ln: '#C7D6EE', tx: '#101A30' },
  '#EFC7C2': { sf: '#EAF1FB', ln: '#C7D6EE', tx: '#101A30' },
  '#E3BBB5': { sf: '#EAF1FB', ln: '#C7D6EE', tx: '#101A30' },
  '#5E5052': { sf: '#465066', ln: '#5B6B8C', tx: '#8CA0C3' },  // warm muted -> steel
  '#5E4F52': { sf: '#465066', ln: '#5B6B8C', tx: '#8CA0C3' },
  '#8F7E81': { sf: '#6A7690', ln: '#8CA0C3', tx: '#B4C0D8' },
  '#9C8B8E': { sf: '#7A86A0', ln: '#9FB0CC', tx: '#C7D6EE' },
  '#A89699': { sf: '#8C98B4', ln: '#B4C0D8', tx: '#DCE6F8' },
  '#A08F92': { sf: '#8C98B4', ln: '#B4C0D8', tx: '#DCE6F8' },
  // -- azure / royal accents --
  '#031C5B': { sf: '#01338E', ln: '#095EE4', tx: '#FBFCFE' },
  '#28437A': { sf: '#01338E', ln: '#095EE4', tx: '#FBFCFE' },
  '#435C82': { sf: '#36405A', ln: '#5B6B8C', tx: '#EAF1FB' },
  '#55668F': { sf: '#36405A', ln: '#5B6B8C', tx: '#EAF1FB' },

  // css variable endpoints (filled for css pass by name)
};

const FILES = [];
function walk(dir) {
  const real = path.join(ROOT, dir);
  if (!fs.existsSync(real)) return;
  for (const e of fs.readdirSync(real, { withFileTypes: true })) {
    const p = path.join(real, e.name);
    const rel = path.join(dir, e.name);
    if (e.isDirectory()) {
      if (!['node_modules', '.vite', 'dist'].includes(e.name)) walk(rel);
    } else if (/\.(jsx?|css|html|svg)$/i.test(e.name)) FILES.push(rel);
  }
}
walk('src');
['index.html'].forEach((f) => { if (fs.existsSync(path.join(ROOT, f))) FILES.push(f); });
if (fs.existsSync(path.join(ROOT, 'public', 'favicon.svg'))) FILES.push(path.join('public', 'favicon.svg'));

const touched = [];

for (const rel of FILES) {
  const f = path.join(ROOT, rel);
  let c = fs.readFileSync(f, 'utf8');
  const orig = c;
  const isSvg = /\.svg$/i.test(rel);
  for (const [h, v] of Object.entries(ROLE)) {
    const q = esc(h);
    // 1) tailwind arbitrary tokens
    c = c.replace(new RegExp('(bg|border)-\\[' + q + '\\]', 'g'), (m, r) => r + '-[' + v.sf + ']');
    c = c.replace(new RegExp('(text|ring|from|to|via|fill|stroke)-\\[' + q + '\\]', 'g'), (m, r) => r + '-[' + (r === 'fill' || r === 'stroke' ? v.sf : v.tx) + ']');
    // 2) css var values & plain declarations (keep svg fills explicit)
    if (isSvg) {
      c = c.replace(new RegExp('(fill|stroke)="' + q + '"', 'g'), (m, r) => r + '="' + (r === 'fill' ? v.sf : v.sf) + '"');
    } else {
      c = c.replace(new RegExp(q, 'gi'), v.sf);
    }
  }
  if (c !== orig) { fs.writeFileSync(f, c, 'utf8'); touched.push(rel); }
}

console.log('TOUCHED-CA (files):');
touched.forEach((t) => console.log('  ' + t));
console.log('DONE-CA-THEME');
