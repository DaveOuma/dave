# Vercel Deployment Guide (Django 6 — Zero-Configuration)

## Root Cause

The deployment returns **404** because of two compounding misconfigurations:

### 1. `outputDirectory` turned Django into a static-only site (primary 404 cause)

The previous `vercel.json` contained:

```json
"outputDirectory": "davidouma_portfolio/staticfiles"
```

`outputDirectory` tells Vercel to publish **only files from that folder** as a static site. After `collectstatic`, `staticfiles/` contains CSS, JS, and admin assets — **not** an `index.html` and **not** a Python Function handler. Vercel never routes `/` to Django, so every page returns **404**.

This is incompatible with [Vercel's zero-configuration Django support](https://vercel.com/docs/frameworks/full-stack/django) (April 2026), where Django becomes a single serverless Function backed by `wsgi.py` / `asgi.py`.

### 2. Root Directory points at the wrong folder (Python Function never created)

The Git repository root is `dave/`, but the Django project lives in `davidouma_portfolio/`:

```
dave/                          ← Git repo root (current Vercel Root Directory)
└── davidouma_portfolio/       ← Django project (manage.py, vercel.json, requirements.txt)
    ├── manage.py
    ├── vercel.json
    ├── requirements.txt
    └── davidouma_portfolio/
        └── wsgi.py
```

With **Root Directory = repository root**, Vercel looks for `manage.py` at `dave/manage.py`. It does not exist there, so:

- Django is **not** detected as a Python application
- No Python Function is created
- `vercel.json` inside the subdirectory is **ignored**

### Contributing misconfigurations (now fixed)

| Issue | Effect |
|-------|--------|
| `buildCommand: "cd davidouma_portfolio && ..."` | Fails when Root Directory is already `davidouma_portfolio`; redundant when correct |
| `framework: "python"` | Overrides auto-detection; use **Other** (`null`) so Vercel detects Django via `manage.py` |
| `pyproject.toml` entrypoint `davidouma_portfolio.api.index:app` | Points to a non-existent module; breaks handler resolution |
| `api/index.py` + `/api` rewrites | **Deprecated** since April 2026; replaced by zero-config WSGI |
| `@vercel/python` + `builds` array | **Deprecated** legacy builder; no longer used for Django |

## Investigation Summary

| Check | Result |
|-------|--------|
| Vercel detecting Python/Django? | **No** — `manage.py` not at configured Root Directory |
| `vercel.json` follows 2026 Django docs? | **Was not** — fixed to zero-config pattern |
| `@vercel/python` still correct? | **No** — deprecated; use native Django WSGI detection |
| Routes/rewrites correct? | **N/A** — rewrites to `/api` are no longer needed |
| `manage.py` correct entry point? | **Yes** — Vercel runs it to discover `DJANGO_SETTINGS_MODULE` |
| Django 6 deployment changes? | **None** — same WSGI zero-config flow |
| Python Function created? | **No** — blocked by Root Directory + `outputDirectory` |
| Dashboard overrides `vercel.json`? | **Yes** — `buildCommand`, `outputDirectory`, and `framework` in either place take effect; clear dashboard overrides |
| Output Directory interfering? | **Yes** — this was the direct 404 cause |
| Environment variables blocking startup? | **No** — misconfig would cause 500, not 404 |
| Repository structure compatible? | **Only** when Root Directory = `davidouma_portfolio` |
| 2026 Vercel Django changes? | **Zero-configuration** — no `api/` folder, no rewrites, no `@vercel/python` |

## Files Changed

| File | Action |
|------|--------|
| `vercel.json` | Replaced with zero-config functions config |
| `requirements.txt` | Pinned to Django 6; removed unused `gunicorn` / `django-cors-headers` |
| `davidouma_portfolio/settings.py` | Safer production defaults |
| `api/index.py` | **Deleted** — obsolete |
| `pyproject.toml` | **Deleted** — contained broken custom entrypoint |

## Corrected `vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "functions": {
    "davidouma_portfolio/wsgi.py": {
      "maxDuration": 60
    }
  }
}
```

No `buildCommand`, no `outputDirectory`, no `rewrites`, no `builds`, no `framework`.

Vercel automatically:

1. Finds `manage.py`
2. Reads `WSGI_APPLICATION` from settings (`davidouma_portfolio.wsgi.application`)
3. Creates one Python Function from `davidouma_portfolio/wsgi.py`
4. Runs `collectstatic` and serves `/static/` from the CDN

## Vercel Dashboard Settings

Go to **Project → Settings → General**:

| Setting | Required Value |
|---------|----------------|
| **Framework Preset** | **Other** |
| **Root Directory** | `davidouma_portfolio` |
| **Build Command** | *(leave empty — Vercel handles Django builds)* |
| **Output Directory** | *(leave empty — must NOT be set)* |
| **Install Command** | *(leave empty — Vercel installs from `requirements.txt`)* |

> If Build Command or Output Directory are set in the dashboard, **clear them**. Dashboard values override `vercel.json` and will reintroduce the 404.

## Environment Variables

Set in **Project → Settings → Environment Variables** (Production):

| Variable | Value | Required |
|----------|-------|----------|
| `SECRET_KEY` | Long random string | **Yes** |
| `DEBUG` | `False` | **Yes** |
| `ALLOWED_HOSTS` | `.vercel.app,your-custom-domain.com` | **Yes** |
| `DATABASE_URL` | Auto-set when you add Vercel Postgres | Recommended |
| `EMAIL_HOST_USER` | Gmail address | Optional |
| `EMAIL_HOST_PASSWORD` | Gmail app password | Optional |

`DJANGO_SETTINGS_MODULE` is **not** required — Vercel discovers it from `manage.py`.

## Deployment Checklist

1. **Push** the corrected files to GitHub.
2. Open **Vercel → Project → Settings → General**.
3. Set **Root Directory** to `davidouma_portfolio` and save.
4. Set **Framework Preset** to **Other**.
5. Clear **Build Command** and **Output Directory** (both must be empty).
6. Add environment variables (`SECRET_KEY`, `DEBUG=False`, `ALLOWED_HOSTS`).
7. (Recommended) Add **Vercel Postgres** under Storage — sets `DATABASE_URL` automatically.
8. Redeploy from the **Deployments** tab (use **Redeploy** on latest, uncheck "Use existing Build Cache" for a clean build).
9. Verify in deployment logs:
   - `manage.py` is found
   - Dependencies install from `requirements.txt`
   - `collectstatic` runs
   - A Python Function is created for `davidouma_portfolio/wsgi.py`
10. Open `https://<your-project>.vercel.app/` — homepage should load.

## Verification: `/` Will Work After Fix

Request flow after the fix:

```
Browser GET /
  → Vercel Python Function (davidouma_portfolio/wsgi.py → application)
  → Django URL routing (davidouma_portfolio/urls.py → core.urls)
  → core.views.index
  → templates/core/index.html
```

Static assets are served separately from the CDN at `/static/...`.

## Local Development

```bash
cd davidouma_portfolio
python -m venv .venv
.venv\Scripts\activate        # Windows
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

For local Vercel emulation (CLI ≥ 50.38.0):

```bash
vercel dev
```

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| 404 on all routes | Clear Output Directory in dashboard; confirm Root Directory = `davidouma_portfolio` |
| 404 only on `/` | Confirm `core/urls.py` has `path('', views.index)` (it does) |
| 500 on startup | Check `SECRET_KEY` and `ALLOWED_HOSTS` include your `.vercel.app` domain |
| Static files 404 | Confirm `STATIC_ROOT` is set; check build logs for `collectstatic` |
| Database errors | Add Vercel Postgres or set `DATABASE_URL`; run migrations via `vercel env pull` + local migrate |
