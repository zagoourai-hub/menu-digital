import { redirect } from "next/navigation"
import { getCurrentActor } from "@/lib/server/authorize"

export default async function CreateProductLayout({ children }: { children: React.ReactNode }) {
  const actor = await getCurrentActor()
  if (!actor) redirect("/login")
  if (actor.role !== "ADMIN") redirect("/dashboard/produk")
  return children
}
