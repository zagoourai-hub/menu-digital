"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

import { Button } from "@/components/ui/button"
import { nextStatus, statusLabels, type StatusProses } from "@/lib/pesanan-status"

type Order = { id: string; produkTitle: string; amount: number; productPrice: number | null; status: string; proses: string; createdAt: string; customerName: string | null; customerPhone: string | null; fulfillment: string | null; deliveryAddress: string | null; distanceKm: number | null; deliveryFee: number }

export function OrderList({ orders }: { orders: Order[] }) {
  const router = useRouter()
  const [busy, setBusy] = useState("")
  const [error, setError] = useState("")
  useEffect(() => {
    const timer = window.setInterval(() => {
      if (document.visibilityState === "visible") router.refresh()
    }, 60_000)
    return () => window.clearInterval(timer)
  }, [router])

  async function advance(order: Order) {
    setBusy(order.id)
    setError("")
    try {
      const response = await fetch(`/api/pesanan/${encodeURIComponent(order.id)}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ current: order.proses }),
      })
      const result: { message?: string } = await response.json()
      if (!response.ok) throw new Error(result.message || "Status gagal diperbarui.")
      router.refresh()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Status gagal diperbarui.")
    } finally {
      setBusy("")
    }
  }

  if (!orders.length) return <p className="text-sm text-muted-foreground">Belum ada pesanan.</p>
  return (
    <div className="flex flex-col gap-3">
      {error && <p role="alert" className="text-sm text-destructive">{error}</p>}
      {orders.map((order) => {
        const current = order.proses as StatusProses
        const next = current === "DIBUAT" && order.fulfillment === "PICKUP" ? "SELESAI" : nextStatus[current]
        return (
          <article key={order.id} className="flex flex-wrap items-center justify-between gap-4 rounded-xl border bg-card p-5">
            <div>
              <h2 className="font-semibold">{order.produkTitle}</h2>
              <p className="mt-1 break-all text-xs text-muted-foreground">ID pesanan: {order.id}</p>
              <p className="mt-1 text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleString("id-ID")}</p>
              <p className="mt-2 text-sm">Harga menu: {order.productPrice === null ? "Tidak tersedia" : `Rp ${order.productPrice.toLocaleString("id-ID")}`} · Ongkir: Rp {order.deliveryFee.toLocaleString("id-ID")}</p>
              <p className="mt-1 text-sm font-semibold">Total: Rp {order.amount.toLocaleString("id-ID")}</p>
              {order.customerName && <p className="mt-2 text-sm">Pelanggan: {order.customerName}{order.customerPhone ? ` · ${order.customerPhone}` : ""}</p>}
              {order.fulfillment && <p className="mt-1 text-sm text-muted-foreground">{order.fulfillment === "DELIVERY" ? `Diantar${order.deliveryAddress ? `: ${order.deliveryAddress}` : ""}` : "Ambil sendiri"}</p>}
              {order.distanceKm !== null && <p className="mt-1 text-sm text-muted-foreground">Jarak perkiraan: {order.distanceKm} km · Ongkir Rp {order.deliveryFee.toLocaleString("id-ID")}</p>}
              {order.status === "expired" ? (
                <p className="mt-2 w-fit rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">Expired</p>
              ) : (
                <p className="mt-1 text-sm">Pembayaran: {order.status === "paid" ? "Terverifikasi" : "Belum terverifikasi"} · Pesanan: {statusLabels[current] ?? "Tidak diketahui"}</p>
              )}
            </div>
            {next && order.status !== "expired" && <Button disabled={order.status !== "paid" || !!busy} onClick={() => advance(order)}>{busy === order.id ? "Menyimpan..." : `Tandai ${statusLabels[next]}`}</Button>}
          </article>
        )
      })}
    </div>
  )
}
