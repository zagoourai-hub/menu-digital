"use client"

import { CircleUserRound, ClipboardList, LayoutDashboard, ShoppingBag, Store } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"

import { cn } from "@/lib/utils"

const navigation = [
  { label: "Ringkasan", href: "/dashboard", icon: LayoutDashboard },
  { label: "Katalog", href: "/dashboard/katalog", icon: ClipboardList },
  { label: "Akun", href: "/dashboard/akun", icon: CircleUserRound },
  { label: "Pesanan", href: "/dashboard/pesanan", icon: ShoppingBag },
  { label: "Toko", href: "/dashboard/toko", icon: Store },
]

function useActiveDashboardLink() {
  const pathname = usePathname()
  return (href: string) => pathname === href ||
    (href !== "/dashboard" && pathname.startsWith(`${href}/`)) ||
    (href === "/dashboard/katalog" && (pathname === "/dashboard/produk" || pathname.startsWith("/dashboard/produk/")))
}

export function DashboardNavigation({ collapsed = false }: { collapsed?: boolean }) {
  const isActive = useActiveDashboardLink()

  return (
    <nav id="dashboard-desktop-navigation" aria-label="Navigasi dashboard" className="flex flex-col gap-2">
      {navigation.map(({ label, href, icon: Icon }) => (
        <Link key={href} href={href} title={collapsed ? label : undefined} aria-current={isActive(href) ? "page" : undefined} className={cn("flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", collapsed && "justify-center px-0", isActive(href) ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")}>
          <Icon className="size-5 shrink-0" aria-hidden="true" />
          <span className={collapsed ? "sr-only" : undefined}>{label}</span>
        </Link>
      ))}
    </nav>
  )
}

export function MobileDashboardNavigation() {
  const isActive = useActiveDashboardLink()

  return (
    <nav aria-label="Navigasi dashboard mobile" className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background px-2 pb-[env(safe-area-inset-bottom)] lg:hidden">
      <div className="mx-auto grid max-w-md grid-cols-5 gap-1 py-1">
        {navigation.map(({ label, href, icon: Icon }) => (
          <Link key={href} href={href} aria-current={isActive(href) ? "page" : undefined} className={cn("flex min-h-14 min-w-0 flex-col items-center justify-center gap-1 rounded-xl px-1 text-[11px] font-medium focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring", isActive(href) ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")}>
            <Icon className="size-5" aria-hidden="true" />
            {label}
          </Link>
        ))}
      </div>
    </nav>
  )
}
