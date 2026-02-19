# MLS Core - Complete Deployment Guide

This guide will walk you through deploying your MLS application to production, making it accessible from Blue Jax (GHL).

---

## 📋 Prerequisites

Before you begin, make sure you have:
- ✅ A GitHub account
- ✅ Your Blue Jax API keys (from `.env` file)
- ✅ Git installed on your computer
- ✅ Node.js 18+ installed

---

## Part 1: Prepare Your Code for Deployment

### Step 1: Initialize Git Repository

Open a terminal in your project folder (`AI APPS/MLS`) and run:

```bash
git init
git add .
git commit -m "Initial MLS Core deployment"
```

### Step 2: Create GitHub Repository

**Option A: Using GitHub CLI (Recommended)**
```bash
# Install GitHub CLI if you haven't
# Windows: winget install --id GitHub.cli
gh auth login
gh repo create mls-core --public --source=. --push
```

**Option B: Manual Method**
1. Go to https://github.com/new
2. Repository name: `mls-core`
3. Make it Public
4. DO NOT initialize with README (you already have code)
5. Click "Create repository"
6. Copy the commands shown and run them:
```bash
git remote add origin https://github.com/YOUR_USERNAME/mls-core.git
git branch -M main
git push -u origin main
```

---

## Part 2: Deploy the Frontend (Vercel)

### Step 1: Create Vercel Account

1. Go to https://vercel.com
2. Click "Sign Up"
3. Choose "Continue with GitHub"
4. Authorize Vercel to access your GitHub account

### Step 2: Import Your Project

1. Click "Add New..." → "Project"
2. You'll see a list of your GitHub repos
3. Find `mls-core` and click "Import"

### Step 3: Configure Build Settings

Vercel will detect it's a Next.js app. Update these settings:

**Framework Preset:** Next.js  
**Root Directory:** `web` ← **IMPORTANT: Change this!**  
**Build Command:** `npm run build`  
**Output Directory:** `.next`  
**Install Command:** `npm install`

### Step 4: Add Environment Variables

Click "Environment Variables" and add these **one by one**:

| Name | Value | Notes |
|------|-------|-------|
| `NEXTAUTH_URL` | `https://YOUR-APP.vercel.app` | You'll get this URL after first deploy |
| `NEXTAUTH_SECRET` | Run `openssl rand -base64 32` in terminal | Random 32-char string |
| `BLUE_JAX_CLIENT_ID` | `pit-49706818-ed4d-4edf-b426-2566a0130135` | Your Agency Key |
| `BLUE_JAX_CLIENT_SECRET` | (leave empty for now) | Optional |
| `NEXT_PUBLIC_API_URL` | `TEMPORARY` | We'll update this after backend deploy |

**How to add each variable:**
1. Type the **Name** (e.g., `NEXTAUTH_URL`)
2. Paste the **Value**
3. Check all environments (Production, Preview, Development)
4. Click "Add"

### Step 5: Deploy!

1. Click "Deploy"
2. Wait 2-3 minutes for build to complete
3. You'll see "Congratulations!" with a URL like `https://mls-core-xyz.vercel.app`
4. **Copy this URL** - you'll need it!

### Step 6: Update NEXTAUTH_URL

1. Go to your Vercel project dashboard
2. Click "Settings" → "Environment Variables"
3. Find `NEXTAUTH_URL`
4. Click the "Edit" icon
5. Change the value to your actual URL (e.g., `https://mls-core-xyz.vercel.app`)
6. Click "Save"
7. Click "Redeploy" (top right) to apply changes

---

## Part 3: Deploy the Backend (Railway)

### Step 1: Create Railway Account

1. Go to https://railway.app
2. Click "Login" → "Login with GitHub"
3. Authorize Railway

### Step 2: Create New Project

1. Click "New Project"
2. Select "Deploy from GitHub repo"
3. Find and select `mls-core`
4. Railway will detect it's a Node.js project

### Step 3: Configure Build Settings

1. Click on your deployed service
2. Go to "Settings" tab
3. Update these:

**Build Command:**
```bash
npm install
```

**Start Command:**
```bash
npx ts-node src/server.ts
```

**Root Directory:** `/` (leave as default)

### Step 4: Add Environment Variables

Click "Variables" tab and add these:

```bash
PORT=3001
NODE_ENV=production
BLUE_JAX_AGENCY_KEY=pit-49706818-ed4d-4edf-b426-2566a0130135
BLUE_JAX_API_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJsb2NhdGlvbl9pZCI6IkdDM1E1ZXF3REt3Mk1oWlEwS1NqIiwidmVyc2lvbiI6MSwiaWF0IjoxNzM4NzE0OTU0NDU3LCJzdWIiOiJPeFN3YXZ6akc5NTBVYjRtM3RJWSJ9.Yw0zTH95k-dCwYolNpZi_PBXU-4T4lyLwpElJ_0bv88
```

**How to add variables in Railway:**
1. Click "New Variable"
2. Type `PORT` in the key field
3. Type `3001` in the value field
4. Click outside to save
5. Repeat for each variable

### Step 5: Get Your Backend URL

1. Go to "Settings" tab
2. Scroll to "Domains"
3. Click "Generate Domain"
4. You'll get a URL like: `https://mls-core-production.up.railway.app`
5. **Copy this URL!**

### Step 6: Test Backend Health

Visit: `https://YOUR-RAILWAY-URL.railway.app/health`

You should see:
```json
{
  "status": "ok",
  "service": "MLS Core API"
}
```

---

## Part 4: Connect Frontend to Backend

### Update Frontend Environment Variables

1. Go back to **Vercel Dashboard**
2. Click your project → "Settings" → "Environment Variables"
3. Find `NEXT_PUBLIC_API_URL`
4. Edit the value to your Railway URL: `https://YOUR-APP.up.railway.app`
5. Click "Save"
6. Click "Deployments" tab → Click "..." on latest deployment → "Redeploy"

---

## Part 5: Add to Blue Jax (GHL)

### Method 1: Custom Menu Link (Recommended)

1. Log in to your Blue Jax (GHL) account
2. Click the gear icon (⚙️) → "Settings"
3. Go to "**My Staff**" section
4. Click "**Customize Menu**"
5. Click "**+ Add Custom Menu Link**"
6. Fill in:
   - **Label:** `MLS Core`
   - **Link:** `https://YOUR-VERCEL-URL.vercel.app`
   - **Icon:** Choose 🏠 or 📊
   - **Open In:** `New Tab` or `Same Window`
   - **Visible To:** Select user roles (Agency Admin, Location Admin, etc.)
7. Click "**Save**"

Now your team will see "MLS Core" in the GHL sidebar menu!

### Method 2: Embed in Website (Advanced)

If you want to embed the MLS app in a GHL website:

1. Go to **Sites** → Select or create a site
2. Add a **Custom Code** element
3. Paste this HTML:

```html
<div style="width: 100%; height: 100vh;">
  <iframe 
    src="https://YOUR-VERCEL-URL.vercel.app" 
    width="100%" 
    height="100%" 
    frameborder="0"
    allow="clipboard-write"
    style="border: none;"
  >
  </iframe>
</div>
```

4. Save and publish the page

---

## ✅ Verification Checklist

After deployment, verify everything works:

### Frontend Tests
- [ ] Visit your Vercel URL
- [ ] Click "Sign In" → Login page appears
- [ ] Use credentials: `admin` / `admin`
- [ ] You're redirected to the dashboard
- [ ] Click around - all pages load correctly

### Backend Tests
- [ ] Visit `https://YOUR-RAILWAY-URL/health`
- [ ] Response shows `{"status":"ok"}`
- [ ] From frontend, go to `/provision`
- [ ] Fill out the form and submit
- [ ] Check Railway logs for success message

### GHL Integration Tests  
- [ ] Open GHL in a browser
- [ ] See "MLS Core" in the sidebar
- [ ] Click it - app loads
- [ ] All features work from within GHL

---

## 🔧 Common Issues & Solutions

### Issue: "Failed to fetch" errors in browser console

**Cause:** CORS not allowing your frontend domain  
**Solution:** Update `src/server.ts`:

```typescript
app.use(cors({
  origin: [
    'https://YOUR-VERCEL-URL.vercel.app',
    'http://localhost:3000'
  ]
}));
```

Commit and push changes, Railway will auto-redeploy.

---

### Issue: NextAuth "Callback URL Mismatch"

**Cause:** `NEXTAUTH_URL` doesn't match your actual domain  
**Solution:**
1. Vercel → Settings → Environment Variables
2. Edit `NEXTAUTH_URL` to match exactly (with https://)
3. Redeploy

---

### Issue: Railway "Build Failed"

**Cause:** Node version mismatch  
**Solution:** Add to `package.json`:

```json
"engines": {
  "node": ">=18.0.0"
}
```

---

### Issue: "Invalid JWT" when calling Blue Jax API

**Cause:** Token expired or wrong format  
**Solution:**
1. Generate a new token in Blue Jax
2. Update `BLUE_JAX_API_TOKEN` in Railway
3. Redeploy

---

## 🚀 Future Updates

To deploy updates after making changes:

### Frontend (Vercel)
```bash
git add .
git commit -m "Update description"
git push
```
Vercel auto-deploys on every push to `main`!

### Backend (Railway)
Same process - just push to GitHub, Railway auto-deploys.

### Manual Redeploy
- **Vercel:** Deployments → Click "..." → Redeploy
- **Railway:** Click "Deploy" button in dashboard

---

## 📞 Need Help?

If you encounter issues:

1. **Check Logs:**
   - Vercel: Dashboard → Deployments → Click on deployment → "Logs"
   - Railway: Dashboard → "Deployments" tab → Click deployment → "View Logs"

2. **Verify Environment Variables:**
   - Make sure all variables are set correctly
   - Check for typos in URLs

3. **Test Locally First:**
   - If it works locally but not in production, environment variables are likely the issue

---

**Congratulations! Your MLS Core is now live! 🎉**
