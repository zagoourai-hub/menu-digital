"use client"

import { CircleUserRound, Leaf, PanelLeftClose, PanelLeftOpen } from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { cn } from "@/lib/utils"
import { DashboardNavigation } from "../navigation"

export function DashboardSidebar() {
  const [isOpen, setIsOpen] = useState(true)

  return (
    <aside className={cn("sticky top-4 hidden h-[calc(100dvh-2rem)] min-h-[600px] shrink-0 flex-col border-r border-sidebar-border bg-sidebar px-4 py-8 text-sidebar-foreground motion-safe:transition-[width] lg:flex", isOpen ? "w-56" : "w-20")}>
      <div className={cn("flex items-center", isOpen ? "justify-between gap-1" : "flex-col gap-4")}>
        <Link href="/" aria-label="EsTeh, ke beranda" className="rounded-sm font-heading text-3xl font-black tracking-tighter focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          {isOpen ? <>es.teh<span className="text-sidebar-primary">.</span></> : <Leaf className="size-6 text-sidebar-primary" aria-hidden="true" />}
        </Link>
        <button type="button" aria-label={isOpen ? "Tutup sidebar" : "Buka sidebar"} aria-expanded={isOpen} aria-controls="dashboard-desktop-navigation" title={isOpen ? "Tutup sidebar" : "Buka sidebar"} onClick={() => setIsOpen(!isOpen)} className="flex size-10 shrink-0 items-center justify-center rounded-xl text-muted-foreground hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">
          {isOpen ? <PanelLeftClose className="size-5" aria-hidden="true" /> : <PanelLeftOpen className="size-5" aria-hidden="true" />}
        </button>
      </div>
      {isOpen && <p className="mt-1 text-xs text-muted-foreground">Digital menu workspace</p>}
      <div className="mt-12"><DashboardNavigation collapsed={!isOpen} /></div>
      <Link href="/dashboard/akun" title={!isOpen ? "Akun Anda" : undefined} className={cn("mt-auto flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary", !isOpen && "justify-center px-0")}><CircleUserRound className="size-5 shrink-0" aria-hidden="true" /><span className={!isOpen ? "sr-only" : undefined}>Akun Anda</span></Link>
    </aside>
  )
}
