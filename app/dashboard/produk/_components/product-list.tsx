"use client"

import { Dialog } from "@base-ui/react/dialog"
import { PackageSearch, Pencil, Trash2 } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import type { Product } from "../_lib/product.schema"

interface ProductListProps {
  products?: Product[]
  onDelete?: (id: string) => void | Promise<void>
}

export function ProductList({ products, onDelete }: ProductListProps) {
  const [selected, setSelected] = useState<Product | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState("")

  async function deleteProduct() {
    if (!selected) return
    if (!onDelete) {
      setError("Penghapusan belum terhubung. Produk tidak dihapus.")
      return
    }
    setIsDeleting(true)
    setError("")
    try {
      await onDelete(selected.id)
      setSelected(null)
    } catch {
      setError("Produk belum dapat dihapus. Coba lagi.")
    } finally {
      setIsDeleting(false)
    }
  }

  if (!products || products.length === 0) {
    return (
      <div className="flex flex-col items-center rounded-2xl border border-dashed border-border bg-card px-6 py-16 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-muted"><PackageSearch className="size-5" aria-hidden="true" /></span>
        <h2 className="mt-5 font-heading text-lg font-bold">{products ? "Belum ada produk" : "Daftar produk belum terhubung"}</h2>
        <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">{products ? "Tambahkan produk pertama untuk mulai mengisi katalog." : "Hubungkan sumber data untuk menampilkan dan mengelola produk."}</p>
        <Link href="/dashboard/produk/tambah" className="mt-6 text-sm font-semibold underline decoration-primary decoration-2 underline-offset-4">Buka form tambah produk</Link>
      </div>
    )
  }

  return (
    <>
      <div className="overflow-x-auto rounded-2xl border border-border bg-card">
        <table className="w-full min-w-[640px] text-left text-sm">
          <caption className="sr-only">Daftar produk</caption>
          <thead className="border-b border-border bg-muted/50 text-muted-foreground"><tr><th scope="col" className="px-5 py-4 font-medium">Produk</th><th scope="col" className="px-5 py-4 font-medium">Status</th><th scope="col" className="px-5 py-4 font-medium">Harga</th><th scope="col" className="px-5 py-4 text-right font-medium">Tindakan</th></tr></thead>
          <tbody className="divide-y divide-border">
            {products.map((product) => (
              <tr key={product.id}>
                <td className="px-5 py-4"><div className="flex items-center gap-3"><div className="relative size-12 shrink-0 overflow-hidden rounded-lg bg-muted">{product.imageUrl ? <Image src={product.imageUrl} alt={product.title} fill sizes="48px" unoptimized className="object-cover" /> : <div className="flex size-full items-center justify-center text-xs text-muted-foreground">—</div>}</div><span className="font-semibold">{product.title}</span></div></td>
                <td className="px-5 py-4 text-muted-foreground">{product.published ? "Dipublikasikan" : "Draft"}</td>
                <td className="px-5 py-4">Rp {product.price.toLocaleString("id-ID")}</td>
                <td className="px-5 py-4"><div className="flex justify-end gap-2"><Link href={`/dashboard/produk/${encodeURIComponent(product.id)}/edit`} className="inline-flex size-9 items-center justify-center rounded-full border border-border hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring" aria-label={`Edit ${product.title}`}><Pencil className="size-4" aria-hidden="true" /></Link><Button type="button" variant="outline" size="icon" aria-label={`Hapus ${product.title}`} onClick={() => { setError(""); setSelected(product) }}><Trash2 aria-hidden="true" /></Button></div></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Dialog.Root open={!!selected} onOpenChange={(open) => { if (!open && !isDeleting) setSelected(null) }}>
        <Dialog.Portal>
          <Dialog.Backdrop className="fixed inset-0 z-40 bg-foreground/40" />
          <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-border bg-card p-6 text-card-foreground shadow-lg outline-none">
            <Dialog.Title className="font-heading text-xl font-bold">Hapus produk?</Dialog.Title>
            <Dialog.Description className="mt-3 text-sm leading-6 text-muted-foreground">Produk {selected?.title} akan dihapus jika penghapusan dikonfirmasi.</Dialog.Description>
            {error && <Alert variant="destructive" className="mt-4"><AlertDescription>{error}</AlertDescription></Alert>}
            <div className="mt-6 flex justify-end gap-2"><Dialog.Close render={<Button variant="outline" />} disabled={isDeleting}>Batal</Dialog.Close><Button type="button" variant="destructive" disabled={isDeleting} onClick={deleteProduct}>{isDeleting ? "Menghapus..." : "Hapus produk"}</Button></div>
          </Dialog.Popup>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  )
}
