import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
    providers: [
        CredentialsProvider({
            name: "Admin Access",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "admin" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (credentials?.username === "admin" && credentials?.password === "admin") {
                    return {
                        id: "1",
                        name: "Broker Admin",
                        email: "admin@remax-polanco.mx",
                        image: "https://ui-avatars.com/api/?name=Broker+Admin&background=0D8ABC&color=fff",
                        role: "Agencia Admin"
                    };
                }
                return null;
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
                // Extract sub from accessToken so session.user.id matches backend user ID
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
