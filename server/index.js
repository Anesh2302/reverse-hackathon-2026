import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { db, isMongo, getRegistrations, saveRegistration } from './lib/db.js';
import { verifySession, signSession, randomHex } from './lib/security.js';
import { findAdminByEmail, verifyAdminLogin, ensureSeedAdmins, listAdmins } from './lib/admins.js';
import { readStore, writeStore, getUpload, saveUpload, storeKey } from './lib/store.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fsExists = (p) => {
  try {
    return fs.existsSync(p);
  } catch {
    return false;
  }
};
const app = express();

const PORT = Number(process.env.PORT || 5050);
const SESSION_SECRET = process.env.SESSION_SECRET || storeKey(); // HMAC signing + AES-GCM at-rest key
const SESSION_TTL_SEC = 60 * 60 * 12;

app.use(cors());
app.use(express.json({ limit: '3mb' }));

// --- minimal stateless session cookie helpers ---
function sessionTokenFrom(req) {
  const cookie = String(req.headers.cookie || '');
  const m = cookie.match(/revhack_admin=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}

function setSessionCookie(res, token) {
  res.setHeader(
    'Set-Cookie',
    `revhack_admin=${encodeURIComponent(token)}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${SESSION_TTL_SEC}${
      String(process.env.COOKIE_SECURE || '').trim() === '1' ? '; Secure' : ''
    }`
  );
}

function requireAdmin(req, res, next) {
  const payload = verifySession(sessionTokenFrom(req), SESSION_SECRET);
  if (!payload) {
    return res.status(401).json({ error: 'Not authenticated. Log in first.' });
  }
  req.admin = payload;
  return next();
}

// --- seed two admins (you + a partner), hashed + encrypted at rest ---
await db.connect();
ensureSeedAdmins();
console.log('[auth] Admins ready:', listAdmins().map((a) => a.email).join(', '));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: isMongo() ? 'mongodb' : 'json-file', time: new Date().toISOString() });
});

// --- Admin auth ---
app.post('/api/admin/login', (req, res) => {
  const email = String(req.body?.email || '').trim().toLowerCase();
  const password = String(req.body?.password || '');
  const admin = findAdminByEmail(email);
  if (!admin || !verifyAdminLogin(email, password)) {
    return res.status(401).json({ error: 'Invalid credentials.' });
  }
  const token = signSession(
    { email: admin.email, name: admin.name, role: 'admin' },
    SESSION_SECRET,
    SESSION_TTL_SEC
  );
  setSessionCookie(res, token);
  return res.json({ ok: true, admin: { email: admin.email, name: admin.name } });
});

app.post('/api/admin/logout', (_req, res) => {
  res.setHeader('Set-Cookie', 'revhack_admin=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0');
  return res.json({ ok: true });
});

app.get('/api/admin/me', (req, res) => {
  const payload = verifySession(sessionTokenFrom(req), SESSION_SECRET);
  if (!payload) return res.status(401).json({ error: 'Not authenticated.' });
  return res.json({ admin: { email: payload.email, name: payload.name } });
});

// --- Public registration (now also accepts optional 2MB URL-or-file payload) ---
app.post('/api/register', async (req, res) => {
  try {
    const payload = req.body || {};

    if (!payload.mode || !['solo', 'team'].includes(payload.mode)) {
      return res.status(400).json({ error: 'Registration mode must be "solo" or "team".' });
    }
    const email = String(payload.email || '').trim().toLowerCase();
    const phone = String(payload.phone || '').trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: 'A valid leader email is required.' });
    }
    if (!/^[0-9+\-\s]{10,15}$/.test(phone)) {
      return res.status(400).json({ error: 'A valid leader phone number is required.' });
    }

    const year = String(payload.year || '').trim().toUpperCase();
    if (!['I', 'II', 'III'].includes(year)) {
      return res.status(400).json({ error: 'Year must be I, II or III (DEP-CYS students only).' });
    }

    // Optional submission: URL (their build) and/or one ≤2MB file, encrypted at rest
    const submissionUrl = String(payload.submissionUrl || '').trim();
    let uploadId = '';
    const file = payload.file;
    if (file && file.type && file.data) {
      const sizeKb = Math.ceil(Buffer.byteLength(String(file.data)) * 0.75);
      if (sizeKb > 2 * 1024) {
        return res.status(400).json({ error: 'Attachment must be 2MB or smaller.' });
      }
      if (file.type.length > 100 || file.name.length > 140) {
        return res.status(400).json({ error: 'Attachment meta is malformed.' });
      }
      uploadId = `u_${randomHex(8)}`;
      saveUpload(uploadId, String(file.data), String(file.type), String(file.name || 'attachment'));
    }

    const doc = {
      mode: payload.mode,
      name: String(payload.name || '').trim(),
      email,
      phone,
      year,
      rollNo: String(payload.rollNo || '').trim(),
      domain: String(payload.domain || '').trim(),
      agree: Boolean(payload.agree),
      submissionUrl,
      uploadId,
      teamName: payload.mode === 'team' ? String(payload.teamName || '').trim() : '',
      members: [],
      submittedAt: new Date().toISOString(),
    };

    if (!doc.name) return res.status(400).json({ error: 'Leader name is required.' });
    if (!doc.rollNo) return res.status(400).json({ error: 'Roll number is required.' });
    if (!doc.domain) return res.status(400).json({ error: 'Please pick a focus domain.' });
    if (!doc.agree) return res.status(400).json({ error: 'You must agree to the event rules.' });

    if (payload.mode === 'team') {
      if (!doc.teamName) return res.status(400).json({ error: 'Team name is required.' });
      const members = Array.isArray(payload.members) ? payload.members : [];
      if (members.length !== 1) {
        return res.status(400).json({ error: 'A Team Duo is exactly 2 — you plus one partner.' });
      }
      for (const m of members) {
        const memberName = String(m.name || '').trim();
        const memberYear = String(m.year || '').trim().toUpperCase();
        const memberRoll = String(m.rollNo || '').trim();
        if (!memberName || !memberRoll || !['I', 'II', 'III'].includes(memberYear)) {
          return res.status(400).json({
            error: 'Each member needs a name, roll number and a valid year (I/II/III).',
          });
        }
      }
      doc.members = members.map((m) => ({
        name: String(m.name).trim(),
        rollNo: String(m.rollNo).trim(),
        year: String(m.year).trim().toUpperCase(),
      }));
    }

    const saved = await saveRegistration(doc);
    return res.status(201).json({ ok: true, id: saved.id, registrationId: saved.registrationId });
  } catch (err) {
    console.error('[register]', err);
    return res.status(500).json({ error: 'Failed to save registration.' });
  }
});

// --- Admin-only: list registrations (HMAC session, no URL token) ---
app.get('/api/registrations', requireAdmin, async (_req, res) => {
  try {
    const rows = await getRegistrations();
    return res.json(rows);
  } catch (err) {
    console.error('[list]', err);
    return res.status(500).json({ error: 'Failed to list registrations.' });
  }
});

// --- Admin: export registrations + their scores as CSV (HMAC session) ---
app.get('/api/admin/export', requireAdmin, async (_req, res) => {
  try {
    const regs = await getRegistrations();
    const scores = readStore('scores', {});
    const esc = (v) => {
      const s = String(v ?? '');
      return /[",\n]/.test(s) ? '"' + s.replace(/"/g, '""') + '"' : s;
    };
    const head = ['RegistrationID','Mode','Name','Email','Phone','Year','RollNo','Domain','TeamName','SubmissionURL','SubmittedAt','Communication /10','LiveShow /10','Domains /10','Total /30','Judged'].join(',');
    const rows = regs.map((r) => {
      const s = (scores && scores[r.registrationId]) || {};
      const total = Math.round(((Number(s.communication) || 0) + (Number(s.liveShow) || 0) + (Number(s.domains) || 0)) * 2) / 2;
      return [r.registrationId || r.id, r.mode, r.name, r.email, r.phone, r.year, r.rollNo, r.domain, r.teamName, r.submissionUrl, r.submittedAt || r.submittedAt, s.communication ?? '', s.liveShow ?? '', s.domains ?? '', total, s.judged || ''].map(esc).join(',');
    });
    const csv = '\uFEFF' + [head].concat(rows).join('\r\n');
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', 'attachment; filename="registrations-' + new Date().toISOString().slice(0, 10) + '.csv"');
    return res.send(csv);
  } catch (err) {
    console.error('[export]', err);
    return res.status(500).json({ error: 'Failed to export.' });
  }
});


// --- Admin: 30-mark score sheet (Communication 10 · Live Show 10 · Domains 10) ---
app.get('/api/admin/scores', requireAdmin, async (_req, res) => {
  try {
    const regs = await getRegistrations();
    const scores = readStore('scores', {});
    const rows = regs.map((r) => {
      const s = (scores && scores[r.registrationId]) || {};
      return {
        registrationId: r.registrationId,
        mode: r.mode,
        name: r.name,
        email: r.email,
        year: r.year,
        domain: r.domain,
        teamName: r.teamName,
        communication: s.communication ?? '',
        liveShow: s.liveShow ?? '',
        domains: s.domains ?? '',
        total: sumScore(s),
        judged: s.judged ?? '',
      };
    });
    rows.sort((a, b) => b.total - a.total || String(a.registrationId).localeCompare(b.registrationId));
    return res.json(rows);
  } catch (err) {
    console.error('[scores]', err);
    return res.status(500).json({ error: 'Failed to load scores.' });
  }
});

function sumScore(s) {
  const a = Number(s?.communication);
  const b = Number(s?.liveShow);
  const c = Number(s?.domains);
  const nums = [a, b, c].filter((n) => Number.isFinite(n));
  if (nums.length === 0) return 0;
  return Math.round(nums.reduce((acc, n) => acc + n, 0) * 2) / 2;
}

app.put('/api/admin/scores/:registrationId', requireAdmin, async (req, res) => {
  try {
    const regs = await getRegistrations();
    const target = String(req.params.registrationId || '').trim();
    if (!regs.some((r) => r.registrationId === target)) {
      return res.status(404).json({ error: 'Registration not found.' });
    }
    const num = (v) => {
      const n = Number(v);
      if (!Number.isFinite(n)) return null;
      return Math.max(0, Math.min(10, Math.round(n * 2) / 2));
    };
    const communication = num(req.body?.communication);
    const liveShow = num(req.body?.liveShow);
    const domains = num(req.body?.domains);
    if (communication === null || liveShow === null || domains === null) {
      return res.status(400).json({ error: 'Each category must be a number from 0 to 10.' });
    }
    const scores = readStore('scores', {});
    scores[target] = {
      communication,
      liveShow,
      domains,
      judged: String(req.body?.judged || req.admin.name || req.admin.email || ''),
      updatedAt: new Date().toISOString(),
    };
    writeStore('scores', scores);
    return res.json({ ok: true, total: sumScore(scores[target]) });
  } catch (err) {
    console.error('[score save]', err);
    return res.status(500).json({ error: 'Failed to save score.' });
  }
});

// --- Admin: per-team 5:00 live-show timer (server-authoritative) ---
function timerState(id) {
  const timers = readStore('timers', {});
  return (timers && timers[id]) || { status: 'idle', startedAt: null, remainingMs: null, durationMs: 5 * 60 * 1000 };
}

function writeTimer(id, state) {
  const timers = readStore('timers', {});
  timers[id] = state;
  writeStore('timers', timers);
}

app.get('/api/admin/timer', requireAdmin, async (_req, res) => {
  try {
    const regs = await getRegistrations();
    const teams = regs.map((r) => ({
      registrationId: r.registrationId,
      name: r.mode === 'team' ? r.teamName : r.name,
      mode: r.mode,
      ...timerState(r.registrationId),
    }));
    return res.json(teams);
  } catch (err) {
    console.error('[timer]', err);
    return res.status(500).json({ error: 'Failed to load timers.' });
  }
});

app.post('/api/admin/timer/:registrationId/:action', requireAdmin, (req, res) => {
  const id = String(req.params.registrationId || '').trim();
  const action = String(req.params.action || '');
  const now = Date.now();
  const current = timerState(id);
  let next;
  switch (action) {
    case 'start': {
      const remaining = current.remainingMs ?? 5 * 60 * 1000;
      next = { status: 'running', startedAt: now, remainingMs: remaining, durationMs: 5 * 60 * 1000 };
      break;
    }
    case 'pause': {
      const elapsed = current.status === 'running' && current.startedAt ? now - current.startedAt : 0;
      next = { ...current, status: 'paused', remainingMs: Math.max(0, (current.remainingMs ?? 0) - elapsed), startedAt: null };
      break;
    }
    case 'reset': {
      next = { status: 'idle', startedAt: null, remainingMs: 5 * 60 * 1000, durationMs: 5 * 60 * 1000 };
      break;
    }
    default:
      return res.status(400).json({ error: 'Action must be start, pause or reset.' });
  }
  writeTimer(id, next);
  return res.json({ ok: true, ...next });
});

// --- Admin: view/download encrypted participant upload ---
app.get('/api/admin/uploads/:uploadId', requireAdmin, (_req, res) => {
  const upload = getUpload(String(req.params.uploadId || ''));
  if (!upload) return res.status(404).json({ error: 'Upload not found.' });
  const m = upload.mimetype ? String(upload.mimetype) : 'application/octet-stream';
  res.setHeader('Content-Type', m);
  res.setHeader('Content-Disposition', `attachment; filename="${encodeURIComponent(upload.name || 'attachment')}"`);
  const data = Buffer.from(String(upload.data), 'base64');
  return res.send(data);
});

// --- Public chat: log an unanswered reg-helper question to the inbox ---
app.post('/api/chat', (req, res) => {
  try {
    const text = String(req.body?.text || '').trim().slice(0, 500);
    const source = String(req.body?.source || 'site').trim().slice(0, 20);
    if (!text) return res.status(400).json({ error: 'Message is required.' });
    const chats = readStore('chats', []);
    chats.push({
      id: randomHex(8),
      text,
      source,
      at: new Date().toISOString(),
      answered: false,
    });
    writeStore('chats', chats);
    return res.status(201).json({ ok: true, id: chats[chats.length - 1].id });
  } catch (err) {
    console.error('[chat]', err);
    return res.status(500).json({ error: 'Failed to save message.' });
  }
});

// --- Admin: chat inbox (unanswered reg-helper questions) ---
app.get('/api/admin/chats', requireAdmin, (_req, res) => {
  try {
    const chats = readStore('chats', []);
    const answered = chats.map((c) => ({ ...c, answered: false }));
    return res.json(answered.reverse().slice(0, 100));
  } catch (err) {
    console.error('[chats]', err);
    return res.status(500).json({ error: 'Failed to load chats.' });
  }
});

// --- Serve built frontend when present (production mode) ---
const dist = path.join(__dirname, '..', 'dist');
if (fsExists(dist)) {
  app.use(express.static(dist));
  app.get(/^\/(?!api).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

export { app };

// Run only when executed directly
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  app.listen(PORT, () => {
    console.log(`[ReverseHack2026 API] http://localhost:${PORT} (db: ${isMongo() ? 'mongodb' : 'json-file'})`);
  });
}
