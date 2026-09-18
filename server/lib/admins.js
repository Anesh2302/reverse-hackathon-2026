import { hashPassword, randomHex, verifyPassword } from './security.js';
import { readStore, writeStore } from './store.js';

const ADMINS_STORE = 'admins';

function normalizeEmail(raw) {
  return String(raw || '').trim().toLowerCase();
}

function envSeed() {
  const rows = [];
  const email = normalizeEmail(process.env.ADMIN_EMAIL || process.env.ADMIN1_EMAIL);
  const pass = String(process.env.ADMIN_PASS || process.env.ADMIN1_PASS || '').trim();
  if (email && pass) {
    rows.push({
      email,
      name: String(process.env.ADMIN_NAME || process.env.ADMIN1_NAME || 'DEP-CYS Organizer').trim(),
      passwordHash: hashPassword(pass),
      source: 'env',
      createdAt: new Date().toISOString(),
    });
  }
  const email2 = normalizeEmail(process.env.ADMIN2_EMAIL);
  const pass2 = String(process.env.ADMIN2_PASS || '').trim();
  if (email2 && pass2) {
    rows.push({
      email: email2,
      name: String(process.env.ADMIN2_NAME || 'DEP-CYS Co-Organizer').trim(),
      passwordHash: hashPassword(pass2),
      source: 'env',
      createdAt: new Date().toISOString(),
    });
  }
  return rows;
}

function fileRows() {
  const rows = readStore(ADMINS_STORE, []);
  return Array.isArray(rows) ? rows : [];
}

export function listAdmins() {
  const env = envSeed().map((a) => ({ email: a.email, name: a.name, source: 'env' }));
  const file = fileRows().filter((a) => a.source !== 'env').map((a) => ({ email: a.email, name: a.name, source: 'file' }));
  return [...env, ...file];
}

export function findAdminByEmail(email) {
  const target = normalizeEmail(email);
  return (
    envSeed().find((a) => a.email === target) ||
    fileRows().find((a) => a.email === target) ||
    null
  );
}

export function verifyAdminLogin(email, password) {
  const admin = findAdminByEmail(email);
  if (!admin) return false;
  return verifyPassword(String(password || ''), admin.passwordHash);
}

export function changeAdminPassword(email, currentPassword, newPassword) {
  const target = normalizeEmail(email);
  const envAdmin = envSeed().find((a) => a.email === target);
  if (envAdmin) {
    throw new Error('Password changes for env admins must be applied via ADMIN1_PASS / ADMIN2_PASS.');
  }
  const rows = fileRows();
  const admin = rows.find((a) => a.email === target);
  if (!admin) throw new Error('Admin not found.');
  if (!verifyPassword(String(currentPassword || ''), admin.passwordHash)) {
    throw new Error('Current password is incorrect.');
  }
  if (String(newPassword || '').length < 8) {
    throw new Error('New password must be at least 8 characters.');
  }
  writeStore(
    ADMINS_STORE,
    rows.map((a) => (a.email === target ? { ...a, passwordHash: hashPassword(newPassword) } : a))
  );
  return true;
}

export function addFileAdmin({ email, name, password }) {
  const cleanEmail = normalizeEmail(email);
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
    throw new Error('A valid email is required.');
  }
  if (findAdminByEmail(cleanEmail)) {
    throw new Error('An admin with that email already exists.');
  }
  if (String(password || '').length < 8) {
    throw new Error('Password must be at least 8 characters.');
  }
  const rows = fileRows();
  rows.push({
    email: cleanEmail,
    name: String(name || '').trim() || 'DEP-CYS Organizer',
    passwordHash: hashPassword(password),
    source: 'file',
    createdAt: new Date().toISOString(),
  });
  writeStore(ADMINS_STORE, rows);
  return cleanEmail;
}

export function removeFileAdmin(email) {
  const target = normalizeEmail(email);
  const env = envSeed().find((a) => a.email === target);
  if (env) throw new Error('Env admins are managed via ADMIN*_EMAIL / ADMIN*_PASS — not from the panel.');
  const rows = fileRows().filter((a) => a.email !== target);
  writeStore(ADMINS_STORE, rows);
  return true;
}

export function ensureSeedAdmins() {
  const haveAny = envSeed().length > 0 || fileRows().length > 0;
  if (haveAny) return;
  const devEmail = normalizeEmail(process.env.ADMIN_EMAIL || '');
  const devPass = String(process.env.ADMIN_PASS || '').trim();
  const email = devEmail || 'simonpetercys@gmail.com';
  const password = devPass || randomHex(12);
  writeStore(ADMINS_STORE, [
    {
      email,
      name: 'DEP-CYS Organizer',
      passwordHash: hashPassword(password),
      source: 'file',
      createdAt: new Date().toISOString(),
    },
  ]);
  console.log('[admins] Seeded first admin:', email, password ? '(password random — see server log)' : '');
}

export function createSessionFor(email) {
  return { email: normalizeEmail(email) };
}
