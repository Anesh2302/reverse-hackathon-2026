import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_NAME = process.env.MONGODB_DB || 'reverse_hackathon_2026';
const DATA_FILE = path.join(__dirname, 'data', 'registrations.json');

let mongoConnected = false;

// --- MongoDB schema ---
const registrationSchema = new mongoose.Schema(
  {
    mode: { type: String, enum: ['solo', 'team'], required: true },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    year: { type: String, enum: ['I', 'II', 'III'], required: true },
    rollNo: { type: String, required: true },
    domain: { type: String },
    teamName: { type: String, default: '' },
    members: { type: Array, default: [] },
    agree: { type: Boolean, default: false },
    registrationId: { type: String, unique: true },
    submittedAt: { type: Date, default: Date.now },
  },
  { collection: 'registrations' }
);

const Registration = mongoose.models.Registration || mongoose.model('Registration', registrationSchema);

// --- JSON-file store helpers ---
function readJsonFile() {
  try {
    return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
  } catch {
    return [];
  }
}

function writeJsonFile(rows) {
  fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
  fs.writeFileSync(DATA_FILE, JSON.stringify(rows, null, 2));
}

function makeRegistrationId(mode) {
  const prefix = mode === 'team' ? 'TEAM' : 'SOLO';
  return `REV26-${prefix}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
}

// --- Public API ---
export const db = {
  async connect() {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      console.log('[db] No MONGODB_URI set — using JSON-file store.');
      mongoConnected = false;
      return true;
    }
    try {
      await mongoose.connect(uri, { dbName: DB_NAME });
      mongoConnected = true;
      console.log('[db] Connected to MongoDB.');
    } catch (err) {
      console.warn('[db] Mongo connection failed, falling back to JSON-file store.', err.message);
      mongoConnected = false;
    }
    return true;
  },
};

export const isMongo = () => mongoConnected;

export async function saveRegistration(doc) {
  const registrationId = makeRegistrationId(doc.mode);
  const withId = { ...doc, registrationId };

  if (mongoConnected) {
    try {
      const created = await Registration.create(withId);
      return { id: created._id.toString(), registrationId: created.registrationId };
    } catch (err) {
      console.error('[db] Mongo insert failed — falling back to file.', err.message);
    }
  }

  // JSON-file fallback path
  const rows = readJsonFile();
  const entry = { ...withId, id: `file-${Date.now()}-${rows.length + 1}` };
  rows.push(entry);
  writeJsonFile(rows);
  return { id: entry.id, registrationId: entry.registrationId };
}

export async function getRegistrations() {
  if (mongoConnected) {
    try {
      const docs = await Registration.find().sort({ submittedAt: -1 }).lean();
      return docs.map((d) => ({ ...d, id: d._id.toString() }));
    } catch (err) {
      console.error('[db] Mongo read failed — falling back to file.', err.message);
    }
  }
  return readJsonFile().reverse();
}