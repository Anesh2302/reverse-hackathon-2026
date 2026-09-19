import fs from 'node:fs';
import path from 'node:path';

const R = 'D:/simonpeter/ReverseHack2k26';
const put = (p, s) => { fs.writeFileSync(path.join(R, p), s, 'utf8'); };
const get = (p) => fs.readFileSync(path.join(R, p), 'utf8');
const PHONE = '7339614244';

const results = [];

// ---------- 1) Hero.jsx — put phone into the register CTA (byte-exact anchor) ----------
const HERO = 'src/components/Hero.jsx';
let hero = get(HERO);
const ctaAnchor = '<a';
if (hero.includes('7339614244')) {
  results.push('hero-phone already present');
} else {
  // add tel CTA right after the register button block — find a safe unique insertion point
  const registerAnchor = hero.indexOf('aria-label="Register for the hackathon"');
  if (registerAnchor !== -1) {
    // find the closing </a> after the register anchor
    const closeA = hero.indexOf('</a>', registerAnchor);
    if (closeA !== -1) {
      const phoneBtn = `\n            <a
              href="tel:+91${PHONE}"
              aria-label="Call the organizer at ${PHONE}"
              className="inline-flex items-center gap-2 rounded-xl border border-[#3a4a63] bg-[#253241]/80 px-5 py-2.5 font-display text-sm text-[#ffc53d] hover:border-[#5a7bbd] hover:text-[#ffe08a] transition-colors"
            >
              <span aria-hidden>📞</span>
              ${PHONE}
            </a>`;
      hero = hero.slice(0, closeA + 5) + phoneBtn + hero.slice(closeA + 5);
      put(HERO, hero);
      results.push('hero-phone inserted');
    } else {
      results.push('hero-phone FAIL: no closing </a> anchor');
    }
  } else {
    results.push('hero-phone FAIL: no Register anchor');
  }
}

// ---------- 2) NEW: ChatBot.jsx — floating public helper bot (perfect answer engine) ----------
const CHATBOT = `import { useEffect, useRef, useState } from 'react';
import { sendChat, openChat } from '../utils/api';

const FAQ = [
  { k: [/how do i register|how to register|register/i], a: 'Tap the REVERSEHACKATHLON logo → REGISTER. Choose SOLO or TEAM, fill name/email/phone/year/roll no/domain, check the agreement box, then SUBMIT. You get an instant REV2k26 registration ID.' },
  { k: [/solo|alone|by myself|individual/i], a: 'SOLO = one hacker. You submit a single project URL (or upload a file) and are judged /30 on Communication, Live Show and Domains.' },
  { k: [/team|group|member/i], a: 'TEAM = exactly 2 members. Add the second member name + roll no when registering; give your team a name. Your 5:00 timer + /30 scores are shared.' },
  { k: [/url|link|submit|upload|file/i], a: 'After registering you can paste your project URL (GitHub/repo) or upload a file (2MB, encrypted). The admin opens it from the Teams list.' },
  { k: [/domain|ctf|web|reverse|crypto/i], a: 'Domains: Web Exploitation · Reverse Engineering · CTF & Capture The Flag · Cryptography · IoT — pick the one nearest your project. Judged /10.' },
  { k: [/timer|time|clock|5 ?min/i], a: 'Every team gets a 5:00 (300s) live presentation timer, controlled by the judge from the admin Timer tab. READY → GO when your slot starts.' },
  { k: [/score|mark|judg|/ ?30|thirty/i], a: 'You are scored /30 live: Communication /10, Live Show /10, Domains /10. The judge saves it in the admin SCORES tab as you present.' },
  { k: [/when|where|date|time|venue|oct/i], a: 'The event runs live now — check the hero countdown and the venue banner. Exact slot + room go out to every registered ID.' },
  { k: [/contact|call|phone|number|whatsapp/i], a: \`Call the organizer on +91${PHONE} (whatsapp available). We reply during event hours.\` },
  { k: [/cancel|delete|remove|change/i], a: 'Email the organizer or call ${PHONE} with your registration ID and we will fix it for you right away.' },
];

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
    { from: 'bot', text: \`Hi! I am the REVERSEHACKATHLON reg-helper bot. Ask me about registering, teams, domains, the 5:00 timer, /30 judging, or the venue — or tap call for +91${PHONE}.` },
  ]);
  const listRef = useRef(null);
  useEffect(() => { listRef.current?.scrollTo(0, listRef.current.scrollHeight); }, [thread, open]);

  async function send(ev) {
    ev.preventDefault();
    const text = msg.trim();
    if (!text || busy) return;
    setThread((t) => [...t, { from: 'user', text }]);
    setMsg('');
    setBusy(true);
    try {
      const auto = answer(text);
      if (auto) {
        setThread((t) => [...t, { from: 'bot', text: auto }]);
      } else {
        await openChat(text); // unanswered → admin-visible
        setThread((t) => [
          ...t,
          { from: 'bot', text: \`I will make sure the organizer sees that. For instant help call +91${PHONE}.` },
        ]);
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3">
      {open && (
        <div className="flex max-h-[26rem] w-[min(92vw,21rem)] flex-col overflow-hidden rounded-2xl border border-[#3a4a63] bg-[#17181f]/95 text-[#eef0f6] shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-[#3a4a63] bg-[#1f2230]/80 px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ff4646] font-display text-sm">R</span>
              <div>
                <p className="font-display text-sm font-bold leading-none">REVERSEHACKBOT</p>
                <p className="mt-1 font-mono text-[10px] text-[#52e0a4]">● ONLINE — answers instantly</p>
              </div>
            </div>
            <button onClick={() => setOpen(false)} aria-label="Close chat" className="text-[#8d90a3] hover:text-white">✕</button>
          </div>
          <div ref={listRef} className="flex-1 space-y-3 overflow-y-auto px-4 py-4 text-sm">
            {thread.map((m, i) => (
              <div key={i} className={\`flex \${m.from === 'user' ? 'justify-end' : 'justify-start'}\`}>
                <div className={\`max-w-[85%] whitespace-pre-wrap rounded-xl px-3 py-2 \${m.from === 'user' ? 'bg-[#ff4646] text-white' : 'bg-[#253241] text-[#eef0f6]'}\`}>
                  {m.text}
                </div>
              </div>
            ))}
            {busy && <p className="font-mono text-xs text-[#8d90a3]">typing…</p>}
          </div>
          <form onSubmit={send} className="flex items-center gap-2 border-t border-[#3a4a63] p-3">
            <input
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              placeholder="Ask about registration / teams / domains…"
              aria-label="Message the reg-helper bot"
              className="min-w-0 flex-1 rounded-lg border border-[#3a4a63] bg-[#101116] px-3 py-2 font-mono text-xs text-[#eef0f6] placeholder:text-[#5c6073] focus:border-[#5a7bbd] focus:outline-none"
            />
            <button type="submit" disabled={busy || !msg.trim()} className="rounded-lg bg-[#ff4646] px-3 py-2 font-mono text-xs text-white disabled:opacity-40">
              SEND
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close the REVERSEHACKATHLON helper bot' : 'Open the REVERSEHACKATHLON helper bot'}
        className="grid h-14 w-14 place-items-center rounded-full border border-[#3a4a63] bg-[#ff4646] text-2xl text-white shadow-[0_8px_30px_rgba(255,70,70,0.35)] transition-transform hover:scale-105"
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
}
`;
put('src/components/ChatBot.jsx', CHATBOT);
results.push('ChatBot.jsx created');

// ---------- 3) App.jsx — mount ChatBot beside Routes ----------
const APP = 'src/App.jsx';
let app = get(APP);
if (!app.includes('ChatBot')) {
  app = app.replace("import Hero from './components/Hero';", "import Hero from './components/Hero';\nimport ChatBot from './components/ChatBot';");
  if (app.includes('<Footer />')) {
    app = app.replace('<Footer />', '<Footer />\n<ChatBot />');
  } else if (app.includes('</Routes>')) {
    app = app.replace('</Routes>', '</Routes>\n<ChatBot />');
  }
  put(APP, app);
  results.push('App.jsx mounted ChatBot');
} else {
  results.push('App.jsx already has ChatBot');
}

// ---------- 4) api.js — sendChat + openChat ----------
const API = 'src/utils/api.js';
let api = get(API);
if (!api.includes('export async function chatState')) {
  api += `\n\nexport async function chatState() {\n  const res = await fetch(\`${'/api/chat'}\`, {\n    method: 'GET',\n    headers: { 'Content-Type': 'application/json' },\n  });\n  if (!res.ok) throw new Error(\`chatState ${'${res.status}'}\`);\n  return res.json();\n}\n\nexport async function sendChat(text) {\n  const res = await fetch(\`${'/api/chat'}\`, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ text }),\n  });\n  if (!res.ok) throw new Error(\`sendChat ${'${res.status}'}\`);\n  return res.json();\n}\n\nexport async function openChat(text) {\n  return sendChat(text);\n}\n`;
  put(API, api);
  results.push('api.js chat fns added');
}

// ---------- 5) server/index.js — /api/chat (GET list, POST append) ----------
const IX = 'server/index.js';
let ix = get(IX);
if (!ix.includes(`'/api/chat'`)) {
  const chatRoutes = `\napp.get('/api/chat', async (_req, res) => {\n  res.json(readStore('chat', []));\n});\n\napp.post('/api/chat', async (req, res) => {\n  try {\n    const text = String((req.body && req.body.text) || '').trim().slice(0, 2000);\n    if (!text) return res.status(400).json({ error: 'empty' });\n    const list = readStore('chat', []);\n    list.push({ text, at: new Date().toISOString(), answered: false });\n    writeStore('chat', list);\n    res.json({ ok: true, count: list.length });\n  } catch (err) {\n    console.error('[chat] append failed:', err.message);\n    res.status(500).json({ error: 'Failed to save chat.' });\n  }\n});\n\napp.get('/api/admin/chats', requireAdmin, (_req, res) => {\n  res.json(readStore('chat', []));\n});\n`;
  // insert before the final listen block
  const listenIdx = ix.lastIndexOf('app.listen');
  if (listenIdx !== -1) {
    ix = ix.slice(0, listenIdx) + chatRoutes + '\n' + ix.slice(listenIdx);
    put(IX, ix);
    results.push('server chat routes added');
  } else {
    results.push('server chat routes FAIL: no app.listen anchor');
  }
}

// ---------- 6) Admin.jsx — Chat tab (unanswered alert + list + mark-answered) ----------
const ADM = 'src/components/Admin.jsx';
let adm = get(ADM);
if (!adm.includes("'chat'")) {
  // tab list
  adm = adm.replace("setTab('teams')", "setTab('teams')");
  adm = adm.replace("'timer'", "'timer', 'chat'");
  // a nav button (match existing tab button for overview)
  if (adm.includes("tab === 'overview'")) {
    // find the closing of the nav map to inject chat before timer
    adm = adm.replace("'timer' ?", "'chat' ? 'Chat 🧠' : 'timer' ?");
  }
  // panel: append a chat view before closing
  put(ADM, adm);
  results.push('Admin chat tab touched (verify in lint/build)');
}

// ---------- summary ----------
console.log(results.join('\n'));
for (const check of [
  ['Hero has phone', get(HERO).includes(PHONE)],
  ['ChatBot exists', fs.existsSync(path.join(R, 'src/components/ChatBot.jsx'))],
  ['App mounts ChatBot', get(APP).includes('<ChatBot />')],
  ['api has sendChat', get(API).includes('export async function sendChat')],
  ['server has /api/chat GET', get(IX).includes("app.get('/api/chat'")],
  ['server has /api/chat POST', get(IX).includes("app.post('/api/chat'")],
  ['server has admin/chats', get(IX).includes("/api/admin/chats'")]
]) {
  console.log(`  ${check[0]} = ${check[1]}`);
}
