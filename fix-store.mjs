import fs from 'node:fs';

const P = new URL('server/lib/store.js', import.meta.url);

// Load server/index.js to confirm it really has the guarded timer/score/export routes
const IX = new URL('server/index.js', import.meta.url).pathname;
const server = fs.readFileSync(IX, 'utf8');

// Find where DATA_DIR is defined and ensure DATA_DIR always exists (mkdir ignored if read-only)
const w = fs.readFileSync(P, 'utf8');

// 1) Declare + persist an in-memory STORE_CACHE that outlives writeStore failures
let out = w;

if (!out.includes('const STORE_CACHE = new Map();')) {
  out = out.replace(
    '// --- generic store layer (encrypted at-rest via AES-256-GCM, FAES) ---',
    '// --- generic store layer (encrypted at-rest via AES-256-GCM, FAES) ---\nconst STORE_CACHE = new Map(); // in-memory mirror (Vercel/E read-only FS): always keep latest in memory\n'
  );
}

// 2) readStore -> memory-first, fs fallback only (so timer/score reads don't throw on EROFS)
if (!out.includes('STORE_CACHE.get(name)')) {
  out = out.replace(
    'export function readStore(name, fallback = []) {',
    'export function readStore(name, fallback = []) {\n  const cached = STORE_CACHE.get(name);\n  if (cached !== undefined) return cached;'
  );
}

// 3) writeStore -> always set memory first, and wrap the fs write so EROFS never 500s the route
if (!out.includes('STORE_CACHE.set(name, data);')) {
  out = out.replace(
    'export function writeStore(name, data) {',
    'export function writeStore(name, data) {\n  STORE_CACHE.set(name, data); // memory-first: catched first by readStore'
  );
}

// Convert writeStore fs block to a guarded try (never throw, keep memory copy)
const writeStart = out.indexOf('export function writeStore(name, data) {');
if (writeStart !== -1) {
  const bodyStart = out.indexOf('{', writeStart);
  const bodyEnd = out.indexOf('}', bodyStart);
  if (bodyEnd !== -1) {
    const body = out.slice(bodyStart + 1, bodyEnd);
    if (!body.includes('try')) {
      const guarded = `${body}
  try {
    fs.mkdirSync(DATA_FILE_DIR, { recursive: true });
    fs.writeFileSync(file, encrypted, { mode: 0o600 });
  } catch (err) {
    console.error('[store] writeStore fs failed (' + err.code + '), kept in-memory only', name);
  }`;
      out = out.slice(0, bodyStart + 1) + guarded + out.slice(bodyEnd);
    }
  }
}

fs.mkdirSync('server/lib', { recursive: true });
fs.writeFileSync(P, out);
console.log('[fix] store.js — STORE_CACHE decl =', (out.match(/const STORE_CACHE = new Map\(\);/g) || []).length);
console.log('[fix] readStore memory-first =', out.includes('const cached = STORE_CACHE.get(name);'));
console.log('[fix] writeStore memory-set  =', out.includes('STORE_CACHE.set(name, data);'));
console.log('[fix] writeStore fs guarded  =', out.includes('kept in-memory only'));
console.log('[fix] server/index.js has export route =', server.includes('/api/admin/export'));
console.log('[fix] node-check store.js:');
