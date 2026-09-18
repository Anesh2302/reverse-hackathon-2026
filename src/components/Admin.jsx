import { useState } from 'react';
import { getLocalRegistrations } from '../utils/api';

export default function Admin() {
  const [token, setToken] = useState(localStorage.getItem('revhack_admin_token') || '');
  const [rows, setRows] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fetchRows = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`/api/registrations?token=${encodeURIComponent(token)}`);
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || `Failed (${res.status})`);
      }
      const data = await res.json();
      setRows(data);
      localStorage.setItem('revhack_admin_token', token);
    } catch (err) {
      setError(err.message);
      setRows([]);
    } finally {
      setLoading(false);
    }
  };

  const downloadCSV = () => {
    if (!rows || rows.length === 0) return;
    const headers = ['ID', 'Mode', 'Name', 'Email', 'Phone', 'Year', 'Roll', 'Domain', 'TeamName', 'Members', 'SubmittedAt'];
    const lines = rows.map((r) =>
      [
        r.registrationId,
        r.mode,
        r.name,
        r.email,
        r.phone,
        r.year,
        r.rollNo,
        r.domain,
        r.teamName,
        (r.members || []).map((m) => `${m.name}(${m.year}/${m.rollNo})`).join('; '),
        new Date(r.submittedAt).toLocaleString(),
      ]
        .map((v) => `"${String(v ?? '').replace(/"/g, '""')}"`)
        .join(',')
    );
    const csv = [headers.join(','), ...lines].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'reverse-hackathon-2026-registrations.csv';
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const localRows = getLocalRegistrations();

  return (
    <div className="min-h-screen bg-[#f1f5fc] px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="font-mono text-xs tracking-[0.4em] text-[#e03131] mb-2">&lt;ADMIN.CONSOLE /&gt;</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#0c1a33]">REGISTRATION <span className="text-gradient">CONSOLE</span></h1>
          <a href="#top" className="font-mono text-xs text-[#3b82f6] hover:text-[#e03131]">← back to site</a>
        </div>

        {!rows && (
          <div className="glass rounded-xl p-8 mb-8">
            <label className="font-mono text-[10px] tracking-[0.3em] text-[#5b6b87] block mb-1.5">ADMIN TOKEN</label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                className="field flex-1"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                placeholder="Paste ADMIN_TOKEN from server/.env"
              />
              <button onClick={fetchRows} disabled={loading || !token} className="btn-neon text-xs px-8 py-3 disabled:opacity-50">
                {loading ? 'FETCHING…' : 'UNLOCK FEED'}
              </button>
            </div>
            {error && <p className="mt-3 font-mono text-xs text-[#d92636]">✕ {error}</p>}
          </div>
        )}

        {rows && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 glass rounded-lg px-5 py-4">
              <div className="font-mono text-sm text-[#e03131]">
                {rows.length} REGISTRATION{rows.length === 1 ? '' : 'S'} IN FEED
              </div>
              <div className="flex gap-3">
                <button onClick={downloadCSV} className="btn-ghost text-xs px-5 py-2">EXPORT CSV</button>
                <button onClick={() => setRows(null)} className="font-mono text-xs text-[#5b6b87] hover:text-[#e03131] transition-colors px-2">LOG OUT</button>
              </div>
            </div>

            <div className="glass-card rounded-xl overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[900px]">
                <thead>
                  <tr className="font-mono text-[10px] tracking-[0.25em] text-[#5b6b87] border-b border-[#cfd9ea]">
                    <th className="px-4 py-3">ID</th>
                    <th className="px-4 py-3">MODE</th>
                    <th className="px-4 py-3">NAME</th>
                    <th className="px-4 py-3">CONTACT</th>
                    <th className="px-4 py-3">YEAR</th>
                    <th className="px-4 py-3">ROLL</th>
                    <th className="px-4 py-3">DOMAIN</th>
                    <th className="px-4 py-3">TEAM</th>
                    <th className="px-4 py-3">SUBMITTED</th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr key={r.id || r.registrationId} className="border-b border-[#e3e9f4] hover:bg-[#e03131]/5 transition-colors align-top">
                      <td className="px-4 py-3 font-mono text-xs text-[#e03131]">{r.registrationId}</td>
                      <td className="px-4 py-3 font-mono text-xs">
                        <span className={`px-2 py-1 rounded ${r.mode === 'team' ? 'bg-[#e09c08]/15 text-[#b97506]' : 'bg-[#e03131]/10 text-[#e03131]'}`}>
                          {r.mode.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#0c1a33]">{r.name}</td>
                      <td className="px-4 py-3 text-xs text-[#43536e]">
                        <div>{r.email}</div>
                        <div className="text-[#5b6b87]">{r.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-[#e03131]">{r.year}</td>
                      <td className="px-4 py-3 font-mono text-xs">{r.rollNo}</td>
                      <td className="px-4 py-3 text-xs text-[#3b82f6]">{r.domain}</td>
                      <td className="px-4 py-3 text-xs text-[#43536e]">
                        {r.mode === 'team' ? (
                          <>
                            <div className="text-[#0c1a33]">{r.teamName}</div>
                            {(r.members || []).map((m, idx) => (
                              <div key={idx} className="text-[#5b6b87]">
                                {m.name} · {m.year} · {m.rollNo}
                              </div>
                            ))}
                          </>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-[#5b6b87]">
                        {new Date(r.submittedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length === 0 && (
                <div className="px-5 py-10 text-center font-mono text-sm text-[#64748c]">No registrations yet. The feed is empty.</div>
              )}
            </div>

            {localRows.length > 0 && (
              <div className="glass rounded-lg px-5 py-4 font-mono text-xs text-[#5b6b87]">
                <span className="text-[#e03131]">NOTE:</span> {localRows.length} local browser-registration{localRows.length === 1 ? '' : 's'} saved as offline fallback (visible only on the device where they were submitted).
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}