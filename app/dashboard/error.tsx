"use client"

import { Button } from "@/components/ui/button"

export default function DashboardError({ retry }: { retry: () => void }) {
  return (
    <main className="flex min-h-dvh items-center justify-center bg-muted p-5">
      <div role="alert" className="w-full max-w-md rounded-2xl border border-border bg-card p-8 text-card-foreground">
        <h1 className="font-heading text-2xl font-bold">Dashboard tidak dapat dimuat</h1>
        <p className="mt-3 text-sm leading-6 text-muted-foreground">Terjadi kendala saat memuat dashboard. Coba lagi.</p>
        <Button type="button" className="mt-6" onClick={retry}>Coba lagi</Button>
      </div>
    </main>
  )
}
