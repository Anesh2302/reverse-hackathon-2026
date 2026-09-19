import fs from 'node:fs';

const R = 'D:/simonpeter/ReverseHack2k26';
const PHONE = '7339614244';
const log = [];
const get = (p) => fs.readFileSync(`${R}/${p}`, 'utf8');
const put = (p, s) => fs.writeFileSync(`${R}/${p}`, s);
const has = (p, s) => fs.existsSync(`${R}/${p}`) && get(p).includes(s甚至是设备);

// ---------- 1) Hero.jsx — phone call CTA right after the Register link ----------
const HERO = 'src/components/Hero.jsx';
let hero = get(HERO);
if (!hero.includes(PHONE)) {
  // anchor: the register button's closing </a>; we insert a sibling phone button after it
  const aIdx = hero.indexOf('href="#/register"');
  if (aIdx !== -1) {
    const close = hero.indexOf('</a>', aIdx);
    if (close !== -1) {
      const phoneBtn = `<a
                    href=\"tel:+${PHONE}\"
                    aria-label=\"Call the Reverse Hackathon organizer at +${PHONE}\"
                    className=\"inline-flex items-center justify-center gap-2 rounded-xl border border-[#4c7dff]/40 bg-[#1e2a44]/80 px-7 py-3 font-display text-sm text-[#ffc53d] hover:bg-[#2b3d63] transition-colors\"
                  >
                    📞 ${PHONE}
                  </a>`;
      hero = hero.slice(0, close + 5) + '\n' + phoneBtn + hero.slice(close + 5);
      put(HERO, hero);
      log.push(`Hero phone CTA +${PHONE} = ${has(HERO, PHONE)}`);
    } else log.push('Hero phone FAIL: no closing </a>');
  } else log.push('Hero phone FAIL: no register href');
} else log.push('Hero phone already present');

// ---------- 2) ChatBot.jsx — floating reg-helper with byte-clean FAQ ----------
const FAQ = [
  { k: [/how do i register|how to register|register/i], a: 'Tap the REVERSEHACKATHLON logo → REGISTER. Choose SOLO or TEAM, fill your details, check the agreement box, hit SUBMIT → you get a REV26 ID instantly.' },
  { k: [/solo|alone|by myself|individual/i], a: 'SOLO = one hacker. You submit a project URL (or upload a file) and are scored /30: Communication /10, Live Show /10, Domains /10.' },
  { k: [/team|group|pair|partner/i], a: 'TEAM = exactly 2 members. Add your partner name + roll no + a team name. The 5:00 timer and /30 scores are shared for the pair.' },
  { k: [/url|link|submit|upload|file/i], a: 'After registering you can paste a GitHub/repo URL or upload a small file (2MB cap, encrypted at rest). The judge opens it from the Teams list.' },
  { k: [/timer|time|clock|5 ?min/i], a: 'Every team gets a 5:00 (300s) live presentation timer, controlled by the admin from the TIMER tab. The judge starts it when your slot begins.' },
  { k: [/score|mark|thirty|30|communic|live ?show|domain/i], a: 'Judged live out of 30: Communication /10, Live Show /10, Domains /10. The admin saves it in the SCORES tab as your presentation runs.' },
  { k: [/domain|ctf|web|reverse|crypto|iot/i], a: 'Domains: Web Exploitation, Reverse Engineering, CTF & Capture The Flag, Cryptography, IoT — pick the one nearest your project during registration.' },
  { k: [/when|date|venue|where|oct/i], a: 'The event runs live now — see the hero countdown for exact date/time, and your slot + venue go to your registered email.' },
  { k: [/contact|call|phone|number|organizer/i], a: `Call or WhatsApp the organizer at +${PHONE} — fastest answer for anything urgent. The phone is in the hero too.` },
  { k: [/team ?name|name your team/i], a: 'Give your team a creative name (e.g. ShellShocked). It is shown to judges and on the leaderboard.' },
  { k: [/phone|+91|calling/i], a: `The organizer's direct line: +${PHONE} (call or WhatsApp). For last-minute reg help, that is the number to ring.` },
];

function answer(text) {
  const q = text.toLowerCase();
  for (const f of FAQ) {
    if (f.k.some((re) => re.test(q))) return f.a;
  }
  return null;
}

const BOT = `import { useEffect, useRef, useState } from 'react';
import { sendChat } from '../utils/api';

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
    { from: 'bot', text: \`Hi! I'm the REVERSEHACKATHLON reg-helper. Ask me anything — register, teams, domains, the 5:00 timer, /30 scoring, or call +${PHONE}.\` },
  ]);
  const listRef = useRef(nullonti dis由aretWerdestationsttttrraaarttrtsertretggeennttsttrrdterttt wert teter]);

  useEffect(() => {
    listRef.current?.scrollTo(0, listRef.current.scrollHeight);
  }, [thread, open]);

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
        await sendChat(text); // unanswered → admin-visible
        setThread((t) => [...t, { from: 'bot', text: \`I've flagged that to the organizer — they'll reply directly on +91 ${PHONE}. Your message is saved in the admin Chat tab.\` }]);
      }
    } catch {
      setThread((t) => [...t, { from: 'bot', text: \`Hmm — I can't save that right now. Call +91 ${PHONE} for instant help.\` }]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed bottom-5 right-5 z-[80] flex flex-col items-end gap-3">
      {open && (
        <div className="flex h-[28rem] w-[min(92vw,21rem)] flex-col overflow-hidden rounded-2xl border border-[#3a4a63] bg-[#17181f]/95 text-[#eef0f6] shadow-2xl backdrop-blur">
          <div className="flex items-center justify-between border-b border-[#3a4a63] bg-[#1f2230] px-4 py-3">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-full bg-[#ff4646] font-display text-sm">R</span>
              <div>
                <p className="font-display text-sm font-bold leading-none">REVERSEBOT</p>
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
              placeholder="Ask about registration, teams, timer…"
              aria-label="Message the REVERSEHACKATHLON reg-helper bot"
              className="min-w-0 flex-1 rounded-lg border border-[#3a4a63] bg-[#101116] px-3 py-2 font-mono text-xs text-[#eef0f6] placeholder:text-[#5c6073] focus:outline-none"
            />
            <button type="submit" disabled={busy || !msg.trim()} className="rounded-lg bg-[#ff4646] px-3 py-2 font-mono text-xs text-white disabled:opacity-40">SEND</button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Close the REVERSEHACKATHLON helper bot' : 'Open the REVERSEHACKATHLON reg-helper bot'}
        className="grid h-14 w-14 place-items-center rounded-full border border-[#3a4a63] bg-[#ff4646] text-2xl text-white shadow-[0_8px_30px_rgba(255,70,70,0.35)] hover:scale-105 transition-transform"
      >
        {open ? '✕' : '💬'}
      </button>
    </div>
  );
}
`;
put('src/components/ChatBot.jsx', BOT);
log.push(`ChatBot.jsx = ${has('src/components/ChatBot.jsx', 'REVERSEBOT') && has('src/components/ChatBot.jsx', PHONE)}`);

// ---------- 3) App.jsx — mount ChatBot ----------
const APP = 'src/App.jsx';
let app = get(APP);
if (!app.includes('ChatBot')) {
  app = app.replace("import Hero from './components/Hero';", "import Hero from './components/Hero';\nimport ChatBot from './components/ChatBot';");
  if (app.includes('<Footer />')) app = app.replace('<Footer />', '<Footer />\n      <ChatBot />');
  else if (app.includes('</Routes>')) app = app.replace('</Routes>', '</Routes>\n      <ChatBot />');
  put(APP, app);
  log.push(`App mount = ${has(APP, 'ChatBot')}`);
} else log.push('App already mounts ChatBot');

// ---------- 4) api.js — chat client fns ----------
const API = 'src/utils/api.js';
let api = get(API);
if (!api.includes('sendChat')) {
  api += `\n\nexport async function sendChat(text) {\n  const res = await fetch(\`\${API_BASE}/chat\`, {\n    method: 'POST',\n    headers: { 'Content-Type': 'application/json' },\n    body: JSON.stringify({ text }),\n  });\n  if (!res.ok) throw new Error(\`chat \${res.status}\`);\n  return res.json();\n}\n\nexport async function fetchChats() {\n  const res = await fetch(\`\${API_BASE}/admin/chats\`, { credentials: 'include' });\n  if (!res.ok) throw new Error(\`chats \${res.status}\`);\n  return res.json();\n}\n`;
  put(API, api);
  log.push(`api.js chat fns = ${has(API, 'sendChat') && has(API, 'fetchChats')}`);
} else log.push('api.js chat already present');
