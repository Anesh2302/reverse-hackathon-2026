import {
  createCipheriv,
  createDecipheriv,
  createHash,
  createHmac,
  randomBytes,
  scryptSync,
  timingSafeEqual,
} from 'node:crypto';

const KDF_N = 16384;
const KDF_R = 8;
const KDF_P = 1;
const KEY_LEN = 64;

export function randomHex(bytes = 16) {
  return randomBytes(bytes).toString('hex');
}

// --- scrypt password hashing (zero deps) ---
export function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(String(password), salt, KEY_LEN, { N: KDF_N, r: KDF_R, p: KDF_P }).toString('hex');
  return `scrypt$${KDF_N}$${KDF_R}$${KDF_P}$${salt}$${hash}`;
}

export function verifyPassword(password, stored) {
  if (!stored || typeof stored !== 'string') return false;
  const parts = String(stored).split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') return false;
  const [, nStr, rStr, pStr, salt, hashHex] = parts;
  const n = Number(nStr);
  const r = Number(rStr);
  const p = Number(pStr);
  try {
    const candidate = scryptSync(String(password), salt, KEY_LEN, { N: n, r, p }).toString('hex');
    return timingSafeEqual(Buffer.from(candidate, 'hex'), Buffer.from(hashHex, 'hex'));
  } catch {
    return false;
  }
}

// --- stateless HMAC-signed session token ---
export function signSession(payload, secret, ttlSec = 60 * 60 * 12) {
  const body = Buffer.from(JSON.stringify(payload), 'utf8').toString('base64url');
  const sig = createHmac('sha256', secret).update(body).digest('base64url');
  const exp = Math.floor(Date.now() / 1000) + ttlSec;
  return `${body}.${sig}.${exp}`;
}

export function verifySession(token, secret) {
  if (typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;
  const [body, sig, expStr] = parts;
  const exp = Number(expStr);
  if (!Number.isFinite(exp) || exp * 1000 < Date.now()) return null;
  const expected = createHmac('sha256', secret).update(body).digest('base64url');
  const a = Buffer.from(sig, 'base64url');
  const b = Buffer.from(expected, 'base64url');
  if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  try {
    return JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
  } catch {
    return null;
  }
}

// --- AES-256-GCM at-rest encryption helpers ---
function deriveKeyMaterial(secret) {
  const raw = String(secret || '').trim();
  if (!raw) throw new Error('Missing encryption key. Set STORE_KEY or SESSION_SECRET.');
  if (raw.length === 64 && /^[0-9a-f]{64}$/i.test(raw)) return Buffer.from(raw, 'hex');
  return createHash('sha256').update(raw).digest();
}

export function aesEncrypt(plaintext, key) {
  const iv = randomBytes(12);
  const cipher = createCipheriv('aes-256-gcm', deriveKeyMaterial(key), iv);
  const encrypted = Buffer.concat([cipher.update(String(plaintext), 'utf8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `gcm$${iv.toString('base64url')}$${tag.toString('base64url')}$${encrypted.toString('base64url')}`;
}

export function aesDecrypt(payload, key) {
  if (typeof payload !== 'string' || !payload.startsWith('gcm$')) return null;
  const parts = payload.split('$');
  if (parts.length !== 4) return null;
  const [, ivB, tagB, dataB] = parts;
  try {
    const decipher = createDecipheriv('aes-256-gcm', deriveKeyMaterial(key), Buffer.from(ivB, 'base64url'));
    decipher.setAuthTag(Buffer.from(tagB, 'base64url'));
    return Buffer.concat([decipher.update(Buffer.from(dataB, 'base64url')), decipher.final()]).toString('utf8');
  } catch {
    return null;
  }
}
