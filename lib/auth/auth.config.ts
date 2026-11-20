import type { NextAuthConfig } from "next-auth"

export default {
  providers: [],
  pages: { signIn: "/login" },
  session: { strategy: "jwt", maxAge: 24 * 60 * 60 },
} satisfies NextAuthConfig
