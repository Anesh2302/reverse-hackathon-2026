import { useEffect, useRef, useState } from 'react';
import { sendChat } from '../utils/api';

const PHONE = '7339614244';

const FAQ = [
  {
    k: [/how do i register|register/i],
    a: 'Tap the REVERSEHACKATHLON logo, scroll to REGISTER. Pick SOLO (1 hacker) or TEAM (exactly 2), fill your name / roll no / year / domain, agree to the rules and SUBMIT. You get a REV2k26 reg ID instantly.',
  },
  {
    k: [/solo|alone|by myself/i],
    a: 'SOLO = one hacker. You present solo — your 5:00 timer runs just for you and you are scored /30: Communication /10, Live Show /10, Domains /10.',
  },
  {
    k: [/team|group|pair|duo/i],
    a: 'TEAM = exactly 2 members. Add your partner\'s name + roll no + a fun team name. One 5:00 timer and one /30 score are shared for the pair.',
  },
  {
    k: [/submit|url|link|upload|file|repo/i],
    a: 'After registering you can paste a GitHub/repo URL or upload a small file (2MB max, encrypted at rest). The judge opens it from the Teams list during your slot.',
  },
  {
    k: [/timer|time|clock|5 ?min|300/i],
    a: 'Every team gets a live 5:00 (300s) presentation timer. The admin starts it from the TIMER tab when your slot begins — watch it tick on the big clock.',
  },
  {
    k: [/score|mark|30|communication|live ?show|domain/i],
    a: 'Judged live out of 30: Communication /10, Live Show /10, Domains /10. The admin saves it in the SCORES tab while you present, and your total updates instantly.',
  },
  {
    k: [/contact|call|phone|whatsapp|number|organizer/i],
    a: `Call or WhatsApp the organizer: +${PHONE}. Fastest for last-minute reg help or slot changes.`,
  },
  {
    k: [/cash|prize|win|reward|winner/i],
    a: 'Winners are picked from the /30 leaderboard across SOLO and TEAM — top scores get the spotlight, a shout-out, and the REVERSEHACKATHLON bragging rights. Exact prizes are announced live at the finale.',
  },
  {
    k: [/deadline|end|last date|til|until/i],
    a: 'Registration closes when the countdown hits zero — the hero shows the live T-MINUS. Don\'t wait too long, slots are judged in registration order.',
  },
];

function answer(text) {
  const q = String(text || '').toLowerCase();
  for (const f of FAQ) {
    if (f.k.some((re) => re.test(q))) return f.a;
  }
  return null;
}

export default function ChatBot() {
  const [open, setOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [busy, setBusy] = useState(false);
  const [thread, setThread] = useState([
    {
      from: 'bot',
      text: `👋 I'm the REVERSEHACKATHLON reg-helper. Ask me anything — registration, teams, timer, scoring, or call +${PHONE}.`,
    },
  ]);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [thread, open]);

  async function send(ev) {
    ev.preventDefault();
    const text = msg.trim();
    if (!text || busy) return;
    setMsg('');
    const auto = answer(text);
    if (auto) {
      setThread((t) => [...t, { from: 'user', text }, { from: 'bot', text: auto }]);
      return;
    }
    setThread((t) => [...t, { from: 'user', text }]);
    setBusy(true);
    try {
      await sendChat(text);
      setThread((t) => [
        ...t,
        { from: 'bot', text: `Good question — I've flagged it to the organizer. For instant help call +${PHONE}.` },
      ]);
    } catch {
      setThread((t) => [...t, { from: 'bot', text: `I couldn't reach the server just now — call +${PHONE} and they'll help instantly.` }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[28rem] w-[min(92vw,21rem)] flex-col overflow-hidden rounded-2xl border border-[#1A3A6E] bg-[#061228]/95 text-[#DFECF4] shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-[#1A3A6E] bg-[#0E2448] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#DA2B36] font-display text-sm text-white">R</span>
              <div>
                <p className="font-display text-sm font-bold leading-none">REVERSEBOT</p>
                <p className="mt-1 font-mono text-[10px] text-[#DFECF4]">● ONLINE — answers instantly</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close the REVERSEHACKATHLON reg-helper bot" className="text-[#ADC5DE] hover:text-white">✕</button>
          </div>
          <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto px-4 py-3 text-sm">
            {thread.map((m, i) => (
              <div key={i} className={`flex ${m.from === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 ${m.from === 'user' ? 'bg-[#DA2B36] text-white' : 'bg-[#1A3A6E] text-[#DFECF4]'}`}>{m.text}</div>
              </div>
            ))}
            {busy && <p className="font-mono text-xs text-[#ADC5DE]">typing…</p>}
          </div>
          <form onSubmit={send} className="flex items-center gap-2 border-t border-[#1A3A6E] p-3">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Ask about registration, teams, timer…"
              aria-label="Message the REVERSEHACKATHLON reg-helper bot"
              className="min-w-0 flex-1 rounded-lg border border-[#1A3A6E] bg-[#0B1D3A] px-3 py-2 font-mono text-xs text-[#DFECF4] placeholder:text-[#4A6A94] focus:outline-none"
            />
            <button type="submit" disabled={busy || !msg.trim()} className="rounded-lg bg-[#DA2B36] px-3 py-2 font-mono text-xs text-white disabled:opacity-40">SEND</button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close the REVERSEHACKATHLON helper bot' : 'Open the REVERSEHACKATHLON reg-helper bot'}
        className="grid h-14 w-14 place-items-center rounded-full border border-[#C9981E]/50 bg-[#DA2B36] text-2xl text-white shadow-[0_8px_30px_rgba(26,86,219,0.35)] hover:scale-105 transition-transform"
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
}
