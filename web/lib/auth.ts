import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Credentials",
            credentials: {
                username: { label: "Email", type: "text", placeholder: "correo@empresa.com" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (!credentials?.username || !credentials?.password) return null;

                const input = credentials.username.trim().toLowerCase();
                const password = credentials.password;

                // ─── Legacy admin access (backward compat) ───
                if (input === "admin" && password === "admin") {
                    return {
                        id: "1",
                        name: "Broker Admin",
                        email: "admin@remax-polanco.mx",
                        image: "https://ui-avatars.com/api/?name=Broker+Admin&background=0D8ABC&color=fff",
                        role: "Agencia Admin"
                    };
                }

                // ─── Database user lookup ───
                try {
                    const user = await prisma.user.findUnique({
                        where: { email: input }
                    });

                    if (!user || !user.passwordHash) return null;

                    // Check email verification
                    if (!user.emailVerified) {
                        throw new Error("EMAIL_NOT_VERIFIED");
                    }

                    // Verify password
                    const valid = await bcrypt.compare(password, user.passwordHash);
                    if (!valid) return null;

                    return {
                        id: user.id,
                        name: [user.firstName, user.lastName].filter(Boolean).join(' ') || user.email,
                        email: user.email,
                        image: `https://ui-avatars.com/api/?name=${encodeURIComponent(user.firstName || user.email)}&background=3b82f6&color=fff`,
                        role: user.roles || "user",
                    };
                } catch (err: any) {
                    if (err?.message === "EMAIL_NOT_VERIFIED") throw err;
                    console.error("[Auth] DB lookup error:", err);
                    return null;
                }
            }
        })
    ],
    callbacks: {
        async session({ session, token }: any) {
            if (session.user) {
                session.user.id = token.sub;
                session.user.role = token.role;
                session.accessToken = token.accessToken;
            }
            return session;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
                token.accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJPeFN3YXZ6akc5NTBVYjRtM3RJWSIsImxvY2F0aW9uX2lkIjoiR0MzUTVlcXdES3cyTWhaUTBLU2oiLCJlbWFpbCI6ImFkbWluQHJlbWF4LXBvbGFuY28ubXgiLCJyb2xlcyI6WyJhZG1pbiJdfQ.mock_signature';
                try {
                    const payload = JSON.parse(Buffer.from(token.accessToken.split('.')[1], 'base64').toString());
                    if (payload.sub) token.sub = payload.sub;
                } catch { }
            }
            if (!token.accessToken && process.env.NODE_ENV === 'development') {
                token.accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJPeFN3YXZ6akc5NTBVYjRtM3RJWSIsImxvY2F0aW9uX2lkIjoiR0MzUTVlcXdES3cyTWhaUTBLU2oiLCJlbWFpbCI6ImFkbWluQHJlbWF4LXBvbGFuY28ubXgiLCJyb2xlcyI6WyJhZG1pbiJdfQ.mock_signature';
            }
            return token;
        }
    },
    theme: {
        colorScheme: "dark",
        brandColor: "#3b82f6",
        logo: "https://ui-avatars.com/api/?name=BJ&background=3b82f6&color=fff"
    },
    pages: {
        signIn: '/auth/signin',
    }
};
