"use client"

import { Dialog as DialogPrimitive } from "@base-ui/react/dialog"
import { X } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState, type ReactNode } from "react"

import { Button } from "@/components/ui/button"
import { Drawer, DrawerContent, DrawerDescription, DrawerHeader, DrawerTitle } from "@/components/ui/drawer"

type ProductEditorPanelProps = {
  title: string
  description: string
  children: ReactNode
}

export function ProductEditorPanel({ title, description, children }: ProductEditorPanelProps) {
  const router = useRouter()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const media = window.matchMedia("(min-width: 768px)")
    const update = () => setIsDesktop(media.matches)
    update()
    media.addEventListener("change", update)
    return () => media.removeEventListener("change", update)
  }, [])

  function close() {
    router.push("/dashboard/produk")
  }

  if (isDesktop) {
    return (
      <DialogPrimitive.Root open onOpenChange={(open) => { if (!open) close() }}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Backdrop className="fixed inset-0 z-40 bg-foreground/20 backdrop-blur-sm" />
          <DialogPrimitive.Popup className="fixed top-1/2 left-1/2 z-50 max-h-[90dvh] w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-2xl border border-border bg-background shadow-xl outline-none">
            <header className="relative border-b border-border px-6 pt-6 pb-5 sm:px-8">
              <DialogPrimitive.Title className="pr-10 font-heading text-2xl font-bold">{title}</DialogPrimitive.Title>
              <DialogPrimitive.Description className="mt-2 text-sm text-muted-foreground">{description}</DialogPrimitive.Description>
              <DialogPrimitive.Close render={<Button variant="ghost" size="icon" aria-label="Tutup" className="absolute top-4 right-4" />}>
                <X aria-hidden="true" />
              </DialogPrimitive.Close>
            </header>
            <div className="p-6 sm:p-8">{children}</div>
          </DialogPrimitive.Popup>
        </DialogPrimitive.Portal>
      </DialogPrimitive.Root>
    )
  }

  return (
    <Drawer open onOpenChange={(open) => { if (!open) close() }}>
      <DrawerContent className="max-h-[92dvh]">
        <DrawerHeader className="text-left">
          <DrawerTitle>{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        <div className="overflow-y-auto p-4">{children}</div>
      </DrawerContent>
    </Drawer>
  )
}
