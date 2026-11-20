import { randomBytes, scrypt as scryptCallback } from "node:crypto"
import { promisify } from "node:util"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { z } from "zod"
import { PrismaClient } from "../generated/prisma/client"

import nextEnv from "@next/env"

const { loadEnvConfig } = nextEnv
loadEnvConfig(process.cwd())
const config = z.object({
  DATABASE_URL: z.string().min(1),
  ADMIN_EMAIL: z.email().transform((value) => value.toLowerCase()),
  ADMIN_PASSWORD: z.string().min(12).max(1024),
  ADMIN_NAME: z.string().trim().min(1).max(100).default("Admin"),
}).safeParse(process.env)

if (!config.success) throw new Error("Isi DATABASE_URL, ADMIN_EMAIL, dan ADMIN_PASSWORD (minimal 12 karakter) di .env.local.")

const { DATABASE_URL, ADMIN_EMAIL, ADMIN_PASSWORD, ADMIN_NAME } = config.data
const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: DATABASE_URL }) })
const scrypt = promisify(scryptCallback)

async function main() {
  if (await prisma.user.findUnique({ where: { email: ADMIN_EMAIL }, select: { id: true } })) {
    throw new Error("Email sudah terdaftar. Akun yang ada tidak diubah atau dipromosikan.")
  }
  const salt = randomBytes(16).toString("hex")
  const hash = await scrypt(ADMIN_PASSWORD, salt, 64) as Buffer
  await prisma.user.create({
    data: { name: ADMIN_NAME, email: ADMIN_EMAIL, passHash: `${salt}:${hash.toString("hex")}`, role: "ADMIN" },
  })
  console.log("Akun admin berhasil dibuat.")
}

main().catch(() => {
  console.error("Akun admin belum dibuat. Pastikan konfigurasi valid dan email belum terdaftar.")
  process.exitCode = 1
}).finally(() => prisma.$disconnect())
