"use client"

import { useEffect, useState } from "react"

import { statusLabels, type StatusProses } from "@/lib/pesanan-status"

type Order = { id: string; produkTitle: string; amount: number; status: string; proses: string; createdAt: string }

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const ids = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
          .filter((key): key is string => !!key?.startsWith("sandbox-order:"))
          .map((key) => localStorage.getItem(key))
          .filter((id): id is string => !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))
          .slice(0, 50)
        if (!ids.length) { setOrders([]); return }
        const response = await fetch("/api/pesanan/riwayat", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ids }), signal: controller.signal,
        })
        if (!response.ok) throw new Error("Riwayat pesanan belum dapat dimuat.")
        const result: { orders: Order[] } = await response.json()
        setOrders(result.orders)
      } catch {
        if (!controller.signal.aborted) setError("Riwayat pesanan belum dapat dimuat. Coba refresh halaman.")
      }
    }
    void load()
    return () => controller.abort()
  }, [])

  if (error) return <p role="alert" className="text-sm text-destructive">{error}</p>
  if (!orders) return <p role="status" className="text-sm text-muted-foreground">Memuat pesanan...</p>
  if (!orders.length) return <p className="text-sm text-muted-foreground">Belum ada pesanan di browser ini.</p>
  return (
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <article key={order.id} className="rounded-xl border bg-card p-5">
          <h2 className="font-heading text-lg font-bold">{order.produkTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Rp {order.amount.toLocaleString("id-ID")} · {new Date(order.createdAt).toLocaleDateString("id-ID")}</p>
          <p className="mt-3 text-sm">Pembayaran: {order.status === "paid" ? "Terverifikasi" : "Belum terverifikasi"}</p>
          <p className="mt-1 text-sm font-semibold">Status pesanan: {order.status === "paid" ? statusLabels[order.proses as StatusProses] ?? "Tidak diketahui" : "Menunggu verifikasi pembayaran"}</p>
        </article>
      ))}
    </div>
  )
}
