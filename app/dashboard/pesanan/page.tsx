import Link from "next/link"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/prisma"
import { getCurrentActor } from "@/lib/server/authorize"
import { OrderList } from "./order-list"

export default async function OrdersPage() {
  const actor = await getCurrentActor()
  if (!actor) redirect("/login")
  const products = actor.role === "ADMIN" ? null : await prisma.produk.findMany({
    where: { authorId: actor.id }, select: { id: true },
  })
  const orders = await prisma.pesanan.findMany({
    where: products ? { produkId: { in: products.map((product) => product.id) } } : {},
    select: { id: true, produkTitle: true, amount: true, status: true, proses: true, createdAt: true },
    orderBy: { createdAt: "desc" },
    take: 100,
  })

  return (
    <main className="mx-auto max-w-5xl">
      <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground">← Kembali ke dashboard</Link>
      <h1 className="mt-8 font-heading text-3xl font-bold">Pesanan</h1>
      <p className="mt-2 text-sm text-muted-foreground">Kelola proses pesanan yang pembayarannya sudah diverifikasi.</p>
      <div className="mt-8"><OrderList orders={orders.map((order) => ({ ...order, createdAt: order.createdAt.toISOString() }))} /></div>
    </main>
  )
}
