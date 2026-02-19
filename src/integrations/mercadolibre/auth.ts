import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export class MercadoLibreAuth {
    private clientId: string;
    private clientSecret: string;
    private redirectUri: string;
    private accessToken?: string;
    private refreshToken?: string;
    private expiresAt?: number;
    private refreshTimer?: NodeJS.Timeout;
    private tokenFilePath = path.join(process.cwd(), 'mercadolibre_tokens.json');

    constructor() {
        this.clientId = process.env.ML_CLIENT_ID || '';
        this.clientSecret = process.env.ML_CLIENT_SECRET || '';
        this.redirectUri = process.env.ML_REDIRECT_URI || 'https://lvh.me:3001/api/auth/mercadolibre/callback';

        if (!this.clientId || !this.clientSecret) {
            console.warn('[ML Auth] Missing ML_CLIENT_ID or ML_CLIENT_SECRET in .env');
        }

        this.loadTokens();

        // Auto-refresh on boot if we have tokens but they're expired
        if (this.refreshToken && this.expiresAt && Date.now() >= this.expiresAt) {
            console.log('[ML Auth] 🔄 Token expired on boot, auto-refreshing...');
            this.refreshAccessToken()
                .then(() => console.log('[ML Auth] ✅ Boot refresh successful'))
                .catch((e) => console.warn('[ML Auth] ⚠️  Boot refresh failed:', e.message));
        } else if (this.accessToken) {
            this.scheduleAutoRefresh();
        }
    }

    private loadTokens() {
        if (fs.existsSync(this.tokenFilePath)) {
            try {
                const data = JSON.parse(fs.readFileSync(this.tokenFilePath, 'utf-8'));
                this.accessToken = data.access_token;
                this.refreshToken = data.refresh_token;

                // Use saved absolute expiry timestamp if available, otherwise fall back
                if (data.expires_at) {
                    this.expiresAt = data.expires_at;
                } else if (data.saved_at && data.expires_in) {
                    // Calculate from when token was saved
                    this.expiresAt = data.saved_at + (data.expires_in * 1000);
                } else {
                    // Legacy: assume expired to force refresh
                    this.expiresAt = 0;
                }

                const remaining = this.expiresAt ? Math.round((this.expiresAt - Date.now()) / 1000) : 0;
                console.log(`[ML Auth] 💾 Loaded tokens from file. Expires in ${remaining}s (${remaining > 0 ? 'valid' : 'expired'})`);
            } catch (error: unknown) {
                const err = error as any;
                console.error('[ML Auth] Failed to load token file:', err);
            }
        } else {
            // Cloud Fallback: Load from Env Vars
            if (process.env.ML_ACCESS_TOKEN || process.env.ML_REFRESH_TOKEN) {
                console.log('[ML Auth] ☁️ Loading tokens from Environment Variables');
                this.accessToken = process.env.ML_ACCESS_TOKEN;
                this.refreshToken = process.env.ML_REFRESH_TOKEN;
                this.expiresAt = 0; // Force refresh on first use
            }
        }
    }

    private saveTokens(data: any) {
        try {
            // Save with absolute timestamps so we know real expiry on reload
            const enriched = {
                ...data,
                saved_at: Date.now(),
                expires_at: Date.now() + (data.expires_in * 1000),
            };
            fs.writeFileSync(this.tokenFilePath, JSON.stringify(enriched, null, 2));
            console.log('[ML Auth] 💾 Tokens saved to disk.');
        } catch (error: unknown) {
            const err = error as any;
            console.error('[ML Auth] Failed to save tokens:', err);
        }
    }

    // Schedule auto-refresh 10 minutes before token expiry
    private scheduleAutoRefresh() {
        if (this.refreshTimer) clearTimeout(this.refreshTimer);
        if (!this.expiresAt || !this.refreshToken) return;

        const refreshIn = Math.max(this.expiresAt - Date.now() - 10 * 60 * 1000, 5000); // At least 5s
        console.log(`[ML Auth] ⏰ Auto-refresh scheduled in ${Math.round(refreshIn / 60000)} minutes`);

        this.refreshTimer = setTimeout(async () => {
            try {
                console.log('[ML Auth] 🔄 Auto-refreshing token...');
                await this.refreshAccessToken();
                console.log('[ML Auth] ✅ Auto-refresh successful');
            } catch (e: any) {
                console.error('[ML Auth] ❌ Auto-refresh failed:', e.message);
            }
        }, refreshIn);
    }

    // Generate authorization URL for user to grant access
    getAuthUrl(state?: string): string {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.clientId,
            redirect_uri: this.redirectUri
        });

        if (state) {
            params.append('state', state);
        }

        return `https://auth.mercadolibre.com.mx/authorization?${params.toString()}`;
    }

    // Exchange authorization code for access token
    async getAccessToken(code: string): Promise<void> {
        try {
            console.log('[ML Auth] Sending token exchange request...');

            const params = new URLSearchParams();
            params.append('grant_type', 'authorization_code');
            params.append('client_id', this.clientId);
            params.append('client_secret', this.clientSecret);
            params.append('code', code.trim());
            params.append('redirect_uri', this.redirectUri);

            const { data }: any = await axios.post('https://api.mercadolibre.com/oauth/token', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            });

            this.accessToken = data.access_token;
            this.refreshToken = data.refresh_token;
            this.expiresAt = Date.now() + (data.expires_in * 1000);

            this.saveTokens(data);
            this.scheduleAutoRefresh();

            console.log('[ML Auth] ✅ Access token obtained, expires in', data.expires_in, 'seconds');
        } catch (error: unknown) {
            const err = error as any;
            const errorData = err.response?.data;
            console.error('[ML Auth] ❌ Failed to get access token:', JSON.stringify(errorData, null, 2) || err.message);
            throw new Error('Failed to obtain access token');
        }
    }

    // Refresh expired access token
    async refreshAccessToken(): Promise<void> {
        if (!this.refreshToken) {
            throw new Error('No refresh token available');
        }

        try {
            // FIX: Use URLSearchParams (form-encoded) instead of JSON object
            const params = new URLSearchParams();
            params.append('grant_type', 'refresh_token');
            params.append('client_id', this.clientId);
            params.append('client_secret', this.clientSecret);
            params.append('refresh_token', this.refreshToken);

            const { data }: any = await axios.post('https://api.mercadolibre.com/oauth/token', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            });

            this.accessToken = data.access_token;
            this.refreshToken = data.refresh_token;
            this.expiresAt = Date.now() + (data.expires_in * 1000);

            this.saveTokens(data);
            this.scheduleAutoRefresh();

            console.log('[ML Auth] ✅ Access token refreshed, next expiry in', data.expires_in, 'seconds');
        } catch (error: unknown) {
            const err = error as any;
            console.error('[ML Auth] ❌ Failed to refresh access token:', err.response?.data || err.message);
            throw new Error('Failed to refresh access token');
        }
    }

    // Get valid access token (auto-refresh if expired)
    async getValidToken(): Promise<string> {
        if (!this.accessToken) {
            this.loadTokens();
            if (!this.accessToken) {
                throw new Error('Not authenticated. Please authorize first via /api/auth/mercadolibre/auth');
            }
        }

        // Refresh if token expires in less than 5 minutes
        if (this.expiresAt && Date.now() >= (this.expiresAt - 5 * 60 * 1000)) {
            console.log('[ML Auth] Token expiring soon, refreshing...');
            await this.refreshAccessToken();
        }

        return this.accessToken;
    }

    // Check if authenticated (has tokens, even if expired — refresh will handle it)
    isAuthenticated(): boolean {
        return !!(this.accessToken || this.refreshToken);
    }
}
