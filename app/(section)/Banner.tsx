import Image from "next/image"
import { ArrowRight } from "lucide-react"

import { buttonVariants } from "@/components/ui/button"

export function Banner() {
  return (
    <section aria-labelledby="banner-heading" className="px-5 pb-14 md:px-10 md:pb-20">
      <div className="relative mx-auto flex min-h-80 max-w-6xl items-center overflow-hidden rounded-3xl bg-background md:min-h-72">
        <div className="absolute inset-0 md:left-[38%]">
          <Image src="/assets/hero.png" alt="" fill sizes="(min-width: 768px) 62vw, 100vw" className="object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/30 md:from-background md:via-background/50 md:to-transparent" />
        </div>
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-gradient-to-r from-primary/15 via-primary/10 to-transparent" />
        <div className="relative flex max-w-xl flex-col items-start justify-center gap-4 p-7 sm:p-10 lg:p-12">
          <h2 id="banner-heading" className="font-heading text-3xl font-bold leading-[1.08] tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            Lebih seru,<br />kalau bareng-bareng.
          </h2>
          <p className="text-sm text-foreground sm:text-base">Pilih rasa favorit untuk teman dan keluarga.</p>
          <a href="#menu" className={buttonVariants({ size: "lg" })}>
            Lihat Menu <ArrowRight data-icon="inline-end" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  )
}
