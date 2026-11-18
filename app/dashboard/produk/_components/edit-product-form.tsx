"use client"

import axios from "axios"
import { useEffect, useState } from "react"
import { z } from "zod"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { ProductFormValues } from "../_lib/product.schema"
import { ProductForm } from "./product-form"

const responseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
  produk: z.array(z.object({
    id: z.string(),
    title: z.string(),
    price: z.number().int(),
    description: z.string().nullable(),
    published: z.boolean(),
    imageUrl: z.string().nullable(),
  })),
})

type Product = z.infer<typeof responseSchema>["produk"][number]
type ApiResponse = { success: boolean; message: string }

export function EditProductForm({ id }: { id: string }) {
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const controller = new AbortController()

    async function fetchProduct() {
      try {
        const response = await axios.get<unknown>("/api/produk", { signal: controller.signal })
        const result = responseSchema.safeParse(response.data)
        if (!result.success || !result.data.success) throw new Error("Respons produk tidak valid.")

        const found = result.data.produk.find((item) => item.id === id)
        if (!found) {
          setError("Produk tidak ditemukan atau tidak dapat diakses.")
          return
        }
        setProduct(found)
      } catch (error) {
        if (axios.isCancel(error)) return
        setError("Gagal mengambil data produk. Silakan coba lagi.")
      } finally {
        if (!controller.signal.aborted) setLoading(false)
      }
    }

    void fetchProduct()
    return () => controller.abort()
  }, [id])

  async function updateProduct(values: ProductFormValues): Promise<ApiResponse> {
    try {
      const response = await axios.patch<ApiResponse>(`/api/produk/${encodeURIComponent(id)}`, values)
      if (!response.data.success) throw new Error(response.data.message)
      return response.data
    } catch (error) {
      if (axios.isAxiosError<ApiResponse>(error)) {
        throw new Error(error.response?.data?.message ?? "Produk gagal diperbarui.")
      }
      throw error
    }
  }

  if (loading) return <p role="status" className="text-sm text-muted-foreground">Memuat data produk...</p>
  if (error) return <Alert variant="destructive"><AlertTitle>Data tidak tersedia</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
  if (!product) return null

  return (
    <ProductForm
      mode="edit"
      initialValues={{ title: product.title, price: String(product.price), description: product.description ?? "", published: product.published }}
      onSubmit={updateProduct}
    />
  )
}
