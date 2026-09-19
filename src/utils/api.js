const API_BASE = import.meta.env.VITE_API_BASE || '/api';
const LS_KEY = 'revhack26_registrations';

export function isServerReachable() {
  return import.meta.env.VITE_API_BASE || true;
}

export async function registerParticipant(payload) {
  const response = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || `Registration failed (${response.status}).`);
  }

  storeLocal(payload, data);
  return data;
}

function storeLocal(payload, serverData) {
  try {
    const existing = JSON.parse(localStorage.getItem(LS_KEY) || '[]');
    existing.push({ ...payload, registrationId: serverData.registrationId, at: new Date().toISOString() });
    localStorage.setItem(LS_KEY, JSON.stringify(existing));
  } catch {
    /* ignore quota errors */
  }
}

export function getLocalRegistrations() {
  try {
    return JSON.parse(localStorage.getItem(LS_KEY) || '[]');
  } catch {
    return [];
  }
}

async function handle(resp) {
  const data = await resp.json().catch(() => ({}));
  if (!resp.ok) throw new Error(data.error || `Request failed (${resp.status}).`);
  return data;
}

// --- Admin session (httpOnly HMAC cookie — no URL tokens) ---
export async function adminLogin(email, password) {
  return handle(
    await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    })
  );
}

export async function adminLogout() {
  return handle(await fetch(`${API_BASE}/admin/logout`, { method: 'POST' }));
}

export async function adminMe() {
  return handle(await fetch(`${API_BASE}/admin/me`));
}

export async function fetchRegistrations() {
  return handle(await fetch(`${API_BASE}/registrations`));
}

// --- Admin: 30-mark score sheet (Communication 10 · Live Show 10 · Domains 10) ---
export async function fetchScores() {
  return handle(await fetch(`${API_BASE}/admin/scores`));
}

export async function saveScore(registrationId, { communication, liveShow, domains }) {
  return handle(
    await fetch(`${API_BASE}/admin/scores/${encodeURIComponent(registrationId)}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ communication, liveShow, domains }),
    })
  );
}

// --- Admin: per-team 5:00 live-show timer (server-authoritative) ---
export async function fetchTimer() {
  return handle(await fetch(`${API_BASE}/admin/timer`));
}

export async function timerAction(registrationId, action) {
  return handle(
    await fetch(`${API_BASE}/admin/timer/${encodeURIComponent(registrationId)}/${action}`, { method: 'POST' })
  );
}

// --- Admin: access a participant's submitted file ---
export async function uploadUrl(uploadId) {
  return `${API_BASE}/admin/uploads/${encodeURIComponent(uploadId)}`;
}


export async function downloadRegistrationsCsv() {
  const res = await fetch(`${API_BASE}/admin/export`, { credentials: 'include' });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw Error((body && body.error) || `Export failed (${res.status}).`);
  }
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `registrations-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}