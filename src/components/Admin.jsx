import { useEffect, useState } from 'react';
import { adminLogin, adminLogout, adminMe, fetchRegistrations, saveScore, timerAction, uploadUrl } from '../utils/api';
const inputClass = 'field';
const TABS = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'teams', label: 'TEAMS' },
  { id: 'scores', label: 'SCORES /30' },
  { id: 'timer', label: 'LIVE 5:00' },
  { id: 'security', label: 'SECURITY' },
];
export default function Admin() {
  const [session, setSession] = useState(null); // { email, name } once authenticated
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [tab, setTab] = useState('overview');
  const [rows, setRows] = useState(null);
  const [scores, setScores] = useState({});
  const [timers, setTimers] = useState({});
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  // --- restore session via httpOnly cookie ---
  useEffect(() => {
    (async () => {
      try {
        const me = await adminMe();
        if (me?.admin?.email) setSession(me.admin);
      } catch {
        /* not logged in */
      }
    })();
  }, []);
  const doLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const data = await adminLogin(loginEmail, loginPassword);
      setSession(data.admin);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  const doLogout = async () => {
    try {
      await adminLogout();
    } catch {
      /* ignore */
    }
    setSession(null);
    setRows(null);
    setScores({});
    setTimers({});
    setTab('overview');
  };
  const loadAll = async () => {
    setError('');
    setLoading(true);
    try {
      const regs = await fetchRegistrations();
      setRows(regs);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };
  // --- scores: 10+10+10 = 30 ---
  const updateScoreLocal = (registrationId, key) => (e) => {
    const v = Math.max(0, Math.min(10, Number(e.target.value) || 0));
    setScores((s) => ({ ...s, [registrationId]: { ...(s[registrationId]), [key]: v } }));
  };
  const persistScore = async (registrationId) => {
    const s = scores[registrationId] || {};
    const payload = { communication: s.communication ?? 0, liveShow: s.liveShow ?? 0, domains: s.domains ?? 0 };
    setError('');
    setNotice('');
    try {
      const data = await saveScore(registrationId, payload);
      setNotice(`Score saved — total ${data.total}/30.`);
    } catch (err) {
      setError(err.message);
    }
  };
  const scoreTotal = (registrationId) => {
    const s = scores[registrationId] || {};
    return Math.round(((s.communication ?? 0) + (s.liveShow ?? 0) + (s.domains ?? 0)) * 2) / 2;
  };
  // --- 5:00 live-show clock (server-authoritative) ---
  const timer = (registrationId) => timers[registrationId] || { status: 'idle', remainingMs: 5 * 60 * 1000 };
  const clockLabel = (t) => {
    const ms = t.status === 'running' ? (t.remainingMs ?? 0) : t.remainingMs ?? 5 * 60 * 1000;
    const m = String(Math.floor(ms / 60000)).padStart(2, '0');
    const s = String(Math.floor((ms % 60000) / 1000)).padStart(2, '0');
    return `${m}:${s}`;
  };
  const runTimer = async (registrationId, action) => {
    setError('');
    try {
      const data = await timerAction(registrationId, action);
      setTimers((t) => ({ ...t, [registrationId]: data }));
    } catch (err) {
      setError(err.message);
    }
  };
  // Auto-tick running clocks every second
  useEffect(() => {
    const id = setInterval(() => {
      if (!timers || Object.keys(timers).length === 0) return;
      setTimers((prev) => {
        const next = {};
        for (const [rid, t] of Object.entries(prev)) {
          if (t.status !== 'running') {
            next[rid] = t;
            continue;
          }
          const elapsed = Date.now() - (t.startedAt || Date.now());
          const remaining = Math.max(0, (t.remainingMs ?? 0) - elapsed);
          next[rid] = { ...t, remainingMs: remaining, status: remaining <= 0 ? 'paused' : t.status };
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [timers?.status]);
  const openFile = (uploadId) => {
    window.open(uploadUrl(uploadId), '_blank');
  };
  // --- login screen ---
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="w-full max-w-sm">
          {error && (
            <div className="mb-5 border border-[#ff4646]/50 bg-[#ff4646]/10 px-4 py-3 font-mono text-xs text-[#ff4646]">
              ✕ {error}
            </div>
          )}
          <form onSubmit={doLogin} className="glass rounded-2xl p-8 space-y-5">
            <div>
              <div className="comic-chip bg-[#ffd34d] px-3 py-1 text-[10px] text-[#17181f] mb-4">&lt;ADMIN.GATE /&gt;</div>
              <h2 className="font-display text-2xl font-bold text-[#eef0f6]">ADMIN <span className="text-gradient">GATE</span></h2>
            </div>
            <div>
              <label className="font-mono text-[10px] tracking-[0.3em] text-[#8d90a3] block mb-1.5">EMAIL</label>
              <input className={inputClass} type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@depcys.edu" required />
            </div>
            <div>
              <label className="font-mono text-[10px] tracking-[0.3em] text-[#8d90a3] block mb-1.5">PASSWORD</label>
              <input className={inputClass} type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-neon w-full text-xs py-3.5 disabled:opacity-50">
              {loading ? 'AUTHENTICATING…' : 'ENTER //'}
            </button>
            <p className="font-mono text-[10px] text-[#8d90a3] text-center">
              Sessions expire automatically after 12 hours.
            </p>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#101116] px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="comic-chip bg-[#ffd34d] px-3 py-1 text-[10px] text-[#17181f] mb-4">&lt;ADMIN.CONSOLE /&gt;</div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[#eef0f6]">
              JUDGE'S <span className="text-gradient">CONSOLE</span>
            </h1>
            <p className="mt-1 font-mono text-xs text-[#8d90a3]">{session.name} · {session.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={loadAll} disabled={loading} className="btn-ghost text-xs px-5 py-2.5 disabled:opacity-50">
              {loading ? 'SYNCING…' : 'REFRESH'}
            </button>
            <button onClick={doLogout} className="font-mono text-xs text-[#8d90a3] hover:text-[#ff4646] transition-colors px-2">
              LOG OUT
            </button>
          </div>
        </div>
        {/* Tabs */}
        <div className="glass rounded-xl px-2 py-2 mb-8 inline-flex flex-wrap gap-1">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`font-mono text-[11px] tracking-[0.25em] px-5 py-2.5 transition-all ${
                tab === t.id ? 'bg-[#ff4646] text-[#fffdf6] [box-shadow:3px_3px_0_0_rgba(0,0,0,0.6)]' : 'text-[#8d90a3] hover:text-[#eef0f6]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {error && (
          <div className="mb-6 border border-[#ff4646]/50 bg-[#ff4646]/10 px-4 py-3 font-mono text-xs text-[#ff4646]">✕ {error}</div>
        )}
        {notice && (
          <div className="mb-6 border border-[#4f8cff]/40 bg-[#4f8cff]/10 px-4 py-3 font-mono text-xs text-[#7fb0ff]">✓ {notice}</div>
        )}
        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'REGISTRATIONS', value: rows?.length ?? '—', accent: '#4f8cff' },
              { label: 'SOLO', value: rows?.filter((r) => r.mode === 'solo').length ?? '—', accent: '#ffd34d' },
              { label: 'TEAMS', value: rows?.filter((r) => r.mode === 'team').length ?? '—', accent: '#ff4646' },
              { label: 'SCORED', value: Object.keys(scores).length, accent: '#52e0a4' },
            ].map((c) => (
              <div key={c.label} className="glass rounded-xl p-6" style={{ borderTop: `3px solid ${c.accent}` }}>
                <div className="font-mono text-[10px] tracking-[0.3em] text-[#8d90a3]">{c.label}</div>
                <div className="mt-2 font-display text-4xl font-bold" style={{ color: c.accent }}>{c.value}</div>
              </div>
            ))}
          </div>
        )}
        {/* TEAMS */}
        {tab === 'teams' && (
          <div className="glass rounded-xl overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[900px]">
              <thead>
                <tr className="font-mono text-[10px] tracking-[0.25em] text-[#8d90a3] border-b border-[#4a4e60]">
                  <th className="px-4 py-3">ID</th>
                  <th className="px-4 py-3">MODE</th>
                  <th className="px-4 py-3">NAME</th>
                  <th className="px-4 py-3">YEAR</th>
                  <th className="px-4 py-3">DOMAIN</th>
                  <th className="px-4 py-3">URL</th>
                </tr>
              </thead>
              <tbody>
                {(rows || []).map((r) => (
                  <tr key={r.registrationId || r.id} className="border-b border-[#383b4a] hover:bg-[#ff4646]/5 transition-colors align-top">
                    <td className="px-4 py-3 font-mono text-xs text-[#ff4646]">{r.registrationId}</td>
                    <td className="px-4 py-3 font-mono text-xs">
                      <span className={`px-2 py-1 rounded ${r.mode === 'team' ? 'bg-[#ffc53d]/15 text-[#b97506]' : 'bg-[#ff4646]/10 text-[#ff4646]'}`}>
                        {String(r.mode || '').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#eef0f6]">
                      {r.name}
                      {r.mode === 'team' && r.teamName && (
                        <div className="text-[10px] text-[#8d90a3] font-mono">{r.teamName}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#ff4646]">{r.year}</td>
                    <td className="px-4 py-3 text-xs text-[#4f8cff]">{r.domain}</td>
                    <td className="px-4 py-3">
                      {r.submissionUrl ? (
                        <a href={r.submissionUrl} target="_blank" rel="noreferrer" className="font-mono text-xs text-[#52e0a4] hover:underline">
                          OPEN ↗
                        </a>
                      ) : r.uploadId ? (
                        <button onClick={() => openFile(r.uploadId)} className="font-mono text-xs text-[#ffd34d] hover:underline">
                          DOWNLOAD ⬇
                        </button>
                      ) : (
                        <span className="font-mono text-[10px] text-[#8d90a3]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(rows || []).length === 0 && (
              <div className="px-5 py-10 text-center font-mono text-sm text-[#989bb0]">No registrations yet.</div>
            )}
          </div>
        )}
        {/* SCORES /30 */}
        {tab === 'scores' && (
          <div className="glass rounded-xl overflow-x-auto">
            <div className="px-5 py-4 font-mono text-[10px] tracking-[0.3em] text-[#8d90a3] border-b border-[#4a4e60]">
              SCORE SHEET · 30 MARKS = COMMUNICATION 10 · LIVE SHOW 10 · DOMAINS 10
            </div>
            <table className="w-full text-left text-sm border-collapse min-w-[820px]">
              <thead>
                <tr className="font-mono text-[10px] tracking-[0.25em] text-[#8d90a3] border-b border-[#4a4e60]">
                  <th className="px-4 py-3">TEAM</th>
                  <th className="px-4 py-3">COMMUNICATION /10</th>
                  <th className="px-4 py-3">LIVE SHOW /10</th>
                  <th className="px-4 py-3">DOMAINS /10</th>
                  <th className="px-4 py-3">TOTAL /30</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody>
                {(rows || []).map((r) => (
                  <tr key={r.registrationId || r.id} className="border-b border-[#383b4a] align-top">
                    <td className="px-4 py-3 text-[#eef0f6]">
                      {r.name}
                      <div className="font-mono text-[10px] text-[#8d90a3]">{r.registrationId}</div>
                    </td>
                    {['communication', 'liveShow', 'domains'].map((k) => (
                      <td key={k} className="px-4 py-3">
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.5"
                          className="field w-20 text-center"
                          value={scores[r.registrationId]?.[k] ?? ''}
                          placeholder="—"
                          onChange={updateScoreLocal(r.registrationId, k)}
                        />
                      </td>
                    ))}
                    <td className="px-4 py-3 font-display text-xl font-bold text-[#ffd34d]">
                      {scoreTotal(r.registrationId)}/30
                    </td>
                    <td className="px-4 py-3">
                      <button onClick={() => persistScore(r.registrationId)} className="btn-ghost text-xs px-4 py-2">
                        SAVE
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
        {/* LIVE 5:00 CLOCK */}
        {tab === 'timer' && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {(rows || []).map((r) => {
              const t = timer(r.registrationId);
              return (
                <div key={r.registrationId} className="glass rounded-xl p-5">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-mono text-[10px] tracking-[0.25em] text-[#8d90a3]">{r.name}</div>
                    <div className="font-mono text-[9px] text-[#4a4e60]">{r.registrationId}</div>
                  </div>
                  <div
                    className={`font-display text-5xl font-black text-center tracking-wider tabular-nums ${
                      t.status === 'running' ? 'text-[#52e0a4] ticking' : t.remainingMs <= 5 * 1000 ? 'text-[#ff4646]' : 'text-[#eef0f6]'
                    }`}
                    style={{ textShadow: t.status === 'running' ? '0 0 18px rgba(82,224,164,0.5)' : 'none' }}
                  >
                    {clockLabel(t)}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-2">
                    <button onClick={() => runTimer(r.registrationId, 'start')} className="btn-ghost text-[10px] py-2">START</button>
                    <button onClick={() => runTimer(r.registrationId, 'pause')} className="btn-ghost text-[10px] py-2">PAUSE</button>
                    <button onClick={() => runTimer(r.registrationId, 'reset')} className="btn-ghost text-[10px] py-2">RESET</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        {/* SECURITY */}
        {tab === 'security' && (
          <div className="glass rounded-xl p-6 max-w-xl">
            <div className="font-mono text-[10px] tracking-[0.3em] text-[#8d90a3] mb-1">AT-REST &amp; SESSION</div>
            <h3 className="font-display text-xl font-bold text-[#eef0f6] mb-3">SECURITY</h3>
            <ul className="space-y-3 font-mono text-xs text-[#c9cbd8]">
              <li><span className="text-[#52e0a4]">✓</span> Passwords — scrypt (N=16384) hashed, never stored raw.</li>
              <li><span className="text-[#52e0a4]">✓</span> Admin login — HttpOnly session cookie, HMAC-signed, 12h expiry.</li>
              <li><span className="text-[#52e0a4]">✓</span> Registrations, scores, timer, uploads — AES-256-GCM encrypted at rest.</li>
              <li><span className="text-[#52e0a4]">✓</span> Score sheet — 30 marks (Communication/Live Show/Domains).</li>
              <li><span className="text-[#52e0a4]">✓</span> Live clock — server-authoritative 5:00 per team.</li>
              <li><span className="text-[#52e0a4]">✓</span> Uploads — optional ≤2MB, base64, encrypted, admin-download only.</li>
            </ul>
            <p className="mt-6 font-mono text-[11px] text-[#8d90a3]">
              Run this app on your own server for full at-rest residency. On Vercel, set{' '}
              <span className="text-[#4f8cff]">SESSION_SECRET</span>, <span className="text-[#4f8cff]">STORE_KEY</span> and{' '}
              <span className="text-[#4f8cff]">MONGODB_URI</span> env vars.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
