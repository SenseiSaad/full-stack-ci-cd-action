# Saad Waseem — Portfolio

A monorepo containing the portfolio **frontend** (Next.js, deployed to AWS Amplify)
and a **backend** API (Django). The two are deployed and run **independently** —
the frontend currently ships as a self-contained static site and does **not** call
the backend. The backend is kept here for future use (connecting them is deliberately
deferred).

## Project structure

```
full-stack-ci-cd-action/
├── amplify.yml               # AWS Amplify monorepo build spec (frontend)
├── frontend/                 # Next.js 15 (App Router) — static-exported portfolio
│   ├── app/                  # routes: / , /projects , /logs
│   ├── components/           # UI sections (Hero, About, Experience, Works, ...)
│   ├── lib/                  # GSAP/scroll helpers
│   ├── public/               # static assets (art/, resume.pdf)
│   ├── next.config.mjs       # output: "export" -> static site in out/
│   ├── package.json
│   └── tsconfig.json
├── backend/                  # Django API + admin (independent; not wired to the frontend)
│   ├── manage.py
│   ├── requirements.txt      # Django 4.2
│   ├── portfolio_backend/    # Django project: settings, urls, wsgi
│   └── portfolio_api/        # Django app: models, views, admin, seed command
└── README.md
```

## Tech stack

| Layer    | Technology                                              |
|----------|---------------------------------------------------------|
| Frontend | Next.js 15, React 19, TypeScript, GSAP (static export)  |
| Hosting  | AWS Amplify (static CDN, no server runtime)             |
| Backend  | Python 3, Django 4.2, SQLite (dev) — independent        |

## Frontend

Content (profile, skills, work experience, projects, logs, process steps, links)
is kept in small TypeScript data modules under `components/` — edit those files to
update the site. No database or backend connection is required.

```bash
cd frontend
npm install
npm run dev          # dev server at http://localhost:3000
```

| Script          | What it does                                             |
|-----------------|----------------------------------------------------------|
| `npm run dev`   | Start the Next.js dev server with HMR                    |
| `npm run build` | Production build + static export to `out/`               |
| `npm run start` | Serve the production build locally                       |

Because `next.config.mjs` sets `output: "export"`, `npm run build` writes a fully
static site to `frontend/out/` — plain HTML/CSS/JS with no server needed.

## Deploying the frontend on AWS Amplify

The repo is already a monorepo; nothing needs restructuring.

1. AWS Console → **Amplify** → **Host web app** → connect this GitHub repo, branch `main`.
2. Amplify reads `amplify.yml` (app root `frontend`, artifacts `out/`). If asked for a
   monorepo root, enter `frontend`.
3. Save & deploy. The static build is served from CDN (cheapest tier, no SSR compute).
4. Every push to `main` auto-deploys — Amplify's built-in CI/CD handles it, so no
   GitHub Actions workflow is required for the frontend.

## Backend (independent, optional)

The Django API is unchanged and runs on its own. It is **not** connected to the
frontend in this deployment.

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver        # http://127.0.0.1:8000
```

- Admin panel: <http://127.0.0.1:8000/admin/>
- API base: <http://127.0.0.1:8000/api>

### API

| Method | Endpoint          | Description                                     |
|--------|-------------------|-------------------------------------------------|
| `GET`  | `/api/portfolio/` | Returns the published portfolio content (JSON). |
| `POST` | `/api/messages/`  | Stores a contact-form message.                  |

### Production notes

- Replace `SECRET_KEY` in `backend/portfolio_backend/settings.py` and set `DEBUG = False`.
- Set real `ALLOWED_HOSTS` and restrict `CORS_ALLOWED_ORIGINS`.
- Swap SQLite for PostgreSQL and serve Django with Gunicorn behind Nginx.
- To wire the frontend to this API later, add a data-fetching layer in `frontend/`
  and point it at the live API origin.
