import { ArrowUpRight, CircleUserRound } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

export function DashboardOverview({ name, email }: { name: string; email?: string | null }) {
  return (
    <div className="grid gap-4 xl:grid-cols-[1.7fr_1fr]">
      <section aria-labelledby="dashboard-title" className="relative min-h-60 overflow-hidden rounded-2xl bg-muted">
        <Image src="/assets/hero.png" alt="" fill priority sizes="(min-width: 1280px) 50vw, 100vw" className="object-cover object-center" />
        <div className="absolute inset-0 bg-linear-to-r from-foreground via-foreground/85 to-foreground/20 dark:from-background dark:via-background/85 dark:to-background/20" />
        <div className="relative flex h-full min-h-60 flex-col items-start justify-between gap-6 p-6 text-background sm:p-8 dark:text-foreground">
          <div><p className="text-xs font-medium text-background/80 dark:text-foreground/80">Ruang kerja EsTeh</p><h1 id="dashboard-title" className="mt-3 max-w-xs font-heading text-3xl leading-tight font-bold tracking-tight">Menu segar, siap dilihat.</h1><p className="mt-2 max-w-xs text-sm leading-6 text-background/80 dark:text-foreground/80">Pantau informasi menu digital Anda.</p></div>
          <Link href="/#menu" className="inline-flex h-10 items-center gap-2 rounded-full bg-background px-4 text-sm font-semibold text-foreground shadow-sm transition-colors hover:bg-accent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary dark:bg-card dark:text-card-foreground">Lihat menu publik <ArrowUpRight className="size-4" aria-hidden="true" /></Link>
        </div>
      </section>
      <section id="akun" aria-labelledby="account-title" className="min-w-0 scroll-mt-4 rounded-2xl bg-primary/10 p-6 text-foreground sm:p-7">
        <div className="flex items-start justify-between gap-3"><div><p className="text-xs font-medium text-muted-foreground">Akun Anda</p><h2 id="account-title" className="mt-2 font-heading text-lg font-bold">Ruang kerja aktif</h2></div><CircleUserRound className="size-5 shrink-0 text-muted-foreground" aria-hidden="true" /></div>
        <div className="mt-6 flex items-center gap-4"><span className="flex size-16 shrink-0 items-center justify-center rounded-full border-4 border-primary bg-card font-heading text-2xl font-bold text-card-foreground">{name.trim().charAt(0).toUpperCase()}</span><div className="min-w-0"><p className="truncate text-sm font-semibold">{name}</p><p className="mt-1 break-all text-xs leading-5 text-muted-foreground">{email || "Tidak tersedia"}</p><p className="mt-2 inline-flex items-center gap-2 text-xs font-medium"><span className="size-2 rounded-full bg-primary" aria-hidden="true" /> Sesi saat ini aktif</p></div></div>
      </section>
    </div>
  )
}
