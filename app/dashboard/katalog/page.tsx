import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { getCurrentActor } from "@/lib/server/authorize"
import { DashboardCatalog } from "../_components/catalog"

export default async function CatalogPage() {
  const actor = await getCurrentActor()
  if (!actor) redirect("/login")

  const counts = await prisma.produk.groupBy({
    by: ["published"],
    _count: { _all: true },
  })

  return (
    <section className="mx-auto max-w-5xl">
      <h1 className="font-heading text-3xl font-bold">Katalog</h1>
      <p className="mt-2 text-sm text-muted-foreground">Lihat produk yang aktif di menu dan produk yang masih berupa draft.</p>
      <DashboardCatalog
        published={counts.find((entry) => entry.published)?._count._all ?? 0}
        drafts={counts.find((entry) => !entry.published)?._count._all ?? 0}
      />
    </section>
  )
}
