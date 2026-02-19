# Mercado Libre Setup - Quick Start Guide

## 🎯 Current Status
Browser is open at Mercado Libre registration page. Follow these steps:

---

## Step 1: Create Account (5 minutes)

**On the page that just opened:**

1. **If you have a Mercado Libre account:**
   - Enter your email
   - Click "Continuar"
   - Enter password

2. **If you DON'T have an account:**
   - Click "Crear cuenta" (Create account)
   - Enter your email
   - Verify your email
   - Complete registration

---

## Step 2: Create Developer Application (2 minutes)

**After logging in:**

1. You'll be at: https://developers.mercadolibre.com.mx/devcenter
2. Click **"Crear nueva aplicación"** (Create new application)
3. Fill in the form:
   - **Nombre**: `MLS Chihuahua`
   - **Descripción corta**: `Real estate aggregator`
   - **URL de redirección**: `http://localhost:3001/api/auth/mercadolibre/callback`
4. Click **"Guardar"** (Save)

---

## Step 3: Copy Credentials (1 minute)

After creating the app, you'll see:

```
App ID: 123456789012345
Secret Key: AbCdEf123456...
```

**Copy both values!**

---

## Step 4: Add to .env File (1 minute)

Open: `c:\Users\edgar\OneDrive\Desktop\AI APPS\MLS\.env`

Add these lines at the end:

```bash
# Mercado Libre API
ML_CLIENT_ID=paste_your_app_id_here
ML_CLIENT_SECRET=paste_your_secret_key_here
ML_REDIRECT_URI=http://localhost:3001/api/auth/mercadolibre/callback
```

Replace the values with what you copied in Step 3.

**Save the file.**

---

## Step 5: Authorize (30 seconds)

1. Open browser: http://localhost:3001/api/auth/mercadolibre/auth
2. Log in with your ML account (if prompted)
3. Click "Autorizar" to grant permissions
4. You should see: `{"success":true,"message":"Authorization successful!"}`

---

## Step 6: Run Crawler (30 seconds)

Open terminal and run:

```bash
npx tsx src/test_ml_crawler.ts
```

You should see:
```
✅ Authenticated!
Starting crawl...
[1/25] Processing: MLM...
   ✅ Saved: Casa en Venta...
```

---

## Step 7: View Real Data (10 seconds)

Open: http://localhost:3000/properties

You should now see **REAL** Mercado Libre listings instead of fake Unsplash photos!

---

## ⏱️ Total Time: ~10 minutes

Let me know when you've completed Step 4 (added credentials to .env) and I'll help you authorize and run the crawler!
