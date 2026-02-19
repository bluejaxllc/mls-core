
import { getSession } from 'next-auth/react';

const API_URL = ''; // Use relative path to leverage Next.js proxy (rewrites in next.config.js)

/**
 * Authenticated Fetch Wrapper
 * Automatically adds Authorization header if session exists.
 * Can be used client-side (relies on passed token or getSession).
 */
export async function authFetch(endpoint: string, options: RequestInit = {}, token?: string) {
    let accessToken = token;

    if (!accessToken) {
        // If not provided, try to get from session (client-side only usually)
        if (typeof window !== 'undefined') {
            const session = await getSession();
            accessToken = session?.accessToken;
        }
    }

    const headers: HeadersInit = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (accessToken) {
        (headers as any)['Authorization'] = `Bearer ${accessToken}`;
    } else {
        // Fallback for dev/mock if needed
        if (process.env.NODE_ENV === 'development') {
            console.warn('[API] Using mock-jwt-token for dev');
            (headers as any)['Authorization'] = `Bearer mock-jwt-token`;
        } else {
            console.warn('[API] No access token found for authenticated request');
        }
    }

    // Ensure endpoint starts with slash if not full URL
    const url = endpoint.startsWith('http') ? endpoint : `${API_URL}${endpoint}`;

    const res = await fetch(url, {
        ...options,
        headers
    });

    if (!res.ok) {
        // Handle 401/403 globally if needed
        if (res.status === 401) {
            console.error('[API] Unauthorized');
            // optionally redirect to login
        }
        throw await res.json().catch(() => ({ error: res.statusText }));
    }

    return res.json();
}
