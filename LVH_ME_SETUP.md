# ⚠️ IMPORTANT: Redirect URI Update

Due to Mercado Libre's strict requirement for HTTPS and valid domain names, we're using **lvh.me** instead of localhost.

## What is lvh.me?

`lvh.me` is a special domain that:
- ✅ Automatically resolves to `127.0.0.1` (your local machine)
- ✅ Has a valid TLD (`.me`)
- ✅ Works with HTTPS (with self-signed cert)
- ✅ Is a standard developer tool for this exact purpose

## What You Need to Do

### 1. After Getting Credentials

Add to `.env`:
```bash
ML_CLIENT_ID=your_app_id_here
ML_CLIENT_SECRET=your_secret_key_here
ML_REDIRECT_URI=https://lvh.me:3001/api/auth/mercadolibre/callback
```

### 2. Authorization URL

Instead of:
```
http://localhost:3001/api/auth/mercadolibre/auth
```

Use:
```
https://lvh.me:3001/api/auth/mercadolibre/auth
```

### 3. View Results

Instead of:
```
http://localhost:3000/properties
```

Use:
```
https://lvh.me:3000/properties
```

## Browser Security Warning

When you visit `https://lvh.me:3001`, you'll see a security warning because we're using a self-signed certificate. This is NORMAL for local development.

**Click "Advanced" → "Proceed to lvh.me (unsafe)"** - it's safe because it's your own local server.

## Alternative: Use HTTP Only

If you prefer to avoid HTTPS warnings entirely, you can:
1. Go back to ML developer portal
2. Create a NEW application
3. Use this redirect instead: `https://example.com/callback` (temporary)
4. Later switch to ngrok for production testing

But **lvh.me is the easiest option for now**.
