
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        {
            id: "bluejax",
            name: "Blue Jax",
            type: "oauth",
            authorization: {
                url: "https://marketplace.gohighlevel.com/oauth/chooselocation",
                params: { scope: "contacts.readonly locations.readonly" }
            },
            token: "https://services.leadconnectorhq.com/oauth/token",
            userinfo: "https://services.leadconnectorhq.com/oauth/userinfo", // Hypothetical standard
            clientId: process.env.BLUE_JAX_CLIENT_ID,
            clientSecret: process.env.BLUE_JAX_CLIENT_SECRET,
            profile(profile) {
                return {
                    id: profile.id || profile.sub,
                    name: profile.name || profile.firstName + ' ' + profile.lastName,
                    email: profile.email,
                    image: profile.picture,
                    role: profile.role || 'user'
                };
            },
        },
        CredentialsProvider({
            name: "Mock Credentials (Dev Only)",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "admin" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                if (process.env.NODE_ENV === 'production') return null;

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
                session.accessToken = token.accessToken; // Persist token for API calls
            }
            return session;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
                // Use a valid-looking mock JWT structure for development decoding
                token.accessToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJPeFN3YXZ6akc5NTBVYjRtM3RJWSIsImxvY2F0aW9uX2lkIjoiR0MzUTVlcXdES3cyTWhaUTBLU2oiLCJlbWFpbCI6ImFkbWluQHJlbWF4LXBvbGFuY28ubXgiLCJyb2xlcyI6WyJhZG1pbiJdfQ.mock_signature';
            }
            // Self-healing for existing dev sessions without a token
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
});

export { handler as GET, handler as POST };
