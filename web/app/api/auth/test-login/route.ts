import { NextResponse } from 'next/server';
import { SignJWT } from 'jose';

export async function GET(request: Request) {
    const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET || 'bluejax-secret-key-1234567890');

    // Create an artificial JWT token explicitly for "uncertified test user"
    const token = await new SignJWT({
        name: "Uncertified Tester",
        email: "uncertified@bluejax.test",
        sub: "agent-uncertified-999",
        role: "user",
        id: "agent-uncertified-999"
    })
        .setProtectedHeader({ alg: 'HS256' })
        .setExpirationTime('1d')
        .sign(secret);

    // Create a response that redirects directly to the dashboard
    const response = NextResponse.redirect(new URL('/dashboard', request.url));

    // Attach the NextAuth cookie directly to the response
    // For local dev, this is next-auth.session-token
    response.cookies.set('next-auth.session-token', token, {
        path: '/',
        httpOnly: true,
        secure: false, // http
        sameSite: 'lax'
    });

    return response;
}
