# LegalFlow AI

A legal-assistance SaaS dashboard: AI legal chat, a visual legal roadmap, a lawyer marketplace, and
a document generator (starting with Rental Agreements). Light and dark mode throughout.

This is split into two pieces you run side by side:

```
legalflow-app/
  frontend/   React + Vite + Tailwind app (port 5173)
  backend/    Express server — proxies AI chat requests, keeps your API key off the browser (port 4000)
```

Auth and data storage (chat history, roadmap progress, saved documents) are handled by **Supabase**,
which the frontend talks to directly using row-level security — that's why there's no separate
`/api/auth` or `/api/documents` route in the backend. The backend's one job is proxying AI chat
requests so your Anthropic key never reaches the browser.

## 1. Set up Supabase (auth + database)

1. Create a free project at [supabase.com](https://supabase.com).
2. In the SQL Editor, run `backend/schema.sql`. This creates `chat_messages`, `roadmap_progress`,
   `documents`, and `lawyers`, all with row-level security so users only see their own data.
3. Grab your Project URL, anon public key, and service role key from Project Settings → API —
   you'll need all three below.

## 2. Run the backend

```bash
cd backend
npm install
cp .env.example .env
# edit .env: set ANTHROPIC_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
npm run dev
```

Check it's up: `curl http://localhost:4000/api/health`

## 3. Run the frontend

```bash
cd frontend
npm install
cp .env.example .env
# edit .env: set VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY (same project as above)
# VITE_BACKEND_URL defaults to http://localhost:4000 — leave as-is for local dev
npm run dev
```

Open http://localhost:5173. Sign up, and you're in.

If the backend isn't running or `ANTHROPIC_API_KEY` isn't set yet, the AI Legal Chat screen still
works — it just returns a clearly-labeled demo response instead of a real model reply, so you can
develop the rest of the app without an API key.

## Project structure

```
frontend/
  src/
    components/auth/     Login, Signup, shared AuthShell
    components/layout/    Sidebar, Topbar, DashboardLayout
    context/              ThemeContext (light/dark), AuthContext (Supabase session)
    data/                 Mock lawyer directory, roadmap templates
    lib/                  Supabase client
    pages/                Dashboard, AIChat, Roadmap, Marketplace, DocumentGenerator
backend/
  src/server.js           Express app: /api/health, /api/chat
  schema.sql              Supabase tables + RLS policies
```

## Notes & next steps

- **Document types**: only Rental Agreement is wired up. Add a new type by writing a builder
  function (like `buildRentalAgreement` in `DocumentGenerator.jsx`) plus a form section — NDA and
  Employment Offer Letter are already stubbed in the dropdown.
- **Lawyer marketplace**: currently mock data grouped/sorted by city (`frontend/src/data/mockLawyers.js`).
  Point it at the `lawyers` table once you have real listings.
- **PDF export**: the document generator downloads plain `.txt` for simplicity. For polished PDF or
  Word output, add a library like `pdf-lib` or `docx` — either client-side or as a new backend route.
- **Production deploy**: the backend is a plain Express app, so it deploys anywhere Node runs
  (Render, Fly.io, a VPS, etc.); the frontend is a static Vite build (`npm run build` → `dist/`)
  deployable to Vercel, Netlify, or any static host. Update `VITE_BACKEND_URL` and `FRONTEND_ORIGIN`
  to your real URLs when you do.
- **Not legal advice**: every AI response and generated document should be reviewed by a licensed
  attorney before relying on it — the UI reflects this throughout.
