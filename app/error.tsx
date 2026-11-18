"use client"

import { ErrorFallbackView } from "@/components/error-fallback"

export default function PageError({ retry }: {
  retry: () => void
}) {
  return (
    <main className="flex min-h-[70vh] items-center px-5 py-12">
      <ErrorFallbackView title="Halaman belum dapat dimuat" description="Terjadi kendala saat memuat halaman. Silakan coba lagi." retry={retry} />
    </main>
  )
}
