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
    private tokenFilePath = path.join(process.cwd(), 'mercadolibre_tokens.json');


    constructor() {
        this.clientId = process.env.ML_CLIENT_ID || '';
        this.clientSecret = process.env.ML_CLIENT_SECRET || '';
        this.redirectUri = process.env.ML_REDIRECT_URI || 'https://lvh.me:3001/api/auth/mercadolibre/callback';

        if (!this.clientId || !this.clientSecret) {
            console.warn('[ML Auth] Missing ML_CLIENT_ID or ML_CLIENT_SECRET in .env');
        }

        this.loadTokens();
    }

    private loadTokens() {
        if (fs.existsSync(this.tokenFilePath)) {
            try {
                const data = JSON.parse(fs.readFileSync(this.tokenFilePath, 'utf-8'));
                this.accessToken = data.access_token;
                this.refreshToken = data.refresh_token;
                this.expiresAt = Date.now() + (data.expires_in * 1000);
                console.log('[ML Auth] 💾 Loaded persisted tokens from file.');
            } catch (error: unknown) {
                const err = error as any;
                console.error('[ML Auth] Failed to load token file:', err);
            }
        } else {
            // Vercel / Cloud Fallback: Load from Env Vars
            if (process.env.ML_ACCESS_TOKEN || process.env.ML_REFRESH_TOKEN) {
                console.log('[ML Auth] ☁️ Loading tokens from Environment Variables');
                this.accessToken = process.env.ML_ACCESS_TOKEN;
                this.refreshToken = process.env.ML_REFRESH_TOKEN;
                // Assume expired if loading from env, so it refreshes immediately on first use if only refresh token provided
                // Or if access token provided, assume valid for a bit but check. 
                // We don't have expiry in env usually. Let's set it to 0 to force refresh if only refresh token is present, 
                // or safely if access token is present.
                // Best strategy: check validity. If expiry is unknown, we might want to validate or just try.
                // For MVP: if we have Access Token, assume it works or let 401 trigger re-auth logic (if we had it).
                // But our logic relies on expiresAt.
                // Let's assume Env Var Access Token is fresh enough or valid for 1 hour from boot? No, that's risky.
                // Better: If we have Refresh Token, force a refresh on first use.
                // Setting expiresAt to 0 triggers refresh in getValidToken.
                this.expiresAt = 0;
            }
        }
    }

    private saveTokens(data: any) {
        try {
            fs.writeFileSync(this.tokenFilePath, JSON.stringify(data, null, 2));
            console.log('[ML Auth] 💾 Tokens saved to disk.');
        } catch (error: unknown) {
            const err = error as any;
            console.error('[ML Auth] Failed to save tokens:', err);
        }
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
            const { data }: any = await axios.post('https://api.mercadolibre.com/oauth/token', {
                grant_type: 'refresh_token',
                client_id: this.clientId,
                client_secret: this.clientSecret,
                refresh_token: this.refreshToken
            }, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded', // Ensure correct content type for refresh too
                    'Accept': 'application/json'
                }
            });

            this.accessToken = data.access_token;
            this.refreshToken = data.refresh_token;
            this.expiresAt = Date.now() + (data.expires_in * 1000);

            this.saveTokens(data);

            console.log('[ML Auth] ✅ Access token refreshed');
        } catch (error: unknown) {
            const err = error as any;
            console.error('[ML Auth] ❌ Failed to refresh access token:', err.response?.data || err.message);
            throw new Error('Failed to refresh access token');
        }
    }

    // Get valid access token (auto-refresh if expired)
    async getValidToken(): Promise<string> {
        if (!this.accessToken) {
            // Try explicit load just in case
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

    // Check if authenticated
    isAuthenticated(): boolean {
        return !!this.accessToken; // Simplified check. Even if expired, we have the refresh token so we are "authenticated" in principle.
    }
}
