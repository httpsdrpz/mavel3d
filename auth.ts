import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { createPublicClient } from "@/lib/supabase/public";
import { createAdminClient } from "@/lib/supabase/admin";

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

        // Being a valid Supabase Auth user isn't enough — only accounts with
        // an active ADMIN row in admin_users may reach /admin. Checked with
        // the service-role client since RLS on admin_users has no anon/
        // authenticated policy at all.
        const admin = createAdminClient();
        const { data: profile } = await admin
          .from("admin_users")
          .select("name, role, active")
          .eq("id", data.user.id)
          .maybeSingle();

        if (!profile || !profile.active || profile.role !== "ADMIN") return null;

        return {
          id: data.user.id,
          email: data.user.email ?? email,
          name: profile.name || undefined,
          role: profile.role,
        };
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.uid = user.id;
        token.email = user.email;
        token.name = user.name;
        token.role = user.role;
      }
      return token;
    },
    session({ session, token }) {
      if (session.user) {
        session.user.id = token.uid ?? "";
        session.user.email = token.email ?? session.user.email;
        session.user.name = token.name ?? session.user.name;
        session.user.role = token.role;
      }
      return session;
    },
  },
});
