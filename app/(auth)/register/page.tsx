import Link from "next/link"
import Image from "next/image"

import { RegisterForm } from "@/components/register-form"

export default function RegisterPage() {
  return (
    <div className="register-page flex flex-col gap-8 sm:gap-10">
      <div className="relative overflow-hidden rounded-2xl lg:hidden">
        <Image src="/assets/hero.png" alt="" width={768} height={300} sizes="(max-width: 640px) 90vw, 384px" className="h-36 w-full object-cover object-center sm:h-44" />
      </div>
      <div className="flex items-center justify-between gap-4">
        <div className="flex min-w-0 flex-col gap-3">
          <p className="register-welcome text-sm font-medium text-muted-foreground">Selamat datang di EsTeh</p>
          <h1 className="font-heading text-4xl leading-[1.05] font-bold tracking-tight sm:text-5xl">Buat akun<span className="register-dot" aria-hidden="true">.</span></h1>
          <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">Isi data di bawah untuk memulai.</p>
        </div>
      </div>
      <RegisterForm />
      <p className="text-sm leading-6 text-muted-foreground">
        Sudah punya akun? <Link href="/login" className="font-semibold text-foreground underline decoration-primary decoration-2 underline-offset-4 transition-colors hover:text-primary focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">Masuk</Link>
      </p>
    </div>
  )
}
