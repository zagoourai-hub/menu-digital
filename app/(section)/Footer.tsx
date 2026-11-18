import { Leaf } from "lucide-react"

const navigation = [
  { label: "Beranda", href: "#beranda" },
  { label: "Menu", href: "#menu" },
  { label: "Tentang Kami", href: "#tentang-kami" },
  { label: "Kontak", href: "#kontak" },
]

export function Footer() {
  return (
    <footer className="bg-primary/15 px-5 text-foreground md:px-10">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 py-10 sm:grid-cols-[1fr_auto] sm:items-start sm:gap-16 md:py-14">
          <div className="max-w-sm">
            <a href="#beranda" aria-label="Es Teh, kembali ke beranda" className="inline-flex items-start gap-1 rounded-sm font-heading text-3xl font-bold tracking-tight text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring dark:text-primary sm:text-4xl">
              Es Teh.<Leaf aria-hidden="true" className="size-5 sm:size-6" />
            </a>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">Segar di setiap cerita.</p>
          </div>
          <nav aria-label="Navigasi footer" className="sm:min-w-44 sm:border-l sm:border-foreground/15 sm:pl-10">
            <h2 className="text-sm font-bold tracking-wide">Jelajahi</h2>
            <ul className="mt-4 flex flex-col items-start gap-2.5 text-sm text-muted-foreground">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className="transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring">{item.label}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
        <div className="border-t border-foreground/15 py-5 text-center text-xs text-muted-foreground">
          Es Teh. — Segar setiap hari.
        </div>
      </div>
    </footer>
  )
}
