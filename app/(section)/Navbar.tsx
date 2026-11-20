"use client"

import { useEffect, useRef, type MouseEvent } from "react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import { ScrollToPlugin } from "gsap/ScrollToPlugin"
import { ArrowRight, Home, Leaf, List, ShoppingBag, Users } from "lucide-react"
import { useTheme } from "next-themes"

import { buttonVariants } from "@/components/ui/button"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { cn } from "@/lib/utils"

const links = [
  { label: "Beranda", href: "#beranda", icon: Home },
  { label: "Menu", href: "#menu", icon: List },
  { label: "Tentang Kami", href: "#tentang-kami", icon: Users },
]

export function Navbar({ storeName = "Es Teh" }: { storeName?: string }) {
  const headerRef = useRef<HTMLElement>(null)
  const { resolvedTheme, setTheme } = useTheme()

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin)
    const media = gsap.matchMedia()

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const header = headerRef.current
      if (!header) return

      gsap.from(header, { yPercent: -100, duration: 0.6, ease: "power2.out" })
      gsap.to(header, {
        boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
        duration: 0.25,
        scrollTrigger: {
          start: 40,
          toggleActions: "play none none reverse",
        },
      })
    })

    return () => {
      media.revert()
      gsap.killTweensOf(window)
    }
  }, [])

  function scrollToSection(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return
    const hash = event.currentTarget.hash
    const target = document.getElementById(hash.slice(1))
    if (!target) return

    event.preventDefault()
    window.history.pushState(null, "", hash)
    gsap.to(window, {
      duration: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 0.9,
      ease: "power2.inOut",
      overwrite: "auto",
      scrollTo: { y: target, offsetY: headerRef.current?.offsetHeight ?? 0, autoKill: true },
    })
  }

  return (
    <>
      <header ref={headerRef} className="sticky top-0 z-40 border-b border-border bg-background px-4 md:px-10">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-2 md:h-18 md:gap-6">
          <a href="#beranda" onClick={scrollToSection} aria-label={`${storeName}, kembali ke beranda`} className="inline-flex shrink-0 items-start gap-0.5 whitespace-nowrap rounded-sm font-heading text-2xl font-bold tracking-tight text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring dark:text-primary md:gap-1 md:text-3xl">
            <span className="max-w-32 truncate sm:max-w-48">{storeName}.</span><Leaf aria-hidden="true" className="size-4 md:size-5" />
          </a>
          <nav aria-label="Navigasi utama" className="hidden items-center gap-8 md:flex">
            {links.map(({ href, label }) => (
              <a key={href} href={href} onClick={scrollToSection} className="rounded-sm text-sm font-medium text-foreground transition-colors hover:text-primary-foreground focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-ring dark:hover:text-primary">{label}</a>
            ))}
          </nav>
          <div className="flex shrink-0 items-center gap-1 md:gap-2">
            <a href="/pesanan" aria-label="Riwayat pesanan" className="inline-flex size-10 items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring md:h-10 md:w-auto md:px-2">
              <ShoppingBag aria-hidden="true" className="size-5 md:hidden" />
              <span className="hidden text-sm font-medium md:inline">Pesanan</span>
            </a>
            <AnimatedThemeToggler theme={resolvedTheme === "dark" ? "dark" : "light"} onThemeChange={setTheme} aria-label="Ganti tema" className="flex size-10 shrink-0 items-center justify-center rounded-full text-foreground transition-colors hover:bg-muted focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring [&_svg]:size-5" />
            <a href="#menu" onClick={scrollToSection} className={cn(buttonVariants({ size: "lg" }), "px-3 md:px-4")}>
              <span className="md:hidden">Menu</span><span className="hidden md:inline">Lihat Menu</span> <ArrowRight aria-hidden="true" data-icon="inline-end" />
            </a>
          </div>
        </div>
      </header>
      <nav aria-label="Navigasi mobile" className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 px-4 pb-[env(safe-area-inset-bottom)] backdrop-blur md:hidden">
        <div className="mx-auto grid max-w-md grid-cols-3">
          {links.map(({ href, label, icon: Icon }) => (
            <a key={href} href={href} onClick={scrollToSection} className="flex min-h-16 flex-col items-center justify-center gap-1 rounded-sm text-xs font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-ring">
              <Icon aria-hidden="true" className="size-5" />
              {label}
            </a>
          ))}
        </div>
      </nav>
    </>
  )
}
