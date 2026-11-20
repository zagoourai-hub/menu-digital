"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Image from "next/image"
import Script from "next/script"
import { CircleAlert, CircleCheck, CreditCard, LoaderCircle, ShoppingBag, X } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import styles from "./payment-dialog.module.css"
import type { z } from "zod"
import { customerSchema } from "@/lib/schemas/toko.schema"
import { calculateDeliveryFee, DELIVERY_RATE_PER_KM, MAX_DELIVERY_KM } from "@/lib/ongkir"

declare global {
  interface Window {
    snap?: {
      embed: (token: string, options: {
        embedId: string
        onSuccess: () => void
        onPending: () => void
        onError: () => void
        onClose: () => void
      }) => void
      hide: () => void
    }
  }
}

type PayButtonProps = { productId: string; productTitle: string; productPrice: number; imageUrl: string | null; clientKey?: string }
type Customer = z.infer<typeof customerSchema>
type Invoice = { amount: number; productPrice: number; deliveryFee: number }

export function PayButton({ productId, productTitle, productPrice, imageUrl, clientKey }: PayButtonProps) {
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [expired, setExpired] = useState(false)
  const [verificationFailed, setVerificationFailed] = useState(false)
  const [message, setMessage] = useState("")
  const [scriptFailed, setScriptFailed] = useState(false)
  const [existingInvoice, setExistingInvoice] = useState<Invoice>()
  const [previewCustomer, setPreviewCustomer] = useState<Customer>()
  const [fulfillment, setFulfillment] = useState<"PICKUP" | "DELIVERY">("PICKUP")
  const [showPayment, setShowPayment] = useState(false)
  const busy = useRef(false)
  const finished = useRef(false)
  const orderId = useRef<string | null>(null)
  const dialog = useRef<HTMLDialogElement>(null)

  const getOrder = useCallback(async (id: string, verifyOnly = false, customer?: Customer, expectedAmount?: number) => {
    const response = await fetch(`/api/sandbox-payment/${encodeURIComponent(productId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, verifyOnly, customer, expectedAmount }),
    })
    const result: { token?: string; status?: string; message?: string; amount?: number; productPrice?: number; deliveryFee?: number } = await response.json()
    if (!response.ok) throw new Error(result.message || "Pembayaran belum dapat dimulai.")
    return result
  }, [productId])

  useEffect(() => {
    let active = true
    async function restoreOrder() {
      try {
        const saved = localStorage.getItem(`sandbox-order:${productId}`)
        if (!saved) return
        orderId.current = saved
        const result = await getOrder(saved, true)
        if (!active) return
        if (result.status === "paid") {
          finished.current = true
          setCompleted(true)
          setMessage("Pembayaran sudah diverifikasi oleh server.")
        } else if (result.status === "expired") {
          finished.current = true
          setExpired(true)
          setMessage("Batas waktu pembayaran sudah habis.")
        } else if (result.status === "pending" && result.amount !== undefined && result.productPrice !== undefined && result.deliveryFee !== undefined) {
          setExistingInvoice({ amount: result.amount, productPrice: result.productPrice, deliveryFee: result.deliveryFee })
        }
      } catch (error) {
        if (active) {
          finished.current = true
          setVerificationFailed(true)
          setMessage(`${error instanceof Error ? error.message : "Status pesanan belum dapat diverifikasi."} Jangan membuat pesanan baru.`)
        }
      } finally {
        if (active) setChecking(false)
      }
    }
    void restoreOrder()
    return () => { active = false }
  }, [getOrder, productId])

  async function pay(customer: Customer) {
    if (busy.current || finished.current) return
    if (!window.snap) {
      setMessage("Popup pembayaran belum siap. Coba lagi.")
      return
    }

    busy.current = true
    setLoading(true)
    setMessage("")
    try {
      const storageKey = `sandbox-order:${productId}`
      const id = orderId.current ?? localStorage.getItem(storageKey) ?? crypto.randomUUID()
      orderId.current = id
      localStorage.setItem(storageKey, id)
      const deliveryFee = customer.fulfillment === "DELIVERY" ? calculateDeliveryFee(customer.distanceKm) : 0
      const result = await getOrder(id, false, customer, productPrice + deliveryFee)
      if (result.status === "expired") {
        dialog.current?.close()
        finished.current = true
        setExpired(true)
        setLoading(false)
        setMessage("Batas waktu pembayaran sudah habis.")
        return
      }
      if (result.status === "paid") {
        dialog.current?.close()
        finished.current = true
        setCompleted(true)
        setLoading(false)
        setMessage("Pembayaran sudah diverifikasi oleh server.")
        return
      }
      if (!result.token) throw new Error("Token pembayaran belum tersedia.")

      const unlock = (text: string) => {
        if (finished.current) return
        busy.current = false
        setLoading(false)
        setShowPayment(false)
        setMessage(text)
      }

      if (result.amount !== undefined && result.productPrice !== undefined && result.deliveryFee !== undefined) {
        setExistingInvoice({ amount: result.amount, productPrice: result.productPrice, deliveryFee: result.deliveryFee })
      }
      setShowPayment(true)
      window.snap.embed(result.token, {
        embedId: "snap-payment-container",
        onSuccess: () => {
          dialog.current?.close()
          setShowPayment(false)
          finished.current = true
          setCompleted(true)
          setLoading(false)
          setMessage("Pembayaran selesai di sandbox. Memeriksa status di server...")
          void getOrder(id).then((verified) => {
            setMessage(verified.status === "paid"
              ? "Pembayaran sudah diverifikasi oleh server."
              : "Pembayaran belum terverifikasi. Jangan membayar ulang.")
          }).catch(() => setMessage("Status belum dapat diverifikasi. Jangan membayar ulang."))
        },
        onPending: () => { dialog.current?.close(); unlock("Pembayaran masih menunggu penyelesaian. Buka kembali untuk melanjutkan.") },
        onError: () => { dialog.current?.close(); unlock("Pembayaran gagal. Buka kembali untuk mencoba transaksi yang sama.") },
        onClose: () => { dialog.current?.close(); unlock("Popup pembayaran ditutup. Buka kembali untuk melanjutkan transaksi yang sama.") },
      })
    } catch (error) {
      setShowPayment(false)
      busy.current = false
      setLoading(false)
      setMessage(error instanceof Error ? error.message : "Pembayaran belum dapat dimulai.")
    }
  }

  if (!clientKey) return <p className="order-last basis-full text-sm text-muted-foreground">Pembayaran sandbox belum dikonfigurasi.</p>

  const waiting = checking || loading
  const PaymentIcon = waiting ? LoaderCircle : verificationFailed || expired ? CircleAlert : completed ? CircleCheck : CreditCard

  async function startNewOrder() {
    if (busy.current || !expired || !orderId.current) return
    busy.current = true
    setLoading(true)
    try {
      const previousId = orderId.current
      const result = await getOrder(previousId, true)
      if (result.status !== "expired") throw new Error("Status pesanan belum dapat dipastikan. Jangan membuat pesanan baru.")

      const activeKey = `sandbox-order:${productId}`
      if (localStorage.getItem(activeKey) !== previousId) {
        throw new Error("Pesanan berubah di tab lain. Muat ulang halaman untuk memeriksa status.")
      }
      localStorage.setItem(`sandbox-history:${previousId}`, previousId)
      localStorage.removeItem(activeKey)
      orderId.current = null
      finished.current = false
      setExpired(false)
      setExistingInvoice(undefined)
      setPreviewCustomer(undefined)
      setMessage("Pesanan sebelumnya kedaluwarsa. Silakan buat pesanan baru.")
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Pesanan baru belum dapat disiapkan.")
    } finally {
      busy.current = false
      setLoading(false)
    }
  }

  function closePayment() {
    if (showPayment) window.snap?.hide()
    dialog.current?.close()
    busy.current = false
    setLoading(false)
    setShowPayment(false)
    setMessage("Pembayaran ditutup. Pilih Bayar langsung untuk membuka transaksi yang sama.")
  }

  return (
    <>
      <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={clientKey} onError={() => setScriptFailed(true)} />
      <Button type="button" size="lg" className="h-11" onClick={() => expired ? void startNewOrder() : dialog.current?.showModal()} aria-haspopup={expired ? undefined : "dialog"} aria-busy={waiting} disabled={waiting || completed || verificationFailed || scriptFailed}>
        <PaymentIcon data-icon="inline-start" aria-hidden="true" className={waiting ? "motion-safe:animate-spin" : undefined} />
        {checking ? "Memeriksa pesanan..." : loading ? "Memproses..." : expired ? "Buat pesanan baru" : verificationFailed ? "Status belum pasti" : completed ? "Pembayaran selesai" : "Bayar langsung"}
      </Button>
      <dialog ref={dialog} aria-labelledby="payment-dialog-title" aria-describedby="payment-dialog-description" onCancel={(event) => {
        event.preventDefault()
        closePayment()
      }} className={`${styles.dialog} fixed inset-x-0 bottom-0 top-auto mx-auto mt-0 mb-0 max-h-[94dvh] w-full max-w-lg overflow-y-auto overscroll-contain rounded-t-2xl bg-background p-0 text-foreground shadow-xl sm:inset-0 sm:m-auto sm:max-h-[90dvh] sm:rounded-2xl sm:border sm:border-border`}>
        <div className="sticky top-0 z-10 flex items-center justify-between gap-4 border-b border-border bg-background px-5 py-3">
          <div className="min-w-0">
            <h2 id="payment-dialog-title" className="font-heading text-lg font-bold">Checkout</h2>
            <p id="payment-dialog-description" className="text-xs text-muted-foreground">Simulasi pembayaran Midtrans</p>
          </div>
          <Button type="button" variant="ghost" onClick={closePayment} className="min-h-11">
            <X data-icon="inline-start" aria-hidden="true" /> Tutup
          </Button>
        </div>
        <section aria-labelledby="checkout-order-title" className="border-b border-border px-5 py-4">
          <h3 id="checkout-order-title" className="text-sm font-semibold">Ringkasan pesanan</h3>
          <div className="mt-3 flex items-center gap-3">
            <div className="relative grid size-12 shrink-0 place-items-center overflow-hidden rounded-lg bg-muted text-muted-foreground">
              {imageUrl ? <Image src={imageUrl} alt="" fill sizes="48px" className="object-cover" /> : <ShoppingBag className="size-5" aria-hidden="true" />}
            </div>
            <div className="min-w-0 flex-1">
              <p className="font-medium">{productTitle}</p>
              <p className="text-xs text-muted-foreground">1 minuman</p>
            </div>
            <p className="shrink-0 text-right text-xs text-muted-foreground">Harga menu <strong className="block text-sm text-foreground">Rp {(existingInvoice?.productPrice ?? productPrice).toLocaleString("id-ID")}</strong></p>
          </div>
        </section>
        <div hidden={showPayment} className="p-5">
          <form onChange={(event) => {
            const form = new FormData(event.currentTarget)
            const method = form.get("fulfillment")
            const distance = String(form.get("distanceKm") ?? "").trim()
            const input = customerSchema.safeParse({
              fulfillment: method,
              customerName: form.get("customerName"),
              customerPhone: form.get("customerPhone"),
              ...(method === "DELIVERY" ? { deliveryAddress: form.get("deliveryAddress"), distanceKm: distance ? Number(distance) : undefined } : {}),
            })
            setPreviewCustomer(input.success ? input.data : undefined)
          }} onSubmit={(event) => {
            event.preventDefault()
            const form = new FormData(event.currentTarget)
            const customer = {
              fulfillment,
              customerName: String(form.get("customerName") ?? ""),
              customerPhone: String(form.get("customerPhone") ?? ""),
              ...(fulfillment === "DELIVERY" ? { deliveryAddress: String(form.get("deliveryAddress") ?? ""), distanceKm: Number(form.get("distanceKm")) } : {}),
            }
            const result = customerSchema.safeParse(customer)
            if (!result.success) { setMessage("Periksa kembali data pelanggan, alamat, dan jarak."); return }
            void pay(result.data)
          }}>
            <FieldGroup>
              <Field><FieldLabel htmlFor="customer-name">Nama pelanggan</FieldLabel><Input id="customer-name" name="customerName" autoComplete="name" maxLength={100} className="border-input" required /></Field>
              <Field><FieldLabel htmlFor="customer-phone">Nomor kontak</FieldLabel><Input id="customer-phone" name="customerPhone" type="tel" autoComplete="tel" pattern="\+?[0-9]{9,16}" className="border-input" required /><p className="text-xs text-muted-foreground">Gunakan 9–16 digit, boleh diawali +.</p></Field>
              <Field><FieldLabel htmlFor="fulfillment">Cara menerima pesanan</FieldLabel><select id="fulfillment" name="fulfillment" value={fulfillment} onChange={(event) => setFulfillment(event.target.value as "PICKUP" | "DELIVERY")} className="h-10 rounded-md border border-input bg-background px-3 text-sm"><option value="PICKUP">Ambil sendiri</option><option value="DELIVERY">Diantar</option></select></Field>
              {fulfillment === "DELIVERY" && <Field><FieldLabel htmlFor="delivery-address">Alamat pengiriman</FieldLabel><Textarea id="delivery-address" name="deliveryAddress" autoComplete="street-address" minLength={5} maxLength={500} required /></Field>}
              {fulfillment === "DELIVERY" && <Field><FieldLabel htmlFor="delivery-distance">Perkiraan jarak (km)</FieldLabel><Input id="delivery-distance" name="distanceKm" type="number" inputMode="decimal" min="0.1" max={MAX_DELIVERY_KM} step="any" className="border-input" required /><p className="text-xs text-muted-foreground">Masukkan jarak perkiraan. Ongkir Rp {DELIVERY_RATE_PER_KM.toLocaleString("id-ID")}/km, dibulatkan ke atas.</p></Field>}
              {message && <p role="alert" className="text-sm text-destructive">{message}</p>}
              <p className="text-xs text-muted-foreground">Untuk transaksi yang sudah dibuat, data pelanggan sebelumnya tetap digunakan.</p>
              {(previewCustomer || existingInvoice) && (() => {
                const fee = existingInvoice?.deliveryFee ?? (previewCustomer?.fulfillment === "DELIVERY" ? calculateDeliveryFee(previewCustomer.distanceKm) : 0)
                const price = existingInvoice?.productPrice ?? productPrice
                return <section aria-label="Invoice pesanan" className="rounded-xl border border-border bg-muted/30 p-4 text-sm">
                  <h3 className="font-semibold">Invoice {existingInvoice ? "pesanan tersimpan" : "perkiraan"}</h3>
                  <div className="mt-3 flex justify-between gap-3"><span>Harga menu</span><span>Rp {price.toLocaleString("id-ID")}</span></div>
                  <div className="mt-2 flex justify-between gap-3"><span>Ongkos kirim</span><span>Rp {fee.toLocaleString("id-ID")}</span></div>
                  <div className="mt-3 flex justify-between gap-3 border-t border-border pt-3 font-bold"><span>Total</span><span>Rp {(existingInvoice?.amount ?? price + fee).toLocaleString("id-ID")}</span></div>
                  {!existingInvoice && previewCustomer?.fulfillment === "DELIVERY" && <p className="mt-2 text-xs text-muted-foreground">Jarak diisi pelanggan dan belum diverifikasi oleh toko.</p>}
                </section>
              })()}
              <Button type="submit" disabled={loading}>{loading ? "Menyiapkan pembayaran..." : "Lanjut ke pembayaran"}</Button>
            </FieldGroup>
          </form>
        </div>
        <h3 hidden={!showPayment} className="px-5 pt-4 pb-2 text-sm font-semibold">Metode pembayaran</h3>
        <div hidden={!showPayment} id="snap-payment-container" className="min-h-[560px] w-full" />
      </dialog>
      <p className="order-last basis-full text-xs text-muted-foreground">Pembayaran percobaan (sandbox), belum untuk transaksi nyata.</p>
      {(message || scriptFailed) && <p role="status" className="order-last basis-full text-sm text-muted-foreground">{message || "Popup pembayaran gagal dimuat. Periksa koneksi Anda."}</p>}
    </>
  )
}
