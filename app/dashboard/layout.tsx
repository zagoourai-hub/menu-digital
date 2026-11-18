import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { DashboardHeader } from "./_components/dashboard-header"
import { DashboardSidebar } from "./_components/dashboard-sidebar"
import { MobileDashboardNavigation } from "./navigation"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div className="min-h-dvh bg-muted p-3 text-foreground sm:p-4">
      <div className="mx-auto flex min-h-[calc(100dvh-1.5rem)] w-full overflow-hidden rounded-[2rem] border border-border bg-background shadow-lg shadow-foreground/10 sm:min-h-[calc(100dvh-2rem)]">
        <DashboardSidebar />
        <main className="min-w-0 flex-1 bg-background p-4 pb-28 sm:p-6 sm:pb-28 lg:p-8 xl:p-10">
          <DashboardHeader name={session.user.name || "teman EsTeh"} email={session.user.email} />
          {children}
          <footer className="flex flex-wrap justify-between gap-2 px-1 pt-5 text-xs text-muted-foreground"><span>EsTeh Digital Menu</span><span>Dibuat untuk menemani harimu.</span></footer>
        </main>
      </div>
      <MobileDashboardNavigation />
    </div>
  )
}
