import { useEffect, useState } from 'react';
import {
  adminLogin,
  adminLogout,
  adminMe,
  fetchRegistrations,
  fetchScores,
  fetchTimer,
  fetchChats,
  saveScore,
  timerAction,
  uploadUrl,
  downloadRegistrationsCsv,
} from '../utils/api';
const inputClass = 'field';
const TABS = [
  { id: 'overview', label: 'OVERVIEW' },
  { id: 'teams', label: 'TEAMS' },
  { id: 'scores', label: 'SCORES /30' },
  { id: 'timer', label: 'LIVE 5:00' },
  { id: 'inbox', label: 'INBOX' },
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
  const [chats, setChats] = useState([]);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [loading, setLoading] = useState(false);
  // --- restore session via httpOnly cookie ---
  useEffect(() => {
    (async () => {
      try {
        const me = await adminMe();
        if (me?.admin?.email) {
          setSession(me.admin);
          loadAll();
        }
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
      loadAll();
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
    setChats([]);
    setTab('overview');
  };
  const loadAll = async () => {
    setError('');
    setLoading(true);
    const [regs, scoreRows, timerRows, chatRows] = await Promise.allSettled([
      fetchRegistrations(),
      fetchScores(),
      fetchTimer(),
      fetchChats(),
    ]);
    if (regs.status === 'fulfilled') setRows(regs.value);
    if (regs.status === 'rejected') setError(regs.reason?.message || 'Failed to load registrations.');
    if (scoreRows.status === 'fulfilled') {
      const map = {};
      for (const s of scoreRows.value) {
        map[s.registrationId] = {
          communication: s.communication ?? 0,
          liveShow: s.liveShow ?? 0,
          domains: s.domains ?? 0,
        };
      }
      setScores(map);
    }
    if (timerRows.status === 'fulfilled') {
      const map = {};
      for (const t of timerRows.value) map[t.registrationId] = t;
      setTimers(map);
    }
    if (chatRows.status === 'fulfilled') setChats(chatRows.value);
    setLoading(false);
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
  const exportCsv = async () => {
    setError('');
    setNotice('');
    try {
      await downloadRegistrationsCsv();
      setNotice('CSV exported — check your downloads.');
    } catch (err) {
      setError(err.message);
    }
  };
  // --- 5:00 live-show clock (server-authoritative) ---
  const timer = (registrationId) => timers[registrationId] || { status: 'idle', remainingMs: 5 * 60 * 1000 };
  const clockLabel = (t) => {
    const ms = t.status === 'running'
      ? Math.max(0, (t.remainingMs ?? 0) - (Date.now() - (t.startedAt || Date.now())))
      : (t.remainingMs ?? 5 * 60 * 1000);
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
      setTimers((prev) => {
        const next = {};
        for (const [rid, t] of Object.entries(prev)) {
          if (t.status !== 'running') {
            next[rid] = t;
            continue;
          }
          const elapsed = Date.now() - (t.startedAt || Date.now());
          const remaining = Math.max(0, (t.remainingMs ?? 0) - elapsed);
          next[rid] = remaining <= 0 ? { ...t, status: 'paused', remainingMs: 0, startedAt: null } : t;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, []);
  const openFile = (uploadId) => {
    window.open(uploadUrl(uploadId), '_blank');
  };
  // --- login screen ---
  if (!session) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5">
        <div className="w-full max-w-sm">
          {error && (
            <div className="mb-5 border border-[#B01713]/50 bg-[#D9261E]/10 px-4 py-3 font-mono text-xs text-[#1A0A0A]">
              ✕ {error}
            </div>
          )}
          <form onSubmit={doLogin} className="glass rounded-2xl p-8 space-y-5">
            <div>
              <div className="comic-chip border border-[#B01713]/60 px-3 py-1 text-[10px] text-[#1A0A0A] mb-4">&lt;ADMIN.GATE /&gt;</div>
              <h2 className="font-display text-2xl font-bold text-[#1A0A0A]">ADMIN <span className="text-gradient">GATE</span></h2>
            </div>
            <div>
              <label className="font-mono text-[10px] tracking-[0.3em] text-[#B4C0D8] block mb-1.5">EMAIL</label>
              <input className={inputClass} type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} placeholder="you@college.edu" required />
            </div>
            <div>
              <label className="font-mono text-[10px] tracking-[0.3em] text-[#B4C0D8] block mb-1.5">PASSWORD</label>
              <input className={inputClass} type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} placeholder="••••••••" required />
            </div>
            <button type="submit" disabled={loading} className="btn-neon w-full text-xs py-3.5 disabled:opacity-50">
              {loading ? 'AUTHENTICATING…' : 'ENTER //'}
            </button>
            <p className="font-mono text-[10px] text-[#B4C0D8] text-center">
              Sessions expire automatically after 12 hours.
            </p>
          </form>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-[#000000] px-5 py-20">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="comic-chip border border-[#B01713]/60 px-3 py-1 text-[10px] text-[#1A0A0A] mb-4">&lt;ADMIN.CONSOLE /&gt;</div>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-[#1A0A0A]">
              JUDGE'S <span className="text-gradient">CONSOLE</span>
            </h1>
            <p className="mt-1 font-mono text-xs text-[#B4C0D8]">{session.name} · {session.email}</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportCsv} className="btn-ghost text-xs px-5 py-2.5" title="Download full CSV (registrations + scores)">
              EXPORT CSV ⬇
            </button>
            <button onClick={loadAll} disabled={loading} className="btn-ghost text-xs px-5 py-2.5 disabled:opacity-50">
              {loading ? 'SYNCING…' : 'REFRESH'}
            </button>
            <button onClick={doLogout} className="font-mono text-xs text-[#B4C0D8] hover:text-[#1A0A0A] transition-colors px-2">
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
                tab === t.id ? 'bg-[#D9261E] text-[#1A0A0A] [box-shadow:3px_3px_0_0_rgba(0,0,0,0.6)]' : 'text-[#B4C0D8] hover:text-[#1A0A0A]'
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        {error && (
          <div className="mb-6 border border-[#B01713]/50 bg-[#D9261E]/10 px-4 py-3 font-mono text-xs text-[#1A0A0A]">✕ {error}</div>
        )}
        {notice && (
          <div className="mb-6 border border-[#C98905]/40 bg-[#D9A006]/10 px-4 py-3 font-mono text-xs text-[#1C0A0A]">✓ {notice}</div>
        )}
        {/* OVERVIEW */}
        {tab === 'overview' && (
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {[
              { label: 'REGISTRATIONS', value: rows?.length ?? '—', accent: '#F2B705' },
              { label: 'SOLO', value: rows?.filter((r) => r.mode === 'solo').length ?? '—', accent: '#C75C35' },
              { label: 'TEAMS', value: rows?.filter((r) => r.mode === 'team').length ?? '—', accent: '#C75C35' },
              { label: 'SCORED', value: Object.keys(scores).length, accent: '#D9261E' },
            ].map((c) => (
              <div key={c.label} className="glass rounded-xl p-6" style={{ borderTop: `3px solid ${c.accent}` }}>
                <div className="font-mono text-[10px] tracking-[0.3em] text-[#B4C0D8]">{c.label}</div>
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
                <tr className="font-mono text-[10px] tracking-[0.25em] text-[#B4C0D8] border-b border-[#465066]">
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
                  <tr key={r.registrationId || r.id} className="border-b border-[#465066] hover:bg-[#D9261E]/5 transition-colors align-top">
                    <td className="px-4 py-3 font-mono text-xs text-[#1A0A0A]">{r.registrationId}</td>
                    <td className="px-4 py-3 font-mono text-xs">
                      <span className={`px-2 py-1 rounded ${r.mode === 'team' ? 'bg-[#D9261E]/15 text-[#1A0A0A]' : 'bg-[#D9261E]/10 text-[#1A0A0A]'}`}>
                        {String(r.mode || '').toUpperCase()}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[#1A0A0A]">
                      {r.name}
                      {r.mode === 'team' && r.teamName && (
                        <div className="text-[10px] text-[#B4C0D8] font-mono">{r.teamName}</div>
                      )}
                    </td>
                    <td className="px-4 py-3 text-[#1A0A0A]">{r.year}</td>
                    <td className="px-4 py-3 text-xs text-[#1A0A0A]">{r.domain}</td>
                    <td className="px-4 py-3">
                      {r.submissionUrl ? (
                        <a href={r.submissionUrl} target="_blank" rel="noreferrer" className="font-mono text-xs text-[#1C0A0A] hover:underline">
                          OPEN ↗
                        </a>
                      ) : r.uploadId ? (
                        <button onClick={() => openFile(r.uploadId)} className="font-mono text-xs text-[#1A0A0A] hover:underline">
                          DOWNLOAD ⬇
                        </button>
                      ) : (
                        <span className="font-mono text-[10px] text-[#B4C0D8]">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {(rows || []).length === 0 && (
              <div className="px-5 py-10 text-center font-mono text-sm text-[#2A0A0A]">No registrations yet.</div>
            )}
          </div>
        )}
        {/* SCORES /30 */}
        {tab === 'scores' && (
          <div className="glass rounded-xl overflow-x-auto">
            <div className="px-5 py-4 font-mono text-[10px] tracking-[0.3em] text-[#B4C0D8] border-b border-[#465066]">
              SCORE SHEET · 30 MARKS = COMMUNICATION 10 · LIVE SHOW 10 · DOMAINS 10
            </div>
            <table className="w-full text-left text-sm border-collapse min-w-[820px]">
              <thead>
                <tr className="font-mono text-[10px] tracking-[0.25em] text-[#B4C0D8] border-b border-[#465066]">
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
                  <tr key={r.registrationId || r.id} className="border-b border-[#465066] align-top">
                    <td className="px-4 py-3 text-[#1A0A0A]">
                      {r.name}
                      <div className="font-mono text-[10px] text-[#B4C0D8]">{r.registrationId}</div>
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
                    <td className="px-4 py-3 font-display text-xl font-bold text-[#1A0A0A]">
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
                    <div className="font-mono text-[10px] tracking-[0.25em] text-[#B4C0D8]">{r.name}</div>
                    <div className="font-mono text-[9px] text-[#2A0A0A]">{r.registrationId}</div>
                  </div>
                  <div
                    className={`font-display text-5xl font-black text-center tracking-wider tabular-nums ${
                      t.status === 'running' ? 'text-[#1C0A0A] ticking' : t.remainingMs <= 5 * 1000 ? 'text-[#1A0A0A]' : 'text-[#1A0A0A]'
                    }`}
                    style={{ textShadow: t.status === 'running' ? '0 0 18px rgba(67,92,130,0.5)' : 'none' }}
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
        {/* INBOX — unanswered reg-helper questions */}
        {tab === 'inbox' && (
          <div className="glass rounded-xl overflow-hidden max-w-3xl">
            <div className="px-5 py-4 font-mono text-[10px] tracking-[0.3em] text-[#B4C0D8] border-b border-[#465066]">
              REG-HELPER INBOX · QUESTIONS THE BOT COULDN'T AUTO-ANSWER
            </div>
            {chats.length === 0 ? (
              <div className="px-5 py-10 text-center font-mono text-sm text-[#2A0A0A]">No unanswered questions yet.</div>
            ) : (
              <ul className="divide-y divide-[#465066]">
                {chats.map((c) => (
                  <li key={c.id} className="px-5 py-4 flex items-start justify-between gap-4">
                    <div>
                      <div className="font-mono text-xs text-[#1A0A0A] leading-relaxed">{c.text}</div>
                      <div className="mt-2 font-mono text-[10px] tracking-[0.2em] text-[#B4C0D8]">
                        {String(c.source || 'site').toUpperCase()} · {new Date(c.at).toLocaleString()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
            <div className="px-5 py-3 border-t border-[#465066] font-mono text-[10px] text-[#B4C0D8]">
              Call organizer <span className="text-[#1C0A0A]">+91 73396 14244</span> to answer these live.
            </div>
          </div>
        )}
        {/* SECURITY */}
        {tab === 'security' && (
          <div className="glass rounded-xl p-6 max-w-xl">
            <div className="font-mono text-[10px] tracking-[0.3em] text-[#B4C0D8] mb-1">AT-REST &amp; SESSION</div>
            <h3 className="font-display text-xl font-bold text-[#1A0A0A] mb-3">SECURITY</h3>
            <ul className="space-y-3 font-mono text-xs text-[#D3A5A0]">
              <li><span className="text-[#1C0A0A]">✓</span> Passwords — scrypt (N=16384) hashed, never stored raw.</li>
              <li><span className="text-[#1C0A0A]">✓</span> Admin login — HttpOnly session cookie, HMAC-signed, 12h expiry.</li>
              <li><span className="text-[#1C0A0A]">✓</span> Registrations, scores, timer, uploads — AES-256-GCM encrypted at rest.</li>
              <li><span className="text-[#1C0A0A]">✓</span> Score sheet — 30 marks (Communication/Live Show/Domains).</li>
              <li><span className="text-[#1C0A0A]">✓</span> Live clock — server-authoritative 5:00 per team.</li>
              <li><span className="text-[#1C0A0A]">✓</span> Uploads — optional ≤2MB, base64, encrypted, admin-download only.</li>
            </ul>
            <p className="mt-6 font-mono text-[11px] text-[#B4C0D8]">
              Run this app on your own server for full at-rest residency. On Vercel, set{' '}
              <span className="text-[#1A0A0A]">SESSION_SECRET</span>, <span className="text-[#1A0A0A]">STORE_KEY</span> and{' '}
              <span className="text-[#1A0A0A]">MONGODB_URI</span> env vars.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
