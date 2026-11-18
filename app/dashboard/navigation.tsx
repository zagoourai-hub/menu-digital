"use client"

import { CircleUserRound, ClipboardList, LayoutDashboard, ShoppingBag } from "lucide-react"
import { useSyncExternalStore } from "react"

import { Dock, DockIcon } from "@/components/ui/dock"
import { cn } from "@/lib/utils"

const navigation = [
  { label: "Ringkasan", href: "#ringkasan", icon: LayoutDashboard },
  { label: "Katalog", href: "#katalog", icon: ClipboardList },
  { label: "Akun", href: "#akun", icon: CircleUserRound },
]

function subscribe(callback: () => void) {
  window.addEventListener("hashchange", callback)
  return () => window.removeEventListener("hashchange", callback)
}

export function DashboardNavigation({ collapsed = false }: { collapsed?: boolean }) {
  const active = useSyncExternalStore(subscribe, () => window.location.hash || "#ringkasan", () => "#ringkasan")

  return (
    <nav id="dashboard-desktop-navigation" aria-label="Navigasi dashboard" className="flex flex-col gap-2">
      {navigation.map(({ label, href, icon: Icon }) => (
        <a key={href} href={`/dashboard${href}`} title={collapsed ? label : undefined} aria-current={active === href ? "location" : undefined} className={cn("flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", collapsed && "justify-center px-0", active === href ? "bg-primary/20 text-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground")}>
          <Icon className="size-5 shrink-0" aria-hidden="true" />
          <span className={collapsed ? "sr-only" : undefined}>{label}</span>
        </a>
      ))}
      <a href="/dashboard/pesanan" title="Pesanan" className={cn("flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground", collapsed && "justify-center px-0")}>
        <ShoppingBag className="size-5 shrink-0" aria-hidden="true" /><span className={collapsed ? "sr-only" : undefined}>Pesanan</span>
      </a>
    </nav>
  )
}

export function MobileDashboardNavigation() {
  const active = useSyncExternalStore(subscribe, () => window.location.hash || "#ringkasan", () => "#ringkasan")

  return (
    <nav aria-label="Navigasi dashboard mobile" className="pointer-events-none fixed inset-x-0 bottom-[max(1rem,env(safe-area-inset-bottom))] z-40 lg:hidden">
      <Dock iconSize={48} disableMagnification className="pointer-events-auto mt-0 h-auto gap-3 rounded-full border-border bg-card p-2 shadow-lg shadow-foreground/10">
        {navigation.map(({ label, href, icon: Icon }) => (
          <DockIcon key={href} className="hover:bg-transparent">
            <a href={`/dashboard${href}`} aria-label={label} aria-current={active === href ? "location" : undefined} className={`flex size-12 items-center justify-center rounded-full focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring ${active === href ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"}`}>
              <Icon className="size-5" aria-hidden="true" />
            </a>
          </DockIcon>
        ))}
        <DockIcon className="hover:bg-transparent">
          <a href="/dashboard/pesanan" aria-label="Pesanan" className="flex size-12 items-center justify-center rounded-full text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-ring">
            <ShoppingBag className="size-5" aria-hidden="true" />
          </a>
        </DockIcon>
      </Dock>
    </nav>
  )
}
