"use server"

import { revalidatePath } from "next/cache"
import { getCurrentActor } from "@/lib/server/authorize"
import { prisma } from "@/lib/prisma"
import { tokoSchema } from "@/lib/schemas/toko.schema"

export async function saveToko(_: { message: string; success: boolean }, data: FormData) {
  const actor = await getCurrentActor()
  if (!actor) return { success: false, message: "Sesi berakhir. Silakan login kembali." }
  if (actor.role !== "ADMIN") return { success: false, message: "Hanya admin yang dapat mengubah pengaturan toko." }
  const result = tokoSchema.safeParse({
    nama: data.get("nama"),
    whatsapp: data.get("whatsapp"),
    jamBuka: data.get("jamBuka"),
    jamTutup: data.get("jamTutup"),
    buka: data.get("buka") === "on",
  })
  if (!result.success) return { success: false, message: "Periksa nama, nomor WhatsApp format 62, dan jam toko." }
  try {
    await prisma.toko.upsert({ where: { id: "utama" }, create: { id: "utama", ...result.data }, update: result.data })
  } catch {
    return { success: false, message: "Pengaturan belum dapat disimpan." }
  }
  revalidatePath("/", "layout")
  return { success: true, message: "Pengaturan toko berhasil disimpan." }
}
