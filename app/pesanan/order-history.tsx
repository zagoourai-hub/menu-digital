"use client"

import { useEffect, useState } from "react"
import { Dialog } from "@base-ui/react/dialog"

import { Button } from "@/components/ui/button"
import { statusLabels, type StatusProses } from "@/lib/pesanan-status"

type Order = { id: string; produkTitle: string; amount: number; status: string; proses: string; createdAt: string; customerName: string | null; customerPhone: string | null; fulfillment: string | null; deliveryAddress: string | null }

export function OrderHistory() {
  const [orders, setOrders] = useState<Order[] | null>(null)
  const [error, setError] = useState("")
  const [selected, setSelected] = useState<Order | null>(null)
  const [deleteError, setDeleteError] = useState("")

  useEffect(() => {
    const controller = new AbortController()
    async function load() {
      try {
        const ids = Array.from({ length: localStorage.length }, (_, index) => localStorage.key(index))
          .filter((key): key is string => !!key && (key.startsWith("sandbox-order:") || key.startsWith("sandbox-history:")))
          .map((key) => localStorage.getItem(key))
          .filter((id): id is string => !!id && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id))
          .filter((id) => localStorage.getItem(`sandbox-hidden:${id}`) !== "1")
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

  function hideOrder(id: string) {
    try {
      localStorage.setItem(`sandbox-hidden:${id}`, "1")
      setOrders((current) => current?.filter((order) => order.id !== id) ?? null)
      setSelected(null)
    } catch {
      setDeleteError("Riwayat belum dapat dihapus di browser ini.")
    }
  }

  if (error) return <p role="alert" className="text-sm text-destructive">{error}</p>
  if (!orders) return <p role="status" className="text-sm text-muted-foreground">Memuat pesanan...</p>
  if (!orders.length) return <p className="text-sm text-muted-foreground">Belum ada pesanan di browser ini.</p>
  return (
    <>
    <div className="flex flex-col gap-3">
      {orders.map((order) => (
        <article key={order.id} className="rounded-xl border bg-card p-5">
          <h2 className="font-heading text-lg font-bold">{order.produkTitle}</h2>
          <p className="mt-1 text-sm text-muted-foreground">Rp {order.amount.toLocaleString("id-ID")} · {new Date(order.createdAt).toLocaleDateString("id-ID")}</p>
          {order.customerName && <p className="mt-2 text-sm">{order.customerName} · {order.customerPhone}</p>}
          {order.fulfillment && <p className="mt-1 text-sm text-muted-foreground">{order.fulfillment === "DELIVERY" ? `Diantar: ${order.deliveryAddress}` : "Ambil sendiri"}</p>}
          {order.status === "expired" ? (
            <p className="mt-3 w-fit rounded-full bg-destructive/10 px-2.5 py-1 text-xs font-semibold text-destructive">Expired</p>
          ) : (
            <>
              <p className="mt-3 text-sm">Pembayaran: {order.status === "paid" ? "Terverifikasi" : "Belum terverifikasi"}</p>
              <p className="mt-1 text-sm font-semibold">Status pesanan: {order.status === "paid" ? statusLabels[order.proses as StatusProses] ?? "Tidak diketahui" : "Menunggu verifikasi pembayaran"}</p>
            </>
          )}
          <button type="button" onClick={() => { setDeleteError(""); setSelected(order) }} aria-label={`Hapus ${order.produkTitle} dari riwayat`} className="mt-4 text-sm font-medium text-destructive underline underline-offset-4 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2">
            Hapus dari riwayat
          </button>
        </article>
      ))}
    </div>
    <Dialog.Root open={!!selected} onOpenChange={(open) => { if (!open) setSelected(null) }}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-foreground/40" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-lg outline-none">
          <Dialog.Title className="font-heading text-xl font-bold">Hapus dari riwayat?</Dialog.Title>
          <Dialog.Description className="mt-3 text-sm leading-6 text-muted-foreground">
            Pesanan {selected?.produkTitle} akan disembunyikan dari browser ini. Data pesanan tetap tersimpan di toko.
          </Dialog.Description>
          {deleteError && <p role="alert" className="mt-4 text-sm text-destructive">{deleteError}</p>}
          <div className="mt-6 flex justify-end gap-2">
            <Dialog.Close render={<Button variant="outline" />}>Batal</Dialog.Close>
            <Button type="button" variant="destructive" onClick={() => { if (selected) hideOrder(selected.id) }}>Hapus</Button>
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
    </>
  )
}
