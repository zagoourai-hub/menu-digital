"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import Script from "next/script"
import { LoaderCircle } from "lucide-react"

import { Button } from "@/components/ui/button"

declare global {
  interface Window {
    snap?: {
      pay: (token: string, options: {
        onSuccess: () => void
        onPending: () => void
        onError: () => void
        onClose: () => void
      }) => void
    }
  }
}

export function PayButton({ productId, clientKey }: { productId: string; clientKey?: string }) {
  const [loading, setLoading] = useState(false)
  const [checking, setChecking] = useState(true)
  const [completed, setCompleted] = useState(false)
  const [verificationFailed, setVerificationFailed] = useState(false)
  const [message, setMessage] = useState("")
  const [scriptFailed, setScriptFailed] = useState(false)
  const busy = useRef(false)
  const finished = useRef(false)
  const orderId = useRef<string | null>(null)

  const getOrder = useCallback(async (id: string, verifyOnly = false) => {
    const response = await fetch(`/api/sandbox-payment/${encodeURIComponent(productId)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId: id, verifyOnly }),
    })
    const result: { token?: string; status?: string; message?: string } = await response.json()
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

  async function pay() {
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
      const result = await getOrder(id)
      if (result.status === "paid") {
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
        setMessage(text)
      }

      window.snap.pay(result.token, {
        onSuccess: () => {
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
        onPending: () => unlock("Pembayaran masih menunggu penyelesaian. Buka kembali untuk melanjutkan."),
        onError: () => unlock("Pembayaran gagal. Buka kembali untuk mencoba transaksi yang sama."),
        onClose: () => unlock("Popup pembayaran ditutup. Buka kembali untuk melanjutkan transaksi yang sama."),
      })
    } catch (error) {
      busy.current = false
      setLoading(false)
      setMessage(error instanceof Error ? error.message : "Pembayaran belum dapat dimulai.")
    }
  }

  if (!clientKey) return <p className="order-last basis-full text-sm text-muted-foreground">Pembayaran sandbox belum dikonfigurasi.</p>

  return (
    <>
      <Script src="https://app.sandbox.midtrans.com/snap/snap.js" data-client-key={clientKey} onError={() => setScriptFailed(true)} />
      <Button type="button" size="lg" className="h-11" onClick={pay} disabled={checking || loading || completed || verificationFailed || scriptFailed}>
        {checking && <LoaderCircle data-icon="inline-start" aria-hidden="true" className="animate-spin motion-reduce:animate-none" />}
        {checking ? "Memeriksa pesanan..." : verificationFailed ? "Status belum pasti" : completed ? "Pembayaran selesai" : loading ? "Pembayaran diproses..." : "Bayar langsung"}
      </Button>
      <p className="order-last basis-full text-xs text-muted-foreground">Pembayaran percobaan (sandbox), belum untuk transaksi nyata.</p>
      {(message || scriptFailed) && <p role="status" className="order-last basis-full text-sm text-muted-foreground">{message || "Popup pembayaran gagal dimuat. Periksa koneksi Anda."}</p>}
    </>
  )
}
