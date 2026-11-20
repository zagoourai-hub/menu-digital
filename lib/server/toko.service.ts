import "server-only"

import { prisma } from "@/lib/prisma"

export const defaultToko = {
  nama: "Es Teh",
  whatsapp: "6281997511185",
  jamBuka: "09:00",
  jamTutup: "21:00",
  buka: true,
}

export async function getToko() {
  return await prisma.toko.findUnique({ where: { id: "utama" } }) ?? defaultToko
}
