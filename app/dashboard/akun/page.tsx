import { redirect } from "next/navigation"

import { getCurrentProfile } from "@/lib/server/current-profile"
import { AccountNameForm } from "./name-form"

export default async function AccountPage() {
  const user = await getCurrentProfile()
  if (!user) redirect("/login")

  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="font-heading text-3xl font-bold">Akun</h1>
      <p className="mt-2 text-sm text-muted-foreground">Informasi akun yang sedang Anda gunakan.</p>
      <AccountNameForm initialName={user.name ?? ""} image={user.image} />
      <dl className="mt-6 divide-y divide-border rounded-2xl border bg-card px-5">
        {[
          ["Email", user.email || "Belum diisi"],
          ["Peran", user.role === "ADMIN" ? "Admin" : "Pengguna"],
        ].map(([label, value]) => (
          <div key={label} className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr]">
            <dt className="text-sm text-muted-foreground">{label}</dt>
            <dd className="min-w-0 break-all text-sm font-medium">{value}</dd>
          </div>
        ))}
      </dl>
    </section>
  )
}
