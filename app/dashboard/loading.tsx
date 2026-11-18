export default function DashboardLoading() {
  return (
    <main className="min-h-dvh bg-muted p-5 sm:p-10" role="status" aria-label="Memuat dashboard">
      <div className="mx-auto max-w-6xl motion-safe:animate-pulse">
        <div className="h-4 w-24 rounded bg-accent" />
        <div className="mt-5 h-9 w-64 max-w-full rounded bg-accent" />
        <div className="mt-4 h-4 w-80 max-w-full rounded bg-accent" />
        <div className="mt-10 grid gap-4 lg:grid-cols-2">
          <div className="h-64 rounded-2xl border border-border bg-card" />
          <div className="h-64 rounded-2xl border border-border bg-card" />
        </div>
        <div className="mt-10 h-6 w-40 rounded bg-accent" />
        <div className="mt-5 h-44 rounded-2xl border border-border bg-card" />
      </div>
      <span className="sr-only">Memuat dashboard...</span>
    </main>
  )
}
