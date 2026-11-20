import { redirect } from "next/navigation"

import { getCurrentProfile } from "@/lib/server/current-profile"
import { DashboardHeader } from "./_components/dashboard-header"
import { DashboardSidebar } from "./_components/dashboard-sidebar"
import { MobileDashboardNavigation } from "./navigation"

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const profile = await getCurrentProfile()
  if (!profile) redirect("/login")

  return (
    <div className="min-h-dvh bg-background text-foreground lg:bg-muted lg:p-4">
      <div className="mx-auto flex min-h-dvh w-full bg-background lg:min-h-[calc(100dvh-2rem)] lg:overflow-hidden lg:rounded-[2rem] lg:border lg:border-border lg:shadow-lg lg:shadow-foreground/10">
        <DashboardSidebar />
        <main className="min-w-0 flex-1 bg-background px-4 pt-4 pb-[calc(5rem+env(safe-area-inset-bottom))] sm:px-6 sm:pt-6 lg:p-8 xl:p-10">
          <DashboardHeader name={profile.name || "teman EsTeh"} email={profile.email} image={profile.image} />
          {children}
          <footer className="flex flex-wrap justify-between gap-2 px-1 pt-5 text-xs text-muted-foreground"><span>EsTeh Digital Menu</span><span>Dibuat untuk menemani harimu.</span></footer>
        </main>
      </div>
      <MobileDashboardNavigation />
    </div>
  )
}
