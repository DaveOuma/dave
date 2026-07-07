# Vercel Deployment Guide

## Root Cause Analysis

The deployment was failing because:
1. **Deprecated `builds` array**: Used old Vercel 2.0 format with `@vercel/python` which is deprecated
2. **No Python Function entry point**: Missing required `api/` directory for modern Vercel Python runtime
3. **Invalid routing**: Routes pointed to `manage.py` instead of a Vercel function handler

## Changes Made

### 1. Created `api/index.py`
- New Vercel Python function entry point
- Handles Django WSGI application
- Routes all requests through Django

### 2. Updated `vercel.json`
- Removed deprecated `builds` array
- Added modern `buildCommand` and `rewrites`
- Routes all traffic to `/api/index`

### 3. Updated `requirements.txt`
- Removed unnecessary packages (gunicorn, django-cors-headers)
- Pinned Django version for stability

### 4. Removed `start.sh`
- No longer needed with serverless architecture

## Vercel Dashboard Settings

### Environment Variables
Set these in Vercel dashboard → Settings → Environment Variables:

```
DEBUG=False
SECRET_KEY=<generate-secure-random-key>
ALLOWED_HOSTS=.vercel.app
DJANGO_SETTINGS_MODULE=davidouma_portfolio.settings
```

### Database
Vercel automatically provides PostgreSQL via `DATABASE_URL` environment variable when you add a Postgres database in Vercel dashboard.

### Email (Optional)
For email functionality:
```
EMAIL_HOST_USER=your-email@gmail.com
EMAIL_HOST_PASSWORD=your-gmail-app-password
```

## Deployment Steps

1. **Push changes to GitHub**
   ```bash
   git add .
   git commit -m "fix: migrate to modern Vercel Python deployment architecture"
   git push
   ```

2. **Import project in Vercel**
   - Go to vercel.com
   - Add New Project
   - Import from GitHub
   - Select this repository

3. **Configure environment variables**
   - Add required environment variables in Vercel dashboard

4. **Add PostgreSQL database** (optional but recommended)
   - Go to Storage → Create Database → Postgres
   - Vercel will automatically set `DATABASE_URL`

5. **Deploy**
   - Click Deploy
   - Vercel will automatically:
     - Install dependencies from requirements.txt
     - Run collectstatic
     - Deploy the Python function

## Verification

After deployment, verify:
- Homepage loads at `https://your-project.vercel.app/`
- Static files (CSS, JS) load correctly
- Contact form submits successfully
- Admin panel accessible at `/admin/`

## Local Development

No changes needed for local development:
```bash
python manage.py runserver
```

## Troubleshooting

### 404 Errors
- Check Vercel deployment logs
- Verify `api/index.py` exists
- Ensure `vercel.json` has correct rewrites

### Static Files Not Loading
- Verify `collectstatic` ran in build logs
- Check `STATIC_URL` in settings.py is `/static/`

### Database Connection Errors
- Ensure PostgreSQL is added in Vercel dashboard
- Verify `DATABASE_URL` environment variable is set
