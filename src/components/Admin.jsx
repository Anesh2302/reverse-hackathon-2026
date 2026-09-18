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
    <div className="min-h-screen bg-[#101116] px-5 py-20">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <div className="comic-chip bg-[#ffd34d] px-3 py-1 text-[10px] text-[#17181f] mb-4">&lt;ADMIN.CONSOLE /&gt;</div>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-[#eef0f6]">REGISTRATION <span className="text-gradient">CONSOLE</span></h1>
          <a href="#top" className="font-mono text-xs text-[#4f8cff] hover:text-[#ff4646]">← back to site</a>
        </div>

        {!rows && (
          <div className="glass rounded-xl p-8 mb-8">
            <label className="font-mono text-[10px] tracking-[0.3em] text-[#8d90a3] block mb-1.5">ADMIN TOKEN</label>
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
            {error && <p className="mt-3 font-mono text-xs text-[#ff4d4d]">✕ {error}</p>}
          </div>
        )}

        {rows && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 glass rounded-lg px-5 py-4">
              <div className="font-mono text-sm text-[#ff4646]">
                {rows.length} REGISTRATION{rows.length === 1 ? '' : 'S'} IN FEED
              </div>
              <div className="flex gap-3">
                <button onClick={downloadCSV} className="btn-ghost text-xs px-5 py-2">EXPORT CSV</button>
                <button onClick={() => setRows(null)} className="font-mono text-xs text-[#8d90a3] hover:text-[#ff4646] transition-colors px-2">LOG OUT</button>
              </div>
            </div>

            <div className="glass-card rounded-xl overflow-x-auto">
              <table className="w-full text-left text-sm border-collapse min-w-[900px]">
                <thead>
                  <tr className="font-mono text-[10px] tracking-[0.25em] text-[#8d90a3] border-b border-[#4a4e60]">
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
                    <tr key={r.id || r.registrationId} className="border-b border-[#383b4a] hover:bg-[#ff4646]/5 transition-colors align-top">
                      <td className="px-4 py-3 font-mono text-xs text-[#ff4646]">{r.registrationId}</td>
                      <td className="px-4 py-3 font-mono text-xs">
                        <span className={`px-2 py-1 rounded ${r.mode === 'team' ? 'bg-[#ffc53d]/15 text-[#b97506]' : 'bg-[#ff4646]/10 text-[#ff4646]'}`}>
                          {r.mode.toUpperCase()}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-[#eef0f6]">{r.name}</td>
                      <td className="px-4 py-3 text-xs text-[#c9cbd8]">
                        <div>{r.email}</div>
                        <div className="text-[#8d90a3]">{r.phone}</div>
                      </td>
                      <td className="px-4 py-3 text-[#ff4646]">{r.year}</td>
                      <td className="px-4 py-3 font-mono text-xs">{r.rollNo}</td>
                      <td className="px-4 py-3 text-xs text-[#4f8cff]">{r.domain}</td>
                      <td className="px-4 py-3 text-xs text-[#c9cbd8]">
                        {r.mode === 'team' ? (
                          <>
                            <div className="text-[#eef0f6]">{r.teamName}</div>
                            {(r.members || []).map((m, idx) => (
                              <div key={idx} className="text-[#8d90a3]">
                                {m.name} · {m.year} · {m.rollNo}
                              </div>
                            ))}
                          </>
                        ) : (
                          '—'
                        )}
                      </td>
                      <td className="px-4 py-3 font-mono text-[10px] text-[#8d90a3]">
                        {new Date(r.submittedAt).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {rows.length === 0 && (
                <div className="px-5 py-10 text-center font-mono text-sm text-[#989bb0]">No registrations yet. The feed is empty.</div>
              )}
            </div>

            {localRows.length > 0 && (
              <div className="glass rounded-lg px-5 py-4 font-mono text-xs text-[#8d90a3]">
                <span className="text-[#ff4646]">NOTE:</span> {localRows.length} local browser-registration{localRows.length === 1 ? '' : 's'} saved as offline fallback (visible only on the device where they were submitted).
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}