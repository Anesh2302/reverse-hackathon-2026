import fs from 'node:fs';

const ROOT = process.env.RH_ROOT || 'D:\\simonpeter\\ReverseHack2k26';

// ---------- 1) store.js: collapse duplicate STORE_CACHE decl (any count -> exactly one) ----------
const sp = `${ROOT}\\server\\lib\\store.js`;
let s = fs.readFileSync(sp, 'utf8');
const before = (s.match(/const STORE_CACHE = new Map\(\);/g) || []).length;
s = s.replace(/const STORE_CACHE = new Map\(\);(\r?\n)+/g, (m) => (m.startsWith('const STORE_CACHE') ? '' : m));
// simpler: drop all, add exactly one before readStore
s = s.replace(/const STORE_CACHE = new Map\(\);[\s\S]*?export function readStore/, 'export function readStore');
if (!s.includes('const STORE_CACHE = new Map();')) {
  s = s.replace('export function readStore(name, fallback = []) {', 'const STORE_CACHE = new Map();\n\nexport function readStore(name, fallback = []) {');
}
const after = (s.match(/const STORE_CACHE = new Map\(\);/g) || []).length;
fs.writeFileSync(sp, s);
console.log(`store.js: STORE_CACHE decl ${before} -> ${after}`);
console.log(`memory-first read  = ${s.includes('STORE_CACHE.get(name);')}`);
console.log(`memory-first write = ${s.includes('STORE_CACHE.set(name, data);')}`);

// ---------- 2) Hero.jsx: REVERSEHACKATHLON -> ONE line ----------
const hp = `${ROOT}\\src\\components\\Hero.jsx`;
let h = fs.readFileSync(hp, 'utf8');
let hh = h;

// do the heading-level replacement regardless of exact surrounding whitespace
const restore = (r) => new Promise((ok) => {});
const single = (t) => t
  .replace(/<\s*span\s[^>]*>(REVERSE|REVERSE\s?HACK)\s*<\s*\/\s*span\s*>\s*<\s*span\s[^>]*>\s*(HACKATHLON|ATHLON)\s*<\s*\/\s*span\s*>/g, '<span className="block whitespace-nowrap text-center">REVERSEHACKATHLON</span>')
  .replace(/<\s*span\s[^>]*>\s*REVERSE\s*<\s*\/\s*span\s*>\s*<\s*span\s[^>]*>\s*HACK\s*<\s*\/\s*span\s*>/g, '<span className="block whitespace-nowrap text-center">REVERSEHACK</span>')
  .replace(/REVERSEHACKATHLON(\s*)+<\/h1>/g, 'REVERSEHACKATHLON</h1>');
hh = single(h);
// if nothing matched, do a comment-mark anchor dump for the next pass
const changed = hh !== h;
fs.writeFileSync(hp, hh);
console.log(`Hero.jsx one-line = ${changed}  (still-linebroken=${/REVERSE\s*<\s*\/span[^>]*>[\s\S]{0,80}HACK/.test(hh)})`);

// ---------- 3) report ready for lint/build ----------
const chk = `${ROOT}\\server\\lib\\store.js`;
try { new Function() } catch {}
console.log('done. next: node --check + lint + build via runner.');
