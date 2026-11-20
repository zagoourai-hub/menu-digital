import { ArrowLeft, Leaf } from "lucide-react"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { cache } from "react"

import { prisma } from "@/lib/prisma"
import { PayButton } from "./pay-button"
import { getToko } from "@/lib/server/toko.service"

const getMenu = cache((id: string) => prisma.produk.findFirst({
    where: { id, published: true },
    select: { title: true, description: true, price: true, imageUrl: true },
}))

type PageProps = { params: Promise<{ id: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params
  const menu = await getMenu(id)
  if (!menu) return { title: "Menu tidak ditemukan" }

  return {
    title: menu.title,
    description: menu.description || `Lihat detail dan harga ${menu.title} di Es Teh.`,
  }
}

export default async function MenuDetailPage({ params }: PageProps) {
  const { id } = await params
  const menu = await getMenu(id)

  if (!menu) notFound()

  const toko = await getToko()
  const whatsappUrl = `https://wa.me/${toko.whatsapp}?text=${encodeURIComponent(`Halo, saya ingin memesan ${menu.title}. Apakah tersedia?`)}`

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border px-5 md:px-10">
        <div className="mx-auto flex h-18 max-w-6xl items-center justify-between">
          <Link href="/" className="inline-flex items-start gap-1 font-heading text-3xl font-bold tracking-tight text-primary-foreground dark:text-primary">
            {toko.nama}.<Leaf aria-hidden="true" className="size-5" />
          </Link>
          <Link href="/#menu" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Semua menu
          </Link>
          <Link href="/pesanan" className="text-sm font-medium text-muted-foreground hover:text-foreground">
            Pesanan
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-8 md:px-10 md:py-12">
        <Link href="/#menu" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ArrowLeft aria-hidden="true" className="size-4" /> Kembali ke menu
        </Link>

        <article className="mt-8 grid items-center gap-8 md:mt-12 md:grid-cols-2 md:gap-16">
          <div className="relative aspect-[4/5] max-h-[620px] overflow-hidden rounded-3xl bg-muted">
            {menu.imageUrl ? (
              <Image src={menu.imageUrl} alt={menu.title} fill priority sizes="(min-width: 768px) 50vw, 100vw" className="object-cover" />
            ) : (
              <div className="flex size-full items-center justify-center text-sm text-muted-foreground">Gambar belum tersedia</div>
            )}
          </div>

          <div className="max-w-lg py-2">
            <p className="text-sm font-semibold text-muted-foreground">{toko.nama} · {toko.buka ? "Buka" : "Tutup"} · {toko.jamBuka}–{toko.jamTutup}</p>
            <h1 className="mt-4 font-heading text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">{menu.title}</h1>
            <p className="mt-6 text-lg leading-relaxed text-muted-foreground">{menu.description || "Menu Es Teh pilihan."}</p>
            <div className="mt-9 border-t border-border pt-6">
              <p className="text-sm text-muted-foreground">Harga</p>
              <p className="mt-2 font-heading text-3xl font-bold">Rp {menu.price.toLocaleString("id-ID")}</p>
            </div>
            <div className="mt-10 flex flex-wrap items-start gap-4">
              <PayButton productId={id} productTitle={menu.title} productPrice={menu.price} imageUrl={menu.imageUrl} clientKey={process.env.NODE_ENV === "production" ? undefined : process.env.MIDTRANS_CLIENT_KEY} />
              <a href={whatsappUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-full bg-primary px-6 text-sm font-semibold text-primary-foreground hover:bg-primary/80 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">
                <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" className="size-5">
                  <path d="M20.52 3.48A11.86 11.86 0 0 0 12.04 0C5.43 0 .05 5.38.05 11.99c0 2.11.55 4.17 1.6 5.99L0 24l6.17-1.62a11.97 11.97 0 0 0 5.87 1.5h.01c6.61 0 11.99-5.38 11.99-11.99 0-3.2-1.25-6.21-3.52-8.47ZM12.05 21.85h-.01a9.95 9.95 0 0 1-5.07-1.39l-.36-.22-3.66.96.98-3.57-.24-.37a9.94 9.94 0 0 1-1.53-5.27c0-5.49 4.47-9.96 9.97-9.96a9.9 9.9 0 0 1 7.04 2.92 9.9 9.9 0 0 1 2.91 7.05c0 5.49-4.47 9.95-9.96 9.95Zm5.46-7.45c-.3-.15-1.77-.87-2.05-.97-.27-.1-.47-.15-.67.15-.2.3-.77.97-.94 1.17-.17.2-.35.22-.65.07-.3-.15-1.26-.46-2.4-1.48-.89-.79-1.49-1.77-1.66-2.07-.17-.3-.02-.46.13-.61.13-.13.3-.35.45-.52.15-.18.2-.3.3-.5.1-.2.05-.38-.02-.53-.08-.15-.67-1.62-.92-2.22-.24-.58-.49-.5-.67-.51h-.57c-.2 0-.52.07-.79.37-.27.3-1.04 1.02-1.04 2.49s1.07 2.89 1.22 3.09c.15.2 2.1 3.2 5.09 4.49.71.31 1.27.5 1.7.64.72.23 1.38.2 1.9.12.58-.09 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.08-.12-.28-.2-.58-.35Z" />
                </svg>
                Pesan via WhatsApp
              </a>
              <Link href="/#menu" className="text-sm font-medium text-muted-foreground underline underline-offset-4 hover:text-foreground">
                Lihat menu lainnya
              </Link>
            </div>
          </div>
        </article>
      </main>
    </div>
  )
}
