import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { createPublicClient } from "@/lib/supabase/public";

export const { handlers, signIn, signOut, auth } = NextAuth({
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Senha", type: "password" },
      },
      async authorize(credentials) {
        const email = typeof credentials?.email === "string" ? credentials.email : "";
        const password = typeof credentials?.password === "string" ? credentials.password : "";
        if (!email || !password) return null;

        const supabase = createPublicClient();
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error || !data.user) return null;

        return { id: data.user.id, email: data.user.email ?? email };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) token.email = user.email;
      return token;
    },
    session({ session, token }) {
      if (session.user) session.user.email = token.email ?? session.user.email;
      return session;
    },
  },
});
