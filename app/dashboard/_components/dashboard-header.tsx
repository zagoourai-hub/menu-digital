import { LogOut } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { signOut } from "@/lib/auth"

export function DashboardHeader({ name, email }: { name: string; email?: string | null }) {
  return (
    <header className="mb-4 flex items-center justify-between gap-3 px-1">
      <div className="flex min-w-0 items-center gap-3">
        <div><Link href="/" className="font-heading text-lg font-black tracking-tighter lg:hidden">es.teh</Link><p className="hidden text-xs text-muted-foreground lg:block">Selamat datang kembali,</p><p className="text-base font-bold sm:text-xl">{name}</p><p className="hidden text-xs text-muted-foreground sm:mt-1 sm:block">Kelola menu digital EsTeh di satu tempat.</p></div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="hidden min-w-0 text-right sm:block"><p className="max-w-40 truncate text-sm font-semibold">{name}</p><p className="max-w-40 truncate text-xs text-muted-foreground">{email || "Akun EsTeh"}</p></div>
        <a href="/dashboard#akun" aria-label="Lihat akun" className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">{name.trim().charAt(0).toUpperCase()}</a>
        <form action={async () => { "use server"; await signOut({ redirectTo: "/login" }) }}><Button type="submit" variant="outline" size="sm"><LogOut data-icon="inline-start" aria-hidden="true" /><span className="hidden sm:inline">Keluar</span><span className="sr-only sm:hidden">Keluar</span></Button></form>
      </div>
    </header>
  )
}
