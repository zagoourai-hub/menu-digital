import "server-only"

import { cache } from "react"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export const getCurrentProfile = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) return null

  return prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, role: true, image: true },
  })
})
