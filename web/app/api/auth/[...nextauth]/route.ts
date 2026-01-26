
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
    providers: [
        CredentialsProvider({
            name: "Mock Credentials",
            credentials: {
                username: { label: "Username", type: "text", placeholder: "admin" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials, req) {
                // MOCK AUTHENTICATION LOGIC
                if (credentials?.username === "admin" && credentials?.password === "admin") {
                    return {
                        id: "1",
                        name: "Broker Admin",
                        email: "admin@remax-polanco.mx",
                        image: "https://ui-avatars.com/api/?name=Broker+Admin&background=0D8ABC&color=fff",
                        role: "Agencia Admin"
                    };
                }

                if (credentials?.username === "system" && credentials?.password === "system") {
                    return {
                        id: "2",
                        name: "System Overwatch",
                        email: "sysadmin@bluejax.core",
                        image: "https://ui-avatars.com/api/?name=System+Admin&background=6D28D9&color=fff",
                        role: "System Admin"
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
            }
            return session;
        },
        async jwt({ token, user }: any) {
            if (user) {
                token.role = user.role;
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
