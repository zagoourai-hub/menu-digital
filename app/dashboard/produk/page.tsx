import { ArrowLeft, Plus } from "lucide-react"
import Link from "next/link"

import { ProductListContainer } from "./_components/product-list-container"

export default function ProductsPage() {
  return (
    <div className="mx-auto max-w-5xl">
      <Link href="/dashboard#katalog" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" /> Kembali ke dashboard</Link>
      <div className="mt-8 flex flex-wrap items-end justify-between gap-4">
        <div><p className="text-sm text-muted-foreground">Katalog menu</p><h1 className="mt-2 font-heading text-3xl font-bold tracking-tight">Produk</h1><p className="mt-2 text-sm leading-6 text-muted-foreground">Lihat dan kelola produk yang akan ditampilkan di menu.</p></div>
        <Link href="/dashboard/produk/tambah" className="inline-flex h-10 items-center gap-2 rounded-full bg-primary px-4 text-sm font-semibold text-primary-foreground hover:bg-primary/80 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring"><Plus className="size-4" aria-hidden="true" /> Tambah produk</Link>
      </div>
      <div className="mt-8"><ProductListContainer /></div>
    </div>
  )
}
