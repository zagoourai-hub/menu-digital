"use client"

import { useActionState, useState } from "react"
import { Button } from "@/components/ui/button"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { ProfileAvatar } from "../_components/profile-avatar"
import { updateAccountProfile } from "./actions"

export function AccountNameForm({ initialName, image }: { initialName: string; image: string | null }) {
  const [name, setName] = useState(initialName)
  const [result, action, pending] = useActionState(updateAccountProfile, { success: false, message: "" })

  return (
    <form action={action} className="mt-6 rounded-2xl p-10 border border-border bg-card ">
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="account-photo" className="flex justify-center py-2">Foto profil</FieldLabel>
          <div className="flex flex-col  items-center justify-center">
            <div className="flex size-24 shrink-0 mb-5 w-40 h-40 items-center justify-center overflow-hidden rounded-full bg-primary text-3xl font-bold text-primary-foreground ring-1 ring-border ring-offset-2 ring-offset-card">
              <ProfileAvatar name={initialName} image={image} size={96} />
            </div>
          </div>
          <Input id="account-photo" name="photo" type="file" accept="image/jpeg,image/png,image/webp" aria-describedby="account-photo-hint" disabled={pending} onChange={({ currentTarget }) => {
            currentTarget.setCustomValidity((currentTarget.files?.[0]?.size ?? 0) > 900_000 ? "Ukuran foto maksimal 900 KB." : "")
          }} />
          <p id="account-photo-hint" className="text-sm text-muted-foreground">JPG, PNG, atau WebP. Maksimal 900 KB.</p>
        </Field>
        <Field>
          <FieldLabel htmlFor="account-name">Nama pengguna</FieldLabel>
          <Input id="account-name" name="name" autoComplete="name" required maxLength={100} value={name} onChange={(event) => setName(event.target.value)} disabled={pending} />
        </Field>
        <div className="flex flex-wrap items-center gap-3">
          <Button type="submit" disabled={pending || !name.trim()}>
            {pending ? "Menyimpan..." : "Simpan profil"}
          </Button>
          {result.message && (result.success
            ? <p role="status" className="text-sm text-muted-foreground">{result.message}</p>
            : <p role="alert" className="text-sm text-destructive">{result.message}</p>)}
        </div>
      </FieldGroup>
    </form>
  )
}
