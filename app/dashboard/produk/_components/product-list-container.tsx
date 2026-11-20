"use client"

import axios from "axios"
import { useEffect, useState } from "react"

import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { ProductList } from "./product-list"
import type { Product } from "../_lib/product.schema"

type ProdukResponse = {
  success: boolean
  message: string
  produk: Product[]
}

export function ProductListContainer({ canManage }: { canManage: boolean }) {
  const [products, setProducts] = useState<Product[]>()
  const [error, setError] = useState("")

  useEffect(() => {
    const controller = new AbortController()

    async function fetchProducts() {
      try {
        const response = await axios.get<ProdukResponse>("/api/produk", { signal: controller.signal })
        if (!response.data.success) throw new Error(response.data.message)
        setProducts(response.data.produk)
      } catch (cause) {
        if (controller.signal.aborted) return
        setError(axios.isAxiosError<ProdukResponse>(cause)
          ? cause.response?.data?.message ?? "Gagal memuat produk."
          : cause instanceof Error ? cause.message : "Gagal memuat produk.")
      }
    }

    void fetchProducts()
    return () => controller.abort()
  }, [])

  if (error) {
    return <Alert variant="destructive"><AlertTitle>Produk gagal dimuat</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
  }

  if (!products) return <p role="status" className="text-sm text-muted-foreground">Memuat daftar produk...</p>
  async function deleteProduct(id: string) {
    const response = await axios.delete<{ success: boolean; message: string }>(`/api/produk/${encodeURIComponent(id)}`)
    if (!response.data.success) throw new Error(response.data.message)
    setProducts((current) => current?.filter((product) => product.id !== id))
  }

  return <ProductList products={products} canManage={canManage} onDelete={canManage ? deleteProduct : undefined} />
}
