# Saad Waseem — Portfolio (Full-Stack)

A decoupled portfolio website: a **React + Vite + TypeScript + Tailwind CSS** frontend backed by a **Django** API. All portfolio content — profile, skills, work experience, projects, engineering logs, delivery steps, and social links — lives in the Django backend (editable through the Django admin), and the frontend renders it. The contact form posts messages back to the API.

## Project structure

```
resume-portfolio/
├── backend/                  # Django backend (API + admin)
│   ├── manage.py             # Django entrypoint (run from this folder)
│   ├── requirements.txt      # Python dependencies (Django 4.2)
│   ├── db.sqlite3            # SQLite database (dev)
│   ├── portfolio_backend/    # Django project: settings, urls, wsgi
│   └── portfolio_api/        # Django app: models, views, admin, seed command
├── frontend/                 # React + Vite + TypeScript + Tailwind CSS
│   ├── index.html
│   ├── package.json          # Node dependencies & scripts
│   ├── vite.config.ts
│   ├── public/               # Static assets served as-is (resume.pdf)
│   └── src/                  # App code (main.tsx, dark_glow_portfolio.tsx, styles.css)
├── docs/                     # Reference notes & media (resume.pdf copy, videos, markdown notes)
└── README.md
```

## Tech stack

| Layer    | Technology                                   |
|----------|----------------------------------------------|
| Frontend | React, TypeScript, Vite, Tailwind CSS        |
| Backend  | Python 3, Django 4.2, SQLite (dev database)  |

## Backend

### Setup & run

```bash
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
python manage.py migrate
python manage.py seed_portfolio      # one-time: fills the admin with current content
python manage.py createsuperuser
python manage.py runserver
```

- Admin panel: <http://127.0.0.1:8000/admin/>
- API base: <http://127.0.0.1:8000/api>

The `seed_portfolio` command creates the portfolio records once. After that, manage everything in the Django admin:

- Site profile & about text
- Social links
- Skills
- Work experience
- Projects & case-study text
- Engineering logs
- Delivery/process steps
- Contact messages submitted through the portfolio

## Frontend

```bash
cd frontend
npm install
npm run dev          # dev server at http://localhost:5173
```

| Script           | What it does                                  |
|------------------|-----------------------------------------------|
| `npm run dev`    | Start the Vite dev server with HMR            |
| `npm run build`  | Type-check (`tsc -b`) + production build to `dist/` |
| `npm run preview`| Serve the production build locally            |

The frontend defaults to the API at `http://127.0.0.1:8000/api`. To point it somewhere else:

```bash
VITE_API_URL=http://localhost:8000/api npm run dev
```

The Vite dev server origin (`localhost:5173`) is already allow-listed in the backend CORS settings.

## API

| Method | Endpoint          | Description                                     |
|--------|-------------------|-------------------------------------------------|
| `GET`  | `/api/portfolio/` | Returns the published portfolio content (JSON). |
| `POST` | `/api/messages/`  | Stores a contact-form message.                  |

Example contact submission:

```json
{
  "name": "Jane Doe",
  "email": "jane@example.com",
  "message": "Hello, I'd like to work with you."
}
```

Submitted messages appear in the Django admin under **Contact messages**.

## Production notes

- Replace the `SECRET_KEY` in `backend/portfolio_backend/settings.py` and set `DEBUG = False`.
- Set real `ALLOWED_HOSTS` and restrict `CORS_ALLOWED_ORIGINS` to the deployed frontend origin.
- Swap SQLite for PostgreSQL and serve Django with Gunicorn behind Nginx.
- Deploy the frontend from `frontend/dist/` on a static host/CDN and point `VITE_API_URL` at the live API.
