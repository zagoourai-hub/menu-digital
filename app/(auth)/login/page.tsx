import Link from "next/link"

import { LoginForm } from "@/components/login.form"

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-9">
      <div className="flex flex-col gap-3">
        <h1 id="login-heading" className="font-heading text-4xl font-bold tracking-tight sm:text-5xl">Selamat datang kembali</h1>
        <p className="text-base leading-relaxed text-muted-foreground">Masuk dengan akun EsTeh kamu.</p>
      </div>
      <LoginForm />
      <p className="text-sm text-muted-foreground">
        Belum punya akun? <Link href="/register" className="font-semibold text-foreground underline decoration-primary underline-offset-4">Daftar</Link>
      </p>
    </div>
  )
}
