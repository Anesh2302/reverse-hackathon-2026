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
    // Server rejected — throw the human-readable error
    throw new Error(data.error || `Registration failed (${response.status}).`);
  }

  // Success — mirror to local storage as a safety net
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