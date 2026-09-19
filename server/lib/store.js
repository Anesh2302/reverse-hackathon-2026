import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { aesDecrypt, aesEncrypt } from './security.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, 'data');
const KEY_FILE = path.join(DATA_DIR, '.store-key');

function fsExists(p) {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
}

let cachedKey = null;

export function storeKey() {
  if (cachedKey) return cachedKey;
  const envKey = process.env.STORE_KEY || process.env.SESSION_SECRET;
  if (envKey && envKey.trim()) {
    cachedKey = envKey.trim();
    return cachedKey;
  }
  if (fsExists(KEY_FILE)) {
    cachedKey = fs.readFileSync(KEY_FILE, 'utf8').trim();
    return cachedKey;
  }
  const key = `gen_${randomBytesHex(32)}`;
  cachedKey = key;
  try {
    fs.mkdirSync(DATA_DIR, { recursive: true });
    fs.writeFileSync(KEY_FILE, key, { mode: 0o600 });
  } catch {
    // Read-only serverless FS (Vercel/AWS) — hold key in-memory for this
    // runtime. Set STORE_KEY/SESSION_SECRET env for stability across cold starts.
  }
  return cachedKey;
}

function randomBytesHex(bytes) {
  return crypto.getRandomValues(new Uint8Array(bytes)).reduce(
    (acc, b) => acc + b.toString(16).padStart(2, '0'),
    ''
  );
}

// --- encrypted-at-rest generic JSON helpers ---
const STORE_CACHE = new Map(); // in-memory mirror — read-only FS (Vercel) stays alive in-session

export function readStore(name, fallback = []) {
  if (STORE_CACHE.has(name)) return STORE_CACHE.get(name);
  const file = path.join(DATA_DIR, `${name}.json`);
  if (!fsExists(file)) return fallback;
  try {
    const encrypted = fs.readFileSync(file, 'utf8');
    const decrypted = aesDecrypt(encrypted, storeKey());
    if (decrypted === null) return fallback;
    return JSON.parse(decrypted);
  } catch (err) {
    console.error(`[store] read failed for ${name}:`, err.message);
    return fallback;
  }
}

const STORE_CACHE = new Map(); // in-memory mirror for read-only (Vercel) FS — keeps timer/scores/uploads alive in-session

export function writeStore(name, data) {
  STORE_CACHE.set(name, data);
  const file = path.join(DATA_DIR, `${name}.json`);
  try {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const encrypted = aesEncrypt(JSON.stringify(data), storeKey());
    fs.writeFileSync(file, encrypted, { mode: 0o600 });
  } catch (err) {
    console.error(`[store] writeStore ${name} fs failed (${err.code}), kept in-memory`);
  }
}

// --- small file uploads (2MB cap) as encrypted at-rest blobs ---
const UPLOAD_DIR = path.join(DATA_DIR, 'uploads');
const UPLOAD_CACHE = new Map(); // in-memory mirror for read-only (Vercel/E) FS

export function saveUpload(id, base64Data, mimetype, originalName) {
  const meta = aesEncrypt(JSON.stringify({ mimetype, name: originalName }), storeKey());
  const blob = aesEncrypt(base64Data, storeKey());
  UPLOAD_CACHE.set(id, { meta: { mimetype, name: originalName }, data: base64Data });
  try {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    fs.writeFileSync(path.join(UPLOAD_DIR, `${id}.meta`), meta, { mode: 0o600 });
    fs.writeFileSync(path.join(UPLOAD_DIR, `${id}.bin`), blob, { mode: 0o600 });
  } catch (err) {
    console.error(`[store] upload fs write failed (${err.code}), kept in-memory`, id);
  }
}

export function getUpload(id) {
  const cached = UPLOAD_CACHE.get(id);
  if (cached) return cached;
  const metaPath = path.join(UPLOAD_DIR, `${id}.meta`);
  const binPath = path.join(UPLOAD_DIR, `${id}.bin`);
  if (!fsExists(metaPath) || !fsExists(binPath)) return null;
  try {
    const meta = JSON.parse(aesDecrypt(fs.readFileSync(metaPath, 'utf8'), storeKey()));
    const data = aesDecrypt(fs.readFileSync(binPath, 'utf8'), storeKey());
    return { ...meta, data: data || '' };
  } catch (err) {
    console.error('[store] upload read failed:', err.message);
    return null;
  }
}

export function deleteUpload(id) {
  const metaPath = path.join(UPLOAD_DIR, `${id}.meta`);
  const binPath = path.join(UPLOAD_DIR, `${id}.bin`);
  if (fsExists(metaPath)) fs.unlinkSync(metaPath);
  if (fsExists(binPath)) fs.unlinkSync(binPath);
}
