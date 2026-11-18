"use client"

import { Toast } from "@base-ui/react/toast"
import { CheckCircle2, CircleAlert, LoaderCircle } from "lucide-react"

import { ToastClose, ToastContent, ToastDescription, ToastTitle } from "@/components/ui/toast"

export const loginToast = Toast.createToastManager()

export function LoginToaster() {
  return (
    <Toast.Provider toastManager={loginToast}>
      <Toast.Portal>
        <Toast.Viewport>
          <LoginToastList />
        </Toast.Viewport>
      </Toast.Portal>
    </Toast.Provider>
  )
}

function LoginToastList() {
  const { toasts } = Toast.useToastManager()

  return toasts.map((item) => (
    <Toast.Positioner key={item.id} toast={item} className="z-50">
      <Toast.Root toast={item} className="w-80 max-w-[calc(100vw-2rem)] rounded-2xl border bg-popover text-popover-foreground shadow-lg outline-none">
        <ToastContent>
          {item.type === "loading" && <LoaderCircle className="size-4 shrink-0 animate-spin motion-reduce:animate-none" aria-hidden="true" />}
          {item.type === "success" && <CheckCircle2 className="size-4 shrink-0" aria-hidden="true" />}
          {item.type === "error" && <CircleAlert className="size-4 shrink-0 text-destructive" aria-hidden="true" />}
          <div className="flex min-w-0 flex-1 flex-col gap-1">
            <ToastTitle />
            <ToastDescription />
          </div>
          <ToastClose aria-label="Tutup notifikasi" />
        </ToastContent>
      </Toast.Root>
    </Toast.Positioner>
  ))
}
