import { useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DOMAINS } from '../data/domains';
import { registerParticipant } from '../utils/api';

const YEARS = ['I', 'II', 'III'];
const PARTNER = { name: '', rollNo: '', year: 'I' };

const inputClass = 'field';

export default function Registration() {
  const [mode, setMode] = useState('solo');
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    year: '',
    rollNo: '',
    domain: '',
    agree: false,
  });
  const [teamName, setTeamName] = useState('');
  const [partner, setPartner] = useState({ ...PARTNER });
  const [status, setStatus] = useState('idle'); // idle | submitting | success | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const setPartnerField = (k) => (e) => setPartner((p) => ({ ...p, [k]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.agree) {
      setStatus('error');
      setError('Please agree to the event rules before registering.');
      return;
    }
    setStatus('submitting');
    try {
      const payload = {
        mode,
        name: form.name,
        email: form.email,
        phone: form.phone,
        year: form.year,
        rollNo: form.rollNo,
        domain: form.domain,
        agree: form.agree,
        ...(mode === 'team' ? { teamName, members: [partner] } : {}),
      };
      const res = await registerParticipant(payload);
      setResult(res);
      setStatus('success');
    } catch (err) {
      setStatus('error');
      setError(err.message);
    }
  };

  const reset = () => {
    setForm({ name: '', email: '', phone: '', year: '', rollNo: '', domain: '', agree: false });
    setTeamName('');
    setPartner({ ...PARTNER });
    setStatus('idle');
    setResult(null);
  };

  const domainOptions = useMemo(() => DOMAINS.map((d) => d.title), []);

  return (
    <section id="register" className="relative py-24 md:py-32 px-5">
      <div className="pointer-events-none absolute inset-0 grid-overlay opacity-30" />
      <div className="mx-auto max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6 }}
          className="grid gap-6 md:grid-cols-[1.1fr_0.9fr] md:items-end mb-12"
        >
          <div>
            <div className="font-mono text-xs tracking-[0.4em] text-[#e03131] mb-4">&lt;ENLIST.NOW /&gt;</div>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-[#0c1a33]">
              REGISTER YOUR <span className="text-gradient">STAND</span>
            </h2>
          </div>
          <p className="text-base md:text-lg text-[#43536e] md:text-right md:pb-1.5">
            DEP-CYS Year I, II &amp; III only. Go solo or pair up with one partner — your registration
            ID is your key to the arena.
          </p>
        </motion.div>

        <div className="glass rounded-2xl p-6 md:p-10 relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 scanline" />

          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0 }}
                className="relative z-10 text-center py-8"
              >
                <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#e03131] shadow-[0_0_40px_rgba(224,49,49,0.5)]">
                  <span className="font-display text-3xl font-black text-[#e03131]">✓</span>
                </div>
                <div className="font-mono text-xs tracking-[0.4em] text-[#e03131] mb-2">// SIGNAL RECEIVED</div>
                <h3 className="font-display text-2xl md:text-4xl font-bold text-[#0c1a33] mb-2">REGISTRATION CONFIRMED</h3>
                <p className="text-[#43536e]">You're locked in, soldier.</p>
                <div className="mx-auto mt-6 inline-block glass rounded-lg px-8 py-4">
                  <div className="font-mono text-[10px] tracking-[0.3em] text-[#5b6b87] mb-1">YOUR REGISTRATION ID</div>
                  <div className="font-display text-xl md:text-2xl font-bold text-[#e03131] neon-text tracking-[0.2em]">
                    {result?.registrationId || 'REV26-?????'}
                  </div>
                </div>
                <p className="mt-5 font-mono text-xs text-[#64748c]">
                  Save this ID — you'll verify with it at the check-in gate.
                </p>
                <button onClick={reset} className="btn-ghost mt-8 text-xs">Register Another</button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="relative z-10 space-y-7"
              >
                {/* Mode toggle */}
                <div className="flex justify-center gap-3">
                  {[
                    { id: 'solo', label: 'SOLO RUN' },
                    { id: 'team', label: 'TEAM DUO (2)' },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => setMode(m.id)}
                      className={`font-mono text-xs md:text-sm tracking-[0.2em] px-6 py-3 transition-all rounded ${
                        mode === m.id
                          ? 'bg-linear-to-r from-[#e03131] to-[#3b82f6] text-[#ffffff] font-bold shadow-[0_0_24px_rgba(224,49,49,0.5)]'
                          : 'border border-[#c4d1e6] text-[#43536e] hover:border-[#e03131]/50'
                      }`}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                {/* Leader / solo fields */}
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="font-mono text-[10px] tracking-[0.3em] text-[#5b6b87] block mb-1.5">
                      {mode === 'solo' ? 'FULL NAME' : 'LEADER NAME'}
                    </label>
                    <input className={inputClass} value={form.name} onChange={set('name')} placeholder="Alex Carter" required />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-[0.3em] text-[#5b6b87] block mb-1.5">EMAIL</label>
                    <input className={inputClass} type="email" value={form.email} onChange={set('email')} placeholder="you@depcys.edu" required />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-[0.3em] text-[#5b6b87] block mb-1.5">PHONE</label>
                    <input className={inputClass} type="tel" value={form.phone} onChange={set('phone')} placeholder="+91 98765 43210" required />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-[0.3em] text-[#5b6b87] block mb-1.5">ROLL NO.</label>
                    <input className={inputClass} value={form.rollNo} onChange={set('rollNo')} placeholder="CYS-202X-XXXX" required />
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-[0.3em] text-[#5b6b87] block mb-1.5">YEAR</label>
                    <select className={inputClass} value={form.year} onChange={set('year')} required>
                      <option value="">Select year…</option>
                      {YEARS.map((y) => (
                        <option key={y} value={y}>Year {y}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="font-mono text-[10px] tracking-[0.3em] text-[#5b6b87] block mb-1.5">FOCUS DOMAIN</label>
                    <select className={inputClass} value={form.domain} onChange={set('domain')} required>
                      <option value="">Pick a battleground…</option>
                      {domainOptions.map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Team-only extra fields */}
                <AnimatePresence>
                  {mode === 'team' && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden space-y-6"
                    >
                      <div>
                        <label className="font-mono text-[10px] tracking-[0.3em] text-[#3b82f6] block mb-1.5">// TEAM NAME</label>
                        <input className={inputClass} value={teamName} onChange={(e) => setTeamName(e.target.value)} placeholder="ShellShocked" required />
                      </div>

                      <div>
                        <div className="mb-3 flex items-center gap-2">
                          <label className="font-mono text-[10px] tracking-[0.3em] text-[#3b82f6]">
                            // PARTNER <span className="text-[#64748c] normal-case">(your duo)</span>
                          </label>
                          <span className="rounded-full border border-[#ffb020]/40 bg-[#ffb020]/10 px-2 py-0.5 font-mono text-[9px] tracking-wider text-[#ffd28a]">
                            MAX 1 · TEAM OF 2
                          </span>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-[1fr_0.45fr_0.3fr]">
                          <input
                            className={inputClass}
                            value={partner.name}
                            onChange={setPartnerField('name')}
                            placeholder="Partner name"
                            required
                          />
                          <input
                            className={inputClass}
                            value={partner.rollNo}
                            onChange={setPartnerField('rollNo')}
                            placeholder="Roll no."
                            required
                          />
                          <select className={inputClass} value={partner.year} onChange={setPartnerField('year')} required>
                            {YEARS.map((y) => (
                              <option key={y} value={y}>Yr {y}</option>
                            ))}
                          </select>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Agree */}
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={form.agree}
                    onChange={(e) => setForm((f) => ({ ...f, agree: e.target.checked }))}
                    className="mt-0.5 h-4 w-4 accent-[#e03131]"
                    required
                  />
                  <span className="text-xs tracking-wide text-[#43536e]">
                    I confirm I am a <b className="text-[#0c1a33]">DEP-CYS</b> student in Year <b className="text-[#e03131]">{form.year || 'I/II/III'}</b>,
                    and I agree to the event rules, ethical-hacking constraints and code of conduct.
                  </span>
                </label>

                {error && (
                  <div className="border border-[#d92636]/50 bg-[#d92636]/10 px-4 py-3 font-mono text-xs text-[#d92636]">
                    <span className="text-[#ff5c52]">✕</span> {error}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-neon w-full text-center disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {status === 'submitting' ? 'TRANSMITTING SIGNAL…' : mode === 'solo' ? '// Deploy Solo' : '// Deploy Duo'}
                </button>

                <div className="text-center font-mono text-[10px] tracking-[0.3em] text-[#64748c]">
                  SLOTS ARE LIMITED TO DEP-CYS I · II · III — FIRST COME, FIRST SERVED
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}