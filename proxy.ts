import NextAuth from "next-auth"
import { NextResponse } from "next/server"

import authConfig from "@/lib/auth/auth.config"

const { auth } = NextAuth(authConfig)

export const proxy = auth((request) => {
  if (!request.auth?.user) {
    return NextResponse.redirect(new URL("/login", request.url))
  }
})

export const config = {
  matcher: ["/dashboard/:path*"],
}
