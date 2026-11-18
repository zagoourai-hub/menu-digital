import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { MidtransService } from "@/lib/server/midtrans.service"

export const runtime = "nodejs"

let windowStart = 0
let requestCount = 0

export async function POST(request: Request, { params }: { params: Promise<{ id: string }> }) {
  if (process.env.NODE_ENV === "production") {
    return Response.json({ message: "Pembayaran sandbox hanya tersedia di lingkungan pengembangan." }, { status: 403 })
  }

  const origin = request.headers.get("origin")
  if (!origin || origin !== new URL(request.url).origin) {
    return Response.json({ message: "Permintaan tidak diizinkan." }, { status: 403 })
  }

  if (Date.now() - windowStart >= 60_000) {
    windowStart = Date.now()
    requestCount = 0
  }
  if (++requestCount > 10) {
    return Response.json({ message: "Terlalu banyak permintaan. Coba lagi sebentar." }, { status: 429 })
  }

  const { id } = await params
  if (!id || id.length > 100) {
    return Response.json({ message: "ID produk tidak valid." }, { status: 400 })
  }

  try {
    const input = z.object({ orderId: z.uuid(), verifyOnly: z.boolean().optional() }).safeParse(await request.json().catch(() => null))
    if (!input.success) return Response.json({ message: "ID pesanan tidak valid." }, { status: 400 })
    const { orderId } = input.data
    const existing = await prisma.pesanan.findUnique({ where: { id: orderId } })
    if (existing) {
      if (existing.produkId !== id) return Response.json({ message: "Pesanan tidak sesuai dengan produk." }, { status: 409 })
      if (existing.status === "paid") return Response.json({ status: "paid" })
      if (!existing.snapToken) return Response.json({ message: "Status pesanan belum dapat dipastikan. Jangan membuat pembayaran baru." }, { status: 409 })

      const key = process.env.MIDTRANS_SERVER_KEY
      if (!key) throw new Error("Missing sandbox server key")
      const statusResponse = await fetch(`https://api.sandbox.midtrans.com/v2/${orderId}/status`, {
        headers: { Authorization: `Basic ${Buffer.from(`${key}:`).toString("base64")}`, Accept: "application/json" },
        cache: "no-store",
        signal: AbortSignal.timeout(10_000),
      })
      if (statusResponse.status === 404) return Response.json({ token: existing.snapToken, status: "pending" })
      if (!statusResponse.ok) return Response.json({ message: "Status pembayaran belum dapat diverifikasi. Periksa izin Core API Read." }, { status: 503 })
      const statusBody: unknown = await statusResponse.json()
      const missingTransaction = z.object({ status_code: z.union([z.literal("404"), z.literal(404)]) }).safeParse(statusBody)
      if (missingTransaction.success) return Response.json({ token: existing.snapToken, status: "pending" })
      const statusData = z.object({
        order_id: z.string(),
        transaction_status: z.string(),
        fraud_status: z.string().optional(),
        gross_amount: z.union([z.string(), z.number()]),
      }).safeParse(statusBody)
      if (!statusData.success || statusData.data.order_id !== orderId || Number(statusData.data.gross_amount) !== existing.amount) {
        return Response.json({ message: "Status pembayaran tidak sesuai dengan pesanan." }, { status: 502 })
      }
      const payment = statusData.data
      const paid = payment.transaction_status === "settlement" ||
        (payment.transaction_status === "capture" && payment.fraud_status === "accept")
      if (paid) {
        await prisma.pesanan.updateMany({ where: { id: orderId }, data: { status: "paid" } })
        return Response.json({ status: "paid" })
      }
      if (!["pending", "authorize"].includes(payment.transaction_status)) {
        return Response.json({ message: "Transaksi tidak aktif. Hubungi pengelola untuk memeriksa pesanan." }, { status: 409 })
      }
      return Response.json({ token: existing.snapToken, status: "pending" })
    }

    if (input.data.verifyOnly) return Response.json({ status: "missing" })

    const product = await prisma.produk.findFirst({
      where: { id, published: true },
      select: { price: true, title: true },
    })
    if (!product) return Response.json({ message: "Produk tidak ditemukan." }, { status: 404 })
    if (product.price <= 0) return Response.json({ message: "Harga produk tidak dapat dibayar." }, { status: 400 })

    const midtrans = new MidtransService()
    try {
      await prisma.pesanan.create({
        data: { id: orderId, produkId: id, produkTitle: product.title, amount: product.price },
      })
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
        return Response.json({ message: "Pesanan sedang diproses. Coba lagi sebentar." }, { status: 409 })
      }
      throw error
    }
    const transaction = await midtrans.snap.createTransaction({
      transaction_details: { order_id: orderId, gross_amount: product.price },
    })
    await prisma.pesanan.update({ where: { id: orderId }, data: { snapToken: transaction.token, status: "pending" } })
    return Response.json({ token: transaction.token, status: "pending" })
  } catch (error) {
    const status = typeof error === "object" && error !== null && "httpStatusCode" in error
      ? Number(error.httpStatusCode)
      : 0
    const response = typeof error === "object" && error !== null && "ApiResponse" in error
      ? JSON.stringify(error.ApiResponse).toLowerCase()
      : ""
    const reason = /permission|access|unauthorized|forbidden/.test(response) ? "access denied" : "unspecified"
    console.error("SANDBOX PAYMENT ERROR", status || "connection or configuration error", reason)
    const message = status === 401 || status === 403
      ? "Kredensial atau izin Snap Checkout sandbox ditolak Midtrans."
      : "Pembayaran sandbox belum dapat dimulai. Periksa koneksi dan konfigurasi server."
    return Response.json({ message }, { status: 500 })
  }
}
