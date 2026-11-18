import { redirect } from "next/navigation"

import { auth } from "@/lib/auth"
import { DashboardCatalog } from "./_components/catalog"
import { DashboardOverview } from "./_components/overview"

export default async function DashboardPage() {
  const session = await auth()
  if (!session?.user) redirect("/login")

  return (
    <div id="ringkasan" className="scroll-mt-4">
      <DashboardOverview name={session.user.name || "teman EsTeh"} email={session.user.email} />
      <DashboardCatalog />
    </div>
  )
}
