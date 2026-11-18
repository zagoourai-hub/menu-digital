import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { scrypt, timingSafeEqual } from "node:crypto"
import { promisify } from "node:util"
import { z } from "zod"
import authConfig from "./auth/auth.config"
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "./prisma";

const scryptAsync = promisify(scrypt)
const credentialsSchema = z.object({
    email: z.email(),
    password: z.string().min(1).max(1024),
})

export const { auth, handlers, signIn, signOut } = NextAuth({
    adapter: PrismaAdapter(prisma),
    session: { strategy: "jwt" },
    ...authConfig,
    callbacks: {
        async jwt({token,user}) {
            if (user) {
                token.sub = user.id;
            }

            return token;
        },
        async session({session, token}) {
            if (session.user && token.sub) {
                session.user.id = token.sub;
            }

            return session
        }
    },
    providers: [
        Credentials({
            credentials: { email: {}, password: {} },
            async authorize(credentials) {
                const result = credentialsSchema.safeParse(credentials)
                if (!result.success) return null

                const user = await prisma.user.findUnique({ where: { email: result.data.email } })
                if (!user) return null

                const [salt, hash] = user.passHash.split(":")
                if (!salt || !hash || !/^[0-9a-f]{128}$/i.test(hash)) return null

                const expected = Buffer.from(hash, "hex")
                const actual = (await scryptAsync(result.data.password, salt, expected.length)) as Buffer
                if (!timingSafeEqual(actual, expected)) return null

                return { id: user.id, name: user.name, email: user.email, image: user.image }
            },
        }),
    ],
})
