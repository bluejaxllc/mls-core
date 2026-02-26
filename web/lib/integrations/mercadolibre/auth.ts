import axios from 'axios';
import { prismaIntelligence } from '@/lib/prisma-intelligence';

export class MercadoLibreAuth {
    private clientId: string;
    private clientSecret: string;
    private redirectUri: string;
    private accessToken?: string;
    private refreshToken?: string;
    private expiresAt?: number;
    private refreshTimer?: NodeJS.Timeout;

    constructor() {
        this.clientId = process.env.ML_CLIENT_ID || '';
        this.clientSecret = process.env.ML_CLIENT_SECRET || '';

        const baseUrl = process.env.NEXT_PUBLIC_VERCEL_URL
            ? `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`
            : process.env.VERCEL_URL
                ? `https://${process.env.VERCEL_URL}`
                : process.env.NEXTAUTH_URL || 'http://localhost:3000';

        this.redirectUri = process.env.ML_REDIRECT_URI || `${baseUrl}/api/integrations/mercadolibre/callback`;

        if (!this.clientId || !this.clientSecret) {
            console.warn('[ML Auth] Missing ML_CLIENT_ID or ML_CLIENT_SECRET in .env');
        }

        // We load tokens lazily when needed because constructor cannot be async
    }

    private async loadTokens(): Promise<void> {
        if (this.accessToken) return; // already loaded in memory

        try {
            const source = await prismaIntelligence.sourceProfile.findUnique({
                where: { name: 'Mercado Libre Mexico' }
            });

            if (source && source.config) {
                const config = JSON.parse(source.config);
                if (config.auth) {
                    const data = config.auth;
                    this.accessToken = data.access_token;
                    this.refreshToken = data.refresh_token;
                    this.expiresAt = data.expires_at;

                    const remaining = this.expiresAt ? Math.round((this.expiresAt - Date.now()) / 1000) : 0;
                    console.log(`[ML Auth] 💾 Loaded tokens from DB. Expires in ${remaining}s (${remaining > 0 ? 'valid' : 'expired'})`);

                    if (remaining <= 0 && this.refreshToken) {
                        console.log('[ML Auth] 🔄 Token expired on load, auto-refreshing...');
                        await this.refreshAccessToken();
                    } else if (remaining > 0) {
                        this.scheduleAutoRefresh();
                    }
                }
            }
        } catch (error: any) {
            console.error('[ML Auth] Failed to load tokens from DB:', error.message);
        }
    }

    private async saveTokens(data: any): Promise<void> {
        try {
            const enriched = {
                ...data,
                saved_at: Date.now(),
                expires_at: Date.now() + (data.expires_in * 1000),
            };

            const source = await prismaIntelligence.sourceProfile.upsert({
                where: { name: 'Mercado Libre Mexico' },
                create: {
                    name: 'Mercado Libre Mexico',
                    type: 'PORTAL',
                    baseUrl: 'https://www.mercadolibre.com.mx',
                    config: JSON.stringify({ auth: enriched })
                },
                update: {}
            });

            let currentConfig = {};
            try { currentConfig = JSON.parse(source.config); } catch (e) { }

            await prismaIntelligence.sourceProfile.update({
                where: { name: 'Mercado Libre Mexico' },
                data: { config: JSON.stringify({ ...currentConfig, auth: enriched }) }
            });

            console.log('[ML Auth] 💾 Tokens saved to DB.');
        } catch (error: any) {
            console.error('[ML Auth] Failed to save tokens to DB:', error);
        }
    }

    private scheduleAutoRefresh() {
        if (this.refreshTimer) clearTimeout(this.refreshTimer);
        if (!this.expiresAt || !this.refreshToken) return;

        const refreshIn = Math.max(this.expiresAt - Date.now() - 10 * 60 * 1000, 5000);

        if (typeof setTimeout !== 'undefined') {
            this.refreshTimer = setTimeout(async () => {
                try {
                    console.log('[ML Auth] 🔄 Auto-refreshing token...');
                    await this.refreshAccessToken();
                } catch (e: any) {
                    console.error('[ML Auth] ❌ Auto-refresh failed:', e.message);
                }
            }, refreshIn);
        }
    }

    getAuthUrl(state?: string): string {
        const params = new URLSearchParams({
            response_type: 'code',
            client_id: this.clientId,
            redirect_uri: this.redirectUri
        });

        if (state) {
            params.append('state', state);
        }

        // Must explicitly specify https://auth.mercadolibre.com.mx for Mexico
        return `https://auth.mercadolibre.com.mx/authorization?${params.toString()}`;
    }

    async getAccessToken(code: string): Promise<void> {
        try {
            const params = new URLSearchParams();
            params.append('grant_type', 'authorization_code');
            params.append('client_id', this.clientId);
            params.append('client_secret', this.clientSecret);
            params.append('code', code.trim());
            params.append('redirect_uri', this.redirectUri);

            const { data } = await axios.post('https://api.mercadolibre.com/oauth/token', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            });

            this.accessToken = data.access_token;
            this.refreshToken = data.refresh_token;
            this.expiresAt = Date.now() + (data.expires_in * 1000);

            await this.saveTokens(data);
            this.scheduleAutoRefresh();
        } catch (error: any) {
            console.error('[ML Auth] ❌ Failed to get access token:', error.response?.data || error.message);
            throw new Error('Failed to obtain access token');
        }
    }

    async refreshAccessToken(): Promise<void> {
        if (!this.refreshToken) throw new Error('No refresh token available');

        try {
            const params = new URLSearchParams();
            params.append('grant_type', 'refresh_token');
            params.append('client_id', this.clientId);
            params.append('client_secret', this.clientSecret);
            params.append('refresh_token', this.refreshToken);

            const { data } = await axios.post('https://api.mercadolibre.com/oauth/token', params, {
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Accept': 'application/json'
                }
            });

            this.accessToken = data.access_token;
            this.refreshToken = data.refresh_token;
            this.expiresAt = Date.now() + (data.expires_in * 1000);

            await this.saveTokens(data);
            this.scheduleAutoRefresh();
        } catch (error: any) {
            console.error('[ML Auth] ❌ Failed to refresh access token:', error.response?.data || error.message);
            throw new Error('Failed to refresh access token');
        }
    }

    async getValidToken(): Promise<string> {
        await this.loadTokens();

        if (!this.accessToken) {
            throw new Error('Not authenticated');
        }

        if (this.expiresAt && Date.now() >= (this.expiresAt - 5 * 60 * 1000)) {
            await this.refreshAccessToken();
        }

        return this.accessToken!;
    }

    async isAuthenticated(): Promise<boolean> {
        await this.loadTokens();
        return !!(this.accessToken || this.refreshToken);
    }
}
