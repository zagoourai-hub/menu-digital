import "server-only"

import { z } from "zod"
import { prisma } from "@/lib/prisma"

type PaymentOrder = { id: string; status: string; amount: number; createdAt: Date }

const paymentSchema = z.object({
  order_id: z.string(),
  transaction_status: z.string(),
  fraud_status: z.string().optional(),
  gross_amount: z.union([z.string(), z.number()]),
})

export async function syncPaymentStatus(order: PaymentOrder) {
  const key = process.env.MIDTRANS_SERVER_KEY?.trim()
  if (order.status !== "pending") return order.status
  if (!key || process.env.NODE_ENV === "production") throw new Error("Verifikasi sandbox tidak tersedia.")

  const response = await fetch(`https://api.sandbox.midtrans.com/v2/${encodeURIComponent(order.id)}/status`, {
    headers: { Authorization: `Basic ${Buffer.from(`${key}:`).toString("base64")}`, Accept: "application/json" },
    cache: "no-store",
    signal: AbortSignal.timeout(5000),
  })
  const body: unknown = await response.json()
  const missing = z.object({ status_code: z.union([z.literal("404"), z.literal(404)]) }).safeParse(body)

  let status = "pending"
  if ((response.ok || response.status === 404) && missing.success) {
    // Snap's default lifetime before a payment method is confirmed.
    if (Date.now() - order.createdAt.getTime() >= 24 * 60 * 60 * 1000) status = "expired"
  } else {
    if (!response.ok) throw new Error("Status pembayaran belum dapat diverifikasi. Periksa izin Core API Read.")
    const payment = paymentSchema.safeParse(body)
    if (!payment.success || payment.data.order_id !== order.id || Number(payment.data.gross_amount) !== order.amount) {
      throw new Error("Status pembayaran tidak sesuai dengan pesanan.")
    }
    const { transaction_status: transactionStatus, fraud_status: fraudStatus } = payment.data
    if (transactionStatus === "settlement" || (transactionStatus === "capture" && fraudStatus === "accept")) status = "paid"
    else if (transactionStatus === "expire") status = "expired"
    else if (!["pending", "authorize"].includes(transactionStatus)) throw new Error("Transaksi tidak aktif. Hubungi pengelola untuk memeriksa pesanan.")
  }

  if (status === order.status) return status
  const updated = await prisma.pesanan.updateMany({ where: { id: order.id, status: "pending" }, data: { status } })
  if (updated.count) return status
  return (await prisma.pesanan.findUniqueOrThrow({ where: { id: order.id }, select: { status: true } })).status
}

export async function syncPendingOrders<T extends PaymentOrder & { updatedAt: Date }>(orders: T[]) {
  if (process.env.NODE_ENV === "production" || !process.env.MIDTRANS_SERVER_KEY?.trim()) return orders
  const cutoff = new Date(Date.now() - 60_000)
  const pending = orders.filter((order) => order.status === "pending" && order.updatedAt < cutoff)
    .sort((a, b) => a.updatedAt.getTime() - b.updatedAt.getTime()).slice(0, 5)

  await Promise.allSettled(pending.map(async (order) => {
    const claim = await prisma.pesanan.updateMany({
      where: { id: order.id, status: "pending", updatedAt: { lt: cutoff } },
      data: { updatedAt: new Date() },
    })
    if (claim.count) order.status = await syncPaymentStatus(order)
  }))
  return orders
}
