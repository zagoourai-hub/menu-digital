import { ArrowUpRight, ExternalLink } from "lucide-react"
import Link from "next/link"

import { buttonVariants } from "@/components/ui/button"

export function DashboardCatalog({ published, drafts }: { published: number; drafts: number }) {
  const stats = [
    { label: "Total produk", count: published + drafts },
    { label: "Dipublikasikan", count: published },
    { label: "Draft", count: drafts },
  ]

  return (
    <>
      <dl className="mt-6 grid gap-3 sm:grid-cols-3">
        {stats.map(({ label, count }) => (
          <div key={label} className="rounded-2xl border border-border bg-card p-5">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="mt-2 font-heading text-3xl font-bold tabular-nums">{count}</dd>
          </div>
        ))}
      </dl>
      <div className="mt-6 flex flex-wrap gap-3">
        <Link href="/dashboard/produk" className={buttonVariants({ size: "lg" })}>
          Kelola produk <ArrowUpRight data-icon="inline-end" aria-hidden="true" />
        </Link>
        <Link href="/#menu" className={buttonVariants({ variant: "outline", size: "lg" })}>
          Lihat menu publik <ExternalLink data-icon="inline-end" aria-hidden="true" />
        </Link>
      </div>
    </>
  )
}
