import { prisma } from "@/lib/prisma"
import { Menus } from "./Menus"

export async function MenuSection() {
  const menus = await prisma.produk.findMany({
    where: { published: true },
    select: { id: true, title: true, description: true, price: true, imageUrl: true },
    orderBy: { createdAt: "desc" },
  })

  return <Menus menus={menus} />
}
