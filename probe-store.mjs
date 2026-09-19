import fs from 'node:fs';
const P = 'server/lib/store.js';
console.log('===== FULL REAL server/lib/store.js (byte-true, every line) =====');
const L = fs.readFileSync(P, 'utf8').split(/\r?\n/);
L.forEach((line, i) => console.log(String(i + 1).padStart(3) + '| ' + line));
console.log('\n=== END store.js (' + L.length + ' lines) ===');
