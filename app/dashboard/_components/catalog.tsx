import { ArrowUpRight, ExternalLink, Leaf, PackageSearch, PanelsTopLeft, Tags } from "lucide-react"
import Link from "next/link"

const features = [
  { title: "Produk", description: "Daftar minuman dan detail produk.", icon: PackageSearch },
  { title: "Kategori", description: "Pengelompokan menu digital.", icon: Tags },
  { title: "Ketersediaan", description: "Status menu untuk pelanggan.", icon: PanelsTopLeft },
]

export function DashboardCatalog() {
  return (
    <>
      <section id="katalog" aria-labelledby="catalog-title" className="mt-3 scroll-mt-4">
        <h2 id="catalog-title" className="sr-only">Katalog menu</h2>
        <div className="grid grid-cols-3 gap-2 sm:gap-3">
          {features.map(({ title, description, icon: Icon }) => (
            <article key={title} className="flex min-w-0 flex-col items-start gap-2 rounded-2xl border border-border bg-card p-3 text-card-foreground sm:flex-row sm:gap-3 sm:p-4">
              <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-muted sm:size-10"><Icon className="size-4 sm:size-5" aria-hidden="true" /></span>
              <div className="min-w-0"><h3 className="text-xs font-semibold sm:text-sm">{title}</h3><p className="mt-1 hidden text-xs leading-5 text-muted-foreground sm:block">{description}</p><p className="mt-1 text-xs font-medium text-muted-foreground sm:mt-2">Belum tersedia</p></div>
            </article>
          ))}
        </div>
      </section>
      <div className="mt-3 grid gap-3 lg:grid-cols-[1.45fr_1fr]">
        <section aria-labelledby="catalog-overview" className="flex min-h-64 flex-col rounded-2xl border border-border bg-card p-6 text-card-foreground sm:p-7">
          <div className="flex items-start justify-between gap-4"><div><p className="text-xs font-medium text-muted-foreground">Menu digital</p><h2 id="catalog-overview" className="mt-2 font-heading text-xl font-bold tracking-tight">Katalog menu</h2></div><span className="flex size-10 shrink-0 items-center justify-center rounded-full bg-muted"><PackageSearch className="size-5" aria-hidden="true" /></span></div>
          <div className="my-7 flex flex-1 flex-col justify-center border-y border-border py-6"><p className="text-sm font-semibold">Pengelolaan katalog belum terhubung</p><p className="mt-2 max-w-md text-sm leading-6 text-muted-foreground">Produk, kategori, dan ketersediaan belum dapat dikelola dari dashboard ini.</p></div>
          <div className="flex flex-wrap items-center gap-5"><Link href="/dashboard/produk" className="inline-flex w-fit items-center gap-2 text-sm font-semibold underline decoration-primary decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">Kelola produk <ArrowUpRight className="size-4" aria-hidden="true" /></Link><Link href="/#menu" className="inline-flex w-fit items-center gap-2 text-sm font-semibold underline decoration-primary decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">Buka menu publik <ExternalLink className="size-4" aria-hidden="true" /></Link></div>
        </section>
        <section className="flex flex-col justify-between rounded-2xl border border-border bg-accent p-6 text-accent-foreground"><div><div className="flex size-10 items-center justify-center rounded-full bg-card text-card-foreground"><Leaf className="size-5" aria-hidden="true" /></div><h2 className="mt-5 font-heading text-lg font-bold">Menu untuk pelanggan</h2><p className="mt-2 text-sm leading-6 text-muted-foreground">Lihat tampilan menu yang saat ini tersedia di halaman publik.</p></div><Link href="/#menu" className="mt-6 inline-flex w-fit items-center gap-2 text-sm font-semibold underline decoration-primary decoration-2 underline-offset-4 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">Lihat menu publik <ArrowUpRight className="size-4" aria-hidden="true" /></Link></section>
      </div>
    </>
  )
}
