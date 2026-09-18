import express from 'express';
import cors from 'cors';
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { db, isMongo, getRegistrations, saveRegistration } from './lib/db.js';

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
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'change-me';

app.use(cors());
app.use(express.json({ limit: '200kb' }));

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, db: isMongo() ? 'mongodb' : 'json-file', time: new Date().toISOString() });
});

app.post('/api/register', async (req, res) => {
  try {
    const payload = req.body || {};

    // --- Validate core fields that apply to both modes ---
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

    const doc = {
      mode: payload.mode,
      name: String(payload.name || '').trim(),
      email,
      phone,
      year,
      rollNo: String(payload.rollNo || '').trim(),
      domain: String(payload.domain || '').trim(),
      agree: Boolean(payload.agree),
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

app.get('/api/registrations', async (req, res) => {
  if (req.query.token !== ADMIN_TOKEN) {
    return res.status(401).json({ error: 'Unauthorized. Invalid admin token.' });
  }
  try {
    const rows = await getRegistrations();
    return res.json(rows);
  } catch (err) {
    console.error('[list]', err);
    return res.status(500).json({ error: 'Failed to list registrations.' });
  }
});

// Serve built frontend when present (production mode)
const dist = path.join(__dirname, '..', 'dist');
if (fsExists(dist)) {
  app.use(express.static(dist));
  app.get(/^\/(?!api).*/, (_req, res) => res.sendFile(path.join(dist, 'index.html')));
}

export { app };

// Run only when executed directly
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  db.connect()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`[ReverseHack2026 API] http://localhost:${PORT} (db: ${isMongo() ? 'mongodb' : 'json-file'})`);
      });
    })
    .catch((err) => {
      console.error('[server] fatal', err);
      process.exit(1);
    });
}