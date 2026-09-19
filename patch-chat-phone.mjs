import fs from 'node:fs';
import path from 'node:path';

const R = 'D:/simonpeter/ReverseHack2k26';
const PHONE = '7339614244'; // user's contact, must appear everywhere
const use = (p) => path.join(R, p);
const get = (p) => fs.readFileSync(path.join(R, p), 'utf8');
const put = (p, s) => fs.writeFileSync(path.join(R, p), s);
const log = [];
const has = (p, needle) => get(p).includes(needle);

// ---------- 1) Hero.jsx — call button tel:7339614244 right after the Register link ----------
const HERO = 'src/components/Hero.jsx';
let hero = get(HERO);
if (!hero.includes(PHONE)) {
  // find the register <a> close to append the phone CTA after its closing </a>
  const m = hero.indexOf('aria-label="Register for the hackathon"');
  if (m !== -1) {
    const close = hero.indexOf('</a>', m);
    if (close !== -1) {
      const btn =
        `\n              <a\n                href="tel:+91${PHONE}"\n                aria-label="Call the Reverse Hackathon organizer at +91 ${PHONE}"\n                className="ml-2 inline-flex items-center gap-2 rounded-xl border border-[#4f8cff] bg-[#4f8cff]/10 px-6 py-3 font-display text-sm text-[#4f8cff] hover:bg-[#4f8cff]/20 transition-colors"\n              >\n                📞 +91 ${PHONE}\n              </a>`;
      hero = hero.slice(0, close + 5) + btn + hero.slice(close + 5);
      put(HERO, hero);
      log.push(`Hero phone CTA +91${PHONE} = ${has(HERO, PHONE)}`);
    } else log.push('Hero phone FAIL: no </a>');
  } else log.push('Hero phone FAIL: no register anchor');
} else log.push('Hero phone already present');

// ---------- 2) ChatBot.jsx (new) — floating FAQ helper incl. phone ----------
const FAQ = [
  { k: [/how ?do i register|how to register|register/i], a: 'Tap the REVERSEHACKATHLON logo → REGISTER. Pick SOLO or TEAM, fill your details, check the agreement box and SUBMIT → you get a REV2k26 ID instantly.' },
  { k: [/solo|alone|individua/i], a: 'SOLO = one hacker, judged /30 on Communication (10) + Live Show (10) + Domains (10). You submit your project URL or a file.' },
  { k: [/team|group|mate/i], a: 'TEAM = exactly 2 members. Add your partner name + roll no + a team name. The 5:00 timer and /30 score are shared by the pair.' },
  { k: [/timer|time|clock|min/i], a: 'Every team gets a live 5:00 presentation timer. The judge hits START on your slot — it tick-tocks in the admin Timer tab while you present.' },
  { k: [/score|mark|judg|30/i], a: 'You are scored live /30: Communication /10, Live Show /10, Domains /10 — saved by the judge right from the admin SCORES tab.' },
  { k: [/submit|url|link|upload|file/i], a: 'After registering paste your GitHub/repo URL or upload a file (2MB, encrypted). The judge opens it from the Teams list.' },
  { k: [/domain|ctf|web|reverse|crypto|iot/i], a: 'Pick the domain nearest your project: Web Exploitation, Reverse Engineering, CTF, Cryptography, IoT. Judged /10.' },
  { k: [/contact|phone|call|number|whatsapp/i], a: `Organizer line (call or WhatsApp): +91 ${PHONE}` },
  { k: [/cancel|delete|remove|change/i], a: `Email or call +91 ${PHONE} with your registration ID — fixed right away.` },
];

const BOT = `import { useEffect, useRef, useState } from 'react';

const PHONE = '${PHONE}';

const FAQ = ${JSON.stringify(FAQ, null, 2)};

function answer(text) {
  const q = text.toLowerCase();
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
    { from: 'bot', text: \`Hi! I'm the REVERSEHACKATHLON reg-helper. Ask me anything — register, team, timer, scores, domains, or call +91 ${PHONE}.\` },
  ]);
  const listRef = useRef(null);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [thread, open]);

  async function send(ev) {
    ev.preventDefault();
    const text = msg.trim();
    if (!text || busy) return;
    setThread((t) => [...t, { from: 'user', text }]);
    setMsg('');
    const auto = answer(text);
    if (auto) {
      setThread((t) => [...t, { from: 'bot', text: auto }]);
      return;
    }
    setBusy(true);
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      setThread((t) => [
        ...t,
        { from: 'bot', text: \`Good question — I've flagged it to the organizer. For instant help call +91 ${PHONE}.\` },
      ]);
    } catch {
      setThread((t) => [{ ...t[0] }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[90] flex flex-col items-end gap-3">
      {open && (
        <div className="flex max-h-[26rem] w-[min(92vw,21rem)] flex-col overflow-hidden rounded-2xl border border-[#4f8cff]/40 bg-[#101116]/95 text-[#eef0f6] shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-[#3a4a63] bg-[#1c2230] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ff4646] font-mono text-sm text-white">R</span>
              <div>
                <p className="font-display text-sm font-bold leading-none">REVERSEHACKBOT</p>
                <p className="mt-1 font-mono text-[9px] text-[#52e0a4]">ONLINE · answers instantly</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-[#8d90a3] hover:text-white">✕</button>
          </div>
          <div ref={listRef} className="flex-1 space-y-2 overflow-y-auto px-4 py-3 text-sm">
            {thread.map((m, i) => (
              <div key={i} className={\`flex \${m.from === 'user' ? 'justify-end' : 'justify-start'}\`}>
                <div className={\`max-w-[85%] rounded-xl px-3 py-2 \${m.from === 'user' ? 'bg-[#4f8cff] text-white' : 'bg-[#222736] text-[#eef0f6]'}\`}>{m.text}</div>
              </div>
            ))}
            {busy && <p className="font-mono text-[11px] text-[#8d90a3]">typing…</p>}
          </div>
          <form onSubmit={send} className="flex items-center gap-2 border-t border-[#3a4a63] p-2">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Ask about registration…"
              aria-label="Message the reg-helper bot"
              className="min-w-0 flex-1 rounded-lg border border-[#3a4a63] bg-[#0c0e13] px-3 py-2 font-mono text-xs text-[#eef0f6] placeholder:text-[#6a7085] focus:outline-none"
            />
            <button type="submit" disabled={busy || !msg.trim()} className="rounded-lg bg-[#ff4646] px-3 py-2 font-mono text-xs text-white disabled:opacity-40">
              SEND
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close the reg-helper bot' : 'Open the REVERSEHACKATHLON reg-helper bot'}
        className="grid h-14 w-14 place-items-center rounded-full border border-[#4f8cff]/50 bg-[#ff4646] text-2xl text-white shadow-[0_8px_30px_rgba(255,70,70,0.35)] hover:scale-105 transition-transform"
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
}
`;
put('src/components/ChatBot.jsx', BOT);
log.push('ChatBot.jsx created');

// ---------- 3) App.jsx — mount <ChatBot /> ----------
const APP = 'src/App.jsx';
let app = get(APP);
if (!app.includes('ChatBot')) {
  app = app.replace("import Hero from './components/Hero';", "import Hero from './components/Hero';\nimport ChatBot from './components/ChatBot';");
  if (app.includes('<Footer />')) {
    app = app.replace('<Footer />', '<Footer />\n      <ChatBot />');
  } else if (app.includes('</Routes>')) {
    app = app.replace('</Routes>', '</Routes>\n        <ChatBot />');
  }
  put(APP, app);
  log.push(`App mounts ChatBot = ${has(APP, 'ChatBot')}`);
} else log.push('App already has ChatBot');

// ---------- 4) api.js — append chat client fns ----------
const API = 'src/utils/api.js';
let api = get(API);
if (!api.includes('export async function sendChat')) {
  api += `

export async function sendChat(text) {
  const res = await fetch(\`\${API_BASE}/chat\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  return handle(res);
}

export async function fetchChats() {
  const res = await fetch(\`\${API_BASE}/admin/chats\`, { credentials: 'include' });
  return handle(res);
}
`;
  put(API, api);
  log.push('api.js chat fns appended');
}

// ---------- 5) server/index.js — /api/chat POST + /api/admin/chats GET ----------
const IX = 'server/index.js';
let ix = get(IX);
if (!ix.includes('/api/admin/chats')) {
  const chatRoutes = `
app.post('/api/chat', async (req, res) => {
  try {
    const text = String((req.body && req.body.text) || '').trim().slice(0, 500);
    if (!text) return res.status(400).json({ error: 'empty' });
    const list = readStore('chat', []);
    list.push({ text, at: new Date().toISOString(), answered: false });
    writeStore('chat', list);
    return res.json({ ok: true, count: list.length });
  } catch (err) {
    console.error('[chat] append failed:', err.message);
    return res.status(500).json({ error: 'Failed to save chat.' });
  }
});

app.get('/api/admin/chats', requireAdmin, (_req, res) => {
  res.json(readStore('chat', []));
});
`;
  const anchor = ix.indexOf('app.listen');
  if (anchor !== -1) {
    ix = ix.slice(0, anchor) + chatRoutes + '\n' + ix.slice(anchor);
    put(IX, ix);
    log.push(`server /api/chat + /api/admin/chats = ${has(IX, '/api/admin/chats')}`);
  } else log.push('server chat FAIL: no app.listen anchor');
} else log.push('server chat already present');

console.log(log.join('\n'));
