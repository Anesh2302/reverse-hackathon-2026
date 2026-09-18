# Reverse Hackathon 2026 — DEP-CYS

Official registration site for the **Reverse Hackathon 2026** (Oct 8, 2026), open only to
**DEP-CYS students in Year I, II & III**.

A premium editorial single-page site with:

- **15 cybersecurity domains** — each with curated live training platforms (TryHackMe, Hack The Box, PortSwigger, picoCTF, pwn.college, CryptoHack and more)
- **Premium agency design** — bold display hero, floating operations dashboard, brand marquee, animated stats, vivid gradient cards
- **3-hour event format** — solo **or** duo (team of 2) registration with live countdown to Oct 8, and a 5-minute showcase per pod
- **Node + Express + MongoDB** backend with automatic JSON-file fallback (zero-config local run)
- Admin registration console with CSV export at `/#/admin`

---

## Tech stack

| Layer    | Tool |
| -------- | ---- |
| Frontend | Vite 8 · React 19 · Tailwind 4 · Framer Motion |
| Backend  | Node · Express |
| Database | MongoDB (Mongoose) — falls back to `server/data/registrations.json` when no Mongo is available |

---

## Quick start (local)

```bash
npm install

# Terminal 1 — backend API (default port 5050)
npm run dev:server

# Terminal 2 — frontend (default port 5173, proxies /api → :5050)
npm run dev
```

Open http://localhost:5173

No MongoDB? Nothing extra to do — registrations are saved to `server/data/registrations.json`.

---

## Production

```bash
npm run build
npm run start      # serves dist/ + API on port 5050
```

Open http://localhost:5050

---

## Configure MongoDB (optional)

Create a `.env` file at the project root (or export env vars):

```env
MONGODB_URI=mongodb://localhost:27017
MONGODB_DB=reverse_hackathon_2026
ADMIN_TOKEN=your-secret-token
PORT=5050
```

For MongoDB Atlas, use your Atlas connection string. The schema is defined in
`server/lib/db.js` (`registrations` collection). If Mongo disconnects or isn't
configured, the API automatically falls back to the JSON-file store — nothing is lost.

---

## Verify the endpoints

```bash
curl http://localhost:5050/api/health
curl -X POST http://localhost:5050/api/register \
  -H "Content-Type: application/json" \
  -d '{"mode":"solo","name":"Alex","email":"a@b.edu","phone":"9876543210","year":"II","rollNo":"CYS-2025-001","domain":"Reverse Engineering","agree":true}'

# Duo (exactly 2 — leader + one partner in "members")
curl -X POST http://localhost:5050/api/register \
  -H "Content-Type: application/json" \
  -d '{"mode":"team","name":"Alex","email":"a@b.edu","phone":"9876543210","year":"II","rollNo":"CYS-2025-001","domain":"CTF","agree":true,"teamName":"ShellShocked","members":[{"name":"Jordan","year":"II","rollNo":"CYS-2025-002"}]}'

# Admin feed (token = ADMIN_TOKEN)
curl "http://localhost:5050/api/registrations?token=your-secret-token"
```

---

## Admin console

1. Make sure the backend is running with `ADMIN_TOKEN` set (default `change-me`).
2. Visit `http://localhost:5173/#/admin` (dev) or `http://localhost:5050/#/admin` (prod).
3. Paste the admin token → live table of every registration.
4. Export the full list as CSV.

> A local fallback note: submissions are also mirrored into the browser's
> localStorage (`revhack26_registrations`) so a copy always exists offline.

---

## Customize content

- **Event details** (date, venue, tagline, description): `src/data/domains.js` → `EVENT`
- **15 domains + their training links**: `src/data/domains.js` → `DOMAINS`
- **Colors / fonts / buttons**: `src/index.css` (CSS variables at the top)

---

## Project structure

```
ReverseHack2k26/
├─ index.html
├─ vite.config.js            # build + /api proxy
├─ server/
│  ├─ index.js               # Express API (register, admin list, static dist)
│  └─ lib/db.js              # Mongo (Mongoose) + JSON-file fallback
├─ src/
│  ├─ main.jsx / App.jsx     # #/admin hash routing
│  ├─ index.css              # theme system
│  ├─ data/domains.js        # EVENT + 15 DOMAINS config
│  ├─ utils/api.js           # registerParticipant + local mirror
│  ├─ three/CyberScene.jsx   # 3D background scene
│  └─ components/            # BootLoader, Navbar, Hero, Marquee, About, Stats,
│                            # HowItWorks, Domains, Registration, FAQ,
│                            # FinalCta, Footer, Admin
└─ public/favicon.svg
```