import { z } from "zod"

import { prisma } from "@/lib/prisma"
import { MidtransService } from "@/lib/server/midtrans.service"
import { syncPaymentStatus } from "@/lib/server/pesanan-payment"
import { getToko } from "@/lib/server/toko.service"
import { customerSchema } from "@/lib/schemas/toko.schema"
import { calculateDeliveryFee } from "@/lib/ongkir"

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
    if (Number(request.headers.get("content-length") || 0) > 4096) {
      return Response.json({ message: "Data pesanan terlalu besar." }, { status: 413 })
    }
    const input = z.object({ orderId: z.uuid(), verifyOnly: z.boolean().optional(), customer: customerSchema.optional(), expectedAmount: z.number().int().nonnegative().optional() }).safeParse(await request.json().catch(() => null))
    if (!input.success) return Response.json({ message: "ID pesanan tidak valid." }, { status: 400 })
    const { orderId } = input.data
    const existing = await prisma.pesanan.findUnique({ where: { id: orderId } })
    if (existing) {
      if (existing.produkId !== id) return Response.json({ message: "Pesanan tidak sesuai dengan produk." }, { status: 409 })
      if (existing.status === "paid" || existing.status === "expired") return Response.json({ status: existing.status })
      if (!existing.snapToken) return Response.json({ message: "Status pesanan belum dapat dipastikan. Jangan membuat pembayaran baru." }, { status: 409 })

      try {
        const status = await syncPaymentStatus(existing)
        if (status !== "pending") return Response.json({ status })
        return Response.json({ token: existing.snapToken, status, amount: existing.amount, productPrice: existing.productPrice ?? existing.amount - existing.deliveryFee, deliveryFee: existing.deliveryFee })
      } catch {
        return Response.json({ message: "Status pembayaran belum dapat diverifikasi. Periksa koneksi dan izin Core API Read." }, { status: 503 })
      }
    }

    if (input.data.verifyOnly) return Response.json({ status: "missing" })
    if (!input.data.customer) return Response.json({ message: "Lengkapi data pelanggan dan pengiriman." }, { status: 400 })
    const store = await getToko()
    if (!store.buka) return Response.json({ message: "Toko sedang tutup dan belum menerima pesanan baru." }, { status: 403 })

    const product = await prisma.produk.findFirst({
      where: { id, published: true },
      select: { price: true, title: true },
    })
    if (!product) return Response.json({ message: "Produk tidak ditemukan." }, { status: 404 })
    if (product.price <= 0) return Response.json({ message: "Harga produk tidak dapat dibayar." }, { status: 400 })
    const customer = input.data.customer
    const deliveryFee = customer.fulfillment === "DELIVERY" ? calculateDeliveryFee(customer.distanceKm) : 0
    const amount = product.price + deliveryFee
    if (!Number.isSafeInteger(amount) || amount > 2_147_483_647) return Response.json({ message: "Total pesanan terlalu besar." }, { status: 400 })
    if (input.data.expectedAmount !== amount) return Response.json({ message: "Harga berubah. Muat ulang halaman dan periksa kembali invoice." }, { status: 409 })

    const midtrans = new MidtransService()
    try {
      await prisma.pesanan.create({
        data: { id: orderId, produkId: id, produkTitle: product.title, amount, productPrice: product.price, deliveryFee, ...customer },
      })
    } catch (error) {
      if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
        return Response.json({ message: "Pesanan sedang diproses. Coba lagi sebentar." }, { status: 409 })
      }
      throw error
    }
    const transaction = await midtrans.snap.createTransaction({
      transaction_details: { order_id: orderId, gross_amount: amount },
    })
    await prisma.pesanan.update({ where: { id: orderId }, data: { snapToken: transaction.token, status: "pending" } })
    return Response.json({ token: transaction.token, status: "pending", amount, productPrice: product.price, deliveryFee })
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
