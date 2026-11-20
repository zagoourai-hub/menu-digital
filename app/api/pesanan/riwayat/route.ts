import { z } from "zod"
import { prisma } from "@/lib/prisma"
import { syncPendingOrders } from "@/lib/server/pesanan-payment"

export const runtime = "nodejs"

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) {
    return Response.json({ message: "Permintaan tidak diizinkan." }, { status: 403 })
  }
  const input = z.object({ ids: z.array(z.uuid()).max(50) }).safeParse(await request.json().catch(() => null))
  if (!input.success) return Response.json({ message: "Daftar pesanan tidak valid." }, { status: 400 })

  const orders = await syncPendingOrders(await prisma.pesanan.findMany({
    where: { id: { in: input.data.ids } },
    select: { id: true, produkTitle: true, amount: true, status: true, proses: true, createdAt: true, updatedAt: true, customerName: true, customerPhone: true, fulfillment: true, deliveryAddress: true },
    orderBy: { createdAt: "desc" },
  }))
  return Response.json({ orders }, { headers: { "Cache-Control": "no-store" } })
}
