import Image from "next/image"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="auth-layout grid min-h-[100dvh] bg-background lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
      <section className="auth-content flex min-h-[100dvh] flex-col px-6 py-7 sm:px-12 lg:px-12 xl:px-20">
        <header className="flex items-center justify-between gap-6">
          <Link href="/" className="font-heading text-3xl font-black tracking-tighter" aria-label="EsTeh, ke beranda">es.teh</Link>
          <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
            <ArrowLeft className="size-4" aria-hidden="true" /> <span className="hidden sm:inline">Kembali ke beranda</span><span className="sm:hidden">Beranda</span>
          </Link>
        </header>
        <div className="auth-body mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-16">{children}</div>
        <footer className="text-sm text-muted-foreground">Dibuat untuk menemani harimu.</footer>
      </section>
      <aside className="auth-visual relative hidden min-h-[100dvh] overflow-hidden lg:block" aria-label="EsTeh pilihanmu">
        <Image src="/assets/hero.png" alt="Pilihan es teh original, lemon, dan matcha" fill priority sizes="55vw" className="object-cover" />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/35 to-transparent px-12 pt-32 pb-12 text-white xl:px-16">
          <p className="max-w-md font-heading text-4xl leading-tight font-bold tracking-tight xl:text-5xl">Segar yang selalu bisa kamu pilih.</p>
          <p className="mt-4 text-sm font-medium text-white/85">Original, lemon, atau matcha. Selalu ada favoritmu.</p>
        </div>
      </aside>
    </main>
  )
}
