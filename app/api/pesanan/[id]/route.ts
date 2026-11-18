import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { getCurrentActor } from "@/lib/server/authorize"
import { nextStatus, type StatusProses } from "@/lib/pesanan-status"

export const runtime = "nodejs"

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const actor = await getCurrentActor()
  if (!actor) return Response.json({ message: "Silakan login." }, { status: 401 })
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ message: "Permintaan tidak diizinkan." }, { status: 403 })
  }

  const input = z.object({ current: z.enum(["PENDING", "DIBUAT", "DIANTAR"]) }).safeParse(await request.json().catch(() => null))
  if (!input.success) return Response.json({ message: "Status tidak valid." }, { status: 400 })
  const { id } = await params
  if (!z.uuid().safeParse(id).success) return Response.json({ message: "ID pesanan tidak valid." }, { status: 400 })

  const order = await prisma.pesanan.findUnique({ where: { id }, select: { produkId: true } })
  if (!order) return Response.json({ message: "Pesanan tidak ditemukan." }, { status: 404 })
  if (actor.role !== "ADMIN") {
    const product = await prisma.produk.findFirst({ where: { id: order.produkId, authorId: actor.id }, select: { id: true } })
    if (!product) return Response.json({ message: "Pesanan tidak ditemukan." }, { status: 404 })
  }

  const proses = nextStatus[input.data.current as StatusProses]
  if (!proses) return Response.json({ message: "Status tidak valid." }, { status: 400 })
  const result = await prisma.pesanan.updateMany({
    where: { id, status: "paid", proses: input.data.current },
    data: { proses },
  })
  if (!result.count) return Response.json({ message: "Pesanan belum dibayar atau statusnya sudah berubah. Muat ulang halaman." }, { status: 409 })
  return Response.json({ proses })
}
