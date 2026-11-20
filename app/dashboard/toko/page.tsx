import { getToko } from "@/lib/server/toko.service"
import { StoreForm } from "./store-form"
import { getCurrentActor } from "@/lib/server/authorize"
import { redirect } from "next/navigation"

export default async function StorePage() {
  const store = await getToko()
  const actor = await getCurrentActor()
  if (!actor) redirect("/login")
  return (
    <section className="mx-auto max-w-3xl">
      <h1 className="font-heading text-3xl font-bold">Pengaturan toko</h1>
      <p className="mt-2 text-sm text-muted-foreground">Pengaturan berlaku untuk toko bersama dan hanya dapat diubah oleh admin.</p>
      {actor.role === "ADMIN" ? <StoreForm store={store} /> : (
        <dl className="mt-6 divide-y divide-border rounded-2xl border bg-card px-5">
          {[["Nama toko", store.nama], ["WhatsApp", store.whatsapp], ["Jam buka", `${store.jamBuka}–${store.jamTutup}`], ["Status", store.buka ? "Buka" : "Tutup"]].map(([label, value]) => (
            <div key={label} className="grid gap-1 py-4 sm:grid-cols-[8rem_1fr]"><dt className="text-sm text-muted-foreground">{label}</dt><dd className="text-sm font-medium">{value}</dd></div>
          ))}
        </dl>
      )}
    </section>
  )
}
