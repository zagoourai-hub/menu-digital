"use client"

import { catchError, type ErrorInfo } from "next/error"
import { CircleAlert } from "lucide-react"

import { Button } from "@/components/ui/button"

type ErrorFallbackProps = {
  title: string
  description?: string
}

export function ErrorFallbackView({ title, description, retry }: ErrorFallbackProps & { retry: () => void }) {
  return (
    <div role="alert" className="mx-auto w-full max-w-xl rounded-2xl border border-border bg-card p-6 text-card-foreground sm:p-8">
      <CircleAlert aria-hidden="true" className="size-5 text-destructive" />
      <h2 className="mt-4 font-heading text-xl font-bold">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description ?? "Terjadi kendala. Silakan coba lagi."}
      </p>
      <Button type="button" className="mt-5" onClick={retry}>Coba lagi</Button>
    </div>
  )
}

function ErrorFallback(props: ErrorFallbackProps, { retry }: ErrorInfo) {
  return <ErrorFallbackView {...props} retry={retry} />
}

export const ErrorBoundary = catchError(ErrorFallback)
