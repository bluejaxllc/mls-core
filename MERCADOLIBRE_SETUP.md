# Mercado Libre API Instructions

## Add these lines to your .env file:

```bash
# Mercado Libre API (for real property data)
ML_CLIENT_ID=your_client_id_here
ML_CLIENT_SECRET=your_client_secret_here
ML_REDIRECT_URI=http://localhost:3001/api/auth/mercadolibre/callback
```

## How to Get Credentials:

1. **Register as Developer**
   - Visit: https://developers.mercadolibre.com.mx/
   - Click "Registrar" or "Sign Up"
   - Create your developer account

2. **Create an Application**
   - Go to "Mis aplicaciones" (My Applications)
   - Click "Crear nueva aplicación"
   - Fill in:
     - **Name**: "MLS Intelligence Chihuahua"
     - **Short description**: "Real estate listing aggregator for Chihuahua, Mexico"
     - **Redirect URI**: `http://localhost:3001/api/auth/mercadolibre/callback`
     - **Scopes**: (if asked) - read access to items
   
3. **Get Your Credentials**
   - After creating, you'll see:
     - **App ID** → This is your `ML_CLIENT_ID`
     - **Secret Key** → This is your `ML_CLIENT_SECRET`
   - Copy both values

4. **Update .env File**
   - Open `.env` in the root of your project
   - Add the three lines shown above
   - Replace `your_client_id_here` with your App ID
   - Replace `your_client_secret_here` with your Secret Key  
   - Save the file

5. **Restart Your Server**
   ```bash
   # Stop the current server (Ctrl+C)
   npx tsx watch src/server.ts
   ```

6. **Authorize the Application**
   - Open browser: http://localhost:3001/api/auth/mercadolibre/auth
   - Login with your Mercado Libre account
   - Grant permissions
   - You should see: `{"success":true,"message":"Authorization successful!"...}`

7. **Run the Crawler**
   ```bash
   npx tsx src/test_ml_crawler.ts
   ```

8. **View Results**
   - Open: http://localhost:3000/properties
   - You should now see **REAL** Chihuahua listings from Mercado Libre!

## Troubleshooting:

 **❌ "Invalid redirect URI"**
   - Make sure the Redirect URI in your Mercado Libre app settings **exactly matches**:  
     `http://localhost:3001/api/auth/mercadolibre/callback`

- **❌ "Client ID not found"**
   - Double-check you copied the App ID correctly to `.env`
   - Make sure there are no extra spaces

- **❌ "Not authenticated"**
   - You need to authorize first via: http://localhost:3001/api/auth/mercadolibre/auth
   - Authorization lasts ~6 hours, then needs refresh

- **❌ "No listings found"**
   - Mercado Libre might have limited Chihuahua listings
   - Try searching manually first: https://inmuebles.mercadolibre.com.mx/chihuahua
