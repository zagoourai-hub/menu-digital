import "server-only"

import type { PrismaClient } from "@/generated/prisma/client"
import { ImageStorageService } from "./image.service"

export class ProfileService {
  constructor(
    private readonly db: PrismaClient,
    private readonly storage = new ImageStorageService("profiles"),
  ) {}

  async update(userId: string, name: string, photo?: File) {
    if (!photo) {
      await this.db.user.update({ where: { id: userId }, data: { name } })
      return
    }

    const previous = await this.db.user.findUniqueOrThrow({
      where: { id: userId }, select: { image: true },
    })
    const image = await this.storage.upload(photo)
    try {
      await this.db.user.update({ where: { id: userId, image: previous.image }, data: { name, image } })
    } catch (error) {
      await this.removeUpload(image)
      throw error
    }
    if (previous.image?.startsWith("/uploads/profiles/")) await this.removeUpload(previous.image)
  }

  private async removeUpload(image: string) {
    try {
      await this.storage.remove(image)
    } catch {
      console.error("Gagal membersihkan file foto profil.")
    }
  }
}
