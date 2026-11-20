"use server"

import { revalidatePath } from "next/cache"
import { z } from "zod"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { ImageValidationError } from "@/lib/server/image.service"
import { ProfileService } from "@/lib/server/profile.service"

type NameResult = { success: boolean; message: string }

export async function updateAccountProfile(_: NameResult, formData: FormData): Promise<NameResult> {
  const session = await auth()
  if (!session?.user?.id) return { success: false, message: "Sesi berakhir. Silakan login kembali." }

  const name = z.string().trim().min(1).max(100).safeParse(formData.get("name"))
  if (!name.success) return { success: false, message: "Nama harus berisi 1–100 karakter." }

  const upload = formData.get("photo")
  const photo = upload instanceof File && upload.name ? upload : undefined
  if (photo && photo.size > 900_000) return { success: false, message: "Ukuran foto maksimal 900 KB." }

  try {
    await new ProfileService(prisma).update(session.user.id, name.data, photo)
  } catch (error) {
    return { success: false, message: error instanceof ImageValidationError ? error.message : "Profil belum dapat disimpan. Silakan coba lagi." }
  }

  revalidatePath("/dashboard", "layout")
  return { success: true, message: "Profil berhasil diperbarui." }
}
