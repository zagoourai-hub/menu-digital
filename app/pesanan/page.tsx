import Link from "next/link"
import { OrderHistory } from "./order-history"

export default function OrderHistoryPage() {
  return (
    <main className="mx-auto min-h-screen max-w-4xl px-5 py-10">
      <Link href="/#menu" className="text-sm text-muted-foreground hover:text-foreground">← Kembali ke menu</Link>
      <h1 className="mt-8 font-heading text-3xl font-bold">Riwayat pesanan</h1>
      <p className="mt-2 text-sm text-muted-foreground">Menampilkan pesanan yang dibuat pada browser ini. Riwayat tidak mengikuti akun atau perangkat lain.</p>
      <div className="mt-8"><OrderHistory /></div>
    </main>
  )
}
