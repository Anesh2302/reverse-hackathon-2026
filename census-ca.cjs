// CENSUS: any CA/azuré key-hex still present in the tree? (DW pass should have removed them)
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();

// The CA azure/royal/navy key family that DW remaps to chrome-yellow/hot-red.
const Keys = [
  '#070B17', '#05070F', '#0D1220', '#0B1122', '#1B2338', '#101828', '#111827',
  '#0F172A', '#1E293B', '#0B1121', '#0D1117', '#0B0F19', '#0C111A', '#0A0F1C',
  '#01338E', '#095EE4', '#0138A8', '#01235B', '#0A2A6E', '#031C5B', '#01319B',
  '#032A6E', '#0B3E9E', '#28437A', '#36405A', '#3B4A6B', '#435C82', '#57678F',
  '#6B7FA0', '#7C8FB0', '#8CA0C3', '#A9B8D4', '#B6C4DE', '#C7D6EC', '#DCESF6',
  '#E3EEFA', '#0A1749', '#060F33', '#040C26', '#0B3A7F', '#0E3B9E'
];

const FILES = [];
function walk(dir) {
  const abs = path.join(ROOT, dir);
  if (!fs.existsSync(abs)) return;
  for (const e of fs.readdirSync(abs, { withFileTypes: true })) {
    const p = path.join(abs, e.name);
    if (e.isDirectory()) {
      if (!['node_modules', '.vite', 'dist'].includes(e.name)) walk(path.join(dir, e.name));
    } else if (/\.(jsx?|css|svg|html)$/i.test(e.name)) {
      FILES.push(path.join(dir, e.name));
    }
  }
}
walk('src');
if (fs.existsSync(path.join(ROOT, 'index.html'))) FILES.push('index.html');
if (fs.existsSync(path.join(ROOT, 'public', 'favicon.svg'))) FILES.push(path.join('public', 'favicon.svg'));

const L = new Set();
for (const rel of FILES) {
  const f = path.join(ROOT, rel);
  let c = fs.readFileSync(f, 'utf8');
  const upper = c.toUpperCase();
  for (const k of Keys) {
    const u = k.toUpperCase();
    // skip if this key is only inside a translated token already blocked? just flag raw hex presence
    // but ignore the DW output mapping table if any tool file copied in — src only, so fine
  }
  for (const k of Keys) {
    const q = k.toUpperCase();
    if (upper.includes(q)) {
      // find roles
      const roles = new Set();
      for (const r of ['bg', 'border', 'text', 'ring', 'from', 'to', 'via', 'fill', 'stroke']) {
        if (upper.includes(r + '-[' + q + ']')) roles.add(r);
      }
      L.add(rel + ' :: ' + k + ' :: ' + (roles.size ? [...roles].join(',') : 'plain-embed'));
    }
  }
}
const arr = [...L];
console.log('CA-LEFT (' + arr.length + '):');
arr.forEach((x) => console.log('  ' + x));
console.log('DONE-CENSUS');
