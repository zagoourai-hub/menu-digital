"use client"

import { useActionState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { saveToko } from "./actions"

type Store = { nama: string; whatsapp: string; jamBuka: string; jamTutup: string; buka: boolean }

export function StoreForm({ store }: { store: Store }) {
  const [result, action, pending] = useActionState(saveToko, { message: "", success: false })
  return (
    <form action={action} className="mt-6 rounded-2xl border bg-card p-5 sm:p-7">
      <FieldGroup>
        <Field><FieldLabel htmlFor="nama">Nama toko</FieldLabel><Input id="nama" name="nama" defaultValue={store.nama} maxLength={100} required /></Field>
        <Field><FieldLabel htmlFor="whatsapp">Nomor WhatsApp</FieldLabel><Input id="whatsapp" name="whatsapp" defaultValue={store.whatsapp} inputMode="numeric" pattern="62[0-9]{8,13}" required /><p className="text-xs text-muted-foreground">Gunakan format internasional tanpa tanda +, misalnya 6281234567890.</p></Field>
        <div className="grid gap-5 sm:grid-cols-2">
          <Field><FieldLabel htmlFor="jamBuka">Jam buka</FieldLabel><Input id="jamBuka" name="jamBuka" type="time" defaultValue={store.jamBuka} required /></Field>
          <Field><FieldLabel htmlFor="jamTutup">Jam tutup</FieldLabel><Input id="jamTutup" name="jamTutup" type="time" defaultValue={store.jamTutup} required /></Field>
        </div>
        <Field orientation="horizontal"><input id="buka" name="buka" type="checkbox" defaultChecked={store.buka} className="size-4 accent-primary" /><FieldLabel htmlFor="buka">Toko menerima pesanan</FieldLabel></Field>
        <p className="text-xs text-muted-foreground">Jam toko hanya informasi; status buka atau tutup diatur secara manual.</p>
        <Button type="submit" disabled={pending}>{pending ? "Menyimpan..." : "Simpan pengaturan"}</Button>
        {result.message && <p role={result.success ? "status" : "alert"} className={result.success ? "text-sm text-muted-foreground" : "text-sm text-destructive"}>{result.message}</p>}
      </FieldGroup>
    </form>
  )
}
