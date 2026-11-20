import { redirect } from "next/navigation"

import Link from "next/link"
import { getCurrentProfile } from "@/lib/server/current-profile"
import { ErrorBoundary } from "@/components/error-fallback"
import { DashboardMenuTable } from "./_components/menu-table"
import { DashboardOverview } from "./_components/overview"

export default async function DashboardPage() {
  const profile = await getCurrentProfile()
  if (!profile) redirect("/login")

  return (
    <div className="flex flex-col gap-4">
      <DashboardOverview name={profile.name || "teman EsTeh"} email={profile.email} />
      <nav aria-label="Akses cepat dashboard" className="grid gap-3 sm:grid-cols-2">
        <Link href="/dashboard/katalog" className="rounded-2xl border border-border bg-card p-5 hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring">
          <span className="block font-semibold">Katalog menu</span>
          <span className="mt-1 block text-sm text-muted-foreground">Lihat dan kelola produk.</span>
        </Link>
        <Link href="/dashboard/pesanan" className="rounded-2xl border border-border bg-card p-5 hover:bg-accent focus-visible:outline-2 focus-visible:outline-ring">
          <span className="block font-semibold">Pesanan</span>
          <span className="mt-1 block text-sm text-muted-foreground">Pantau pembayaran dan proses pesanan.</span>
        </Link>
      </nav>
      <ErrorBoundary title="Daftar menu belum dapat dimuat">
        <DashboardMenuTable />
      </ErrorBoundary>
    </div>
  )
}
