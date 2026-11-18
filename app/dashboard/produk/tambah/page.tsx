'use client'
import { ArrowLeft, Info } from "lucide-react"
import Link from "next/link"

import { ProductForm } from "../_components/product-form"
import { ProductEditorPanel } from "../_components/product-editor-panel"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import type { ProductFormValues } from "../_lib/product.schema"
import axios from "axios"

type ApiResponse = {
  success: boolean;
  message: string;
};


export default function CreateProductPage() {
  async function handleCreate(values: ProductFormValues) {

    try {

      const formData = new FormData();
      formData.append("title", values.title);
      formData.append("price", String(values.price));
      formData.append(
        "description",
        values.description ?? ""
      );
      formData.append(
        "published",
        String(values.published)
      );

      if (!(values.image instanceof File)) {
        throw new Error("Gambar produk wajib dipilih");
      }

      formData.append("image", values.image);

      
      const result = await axios.post<ApiResponse>("/api/produk", formData)
      if (!result.data.success) {
        throw new Error(result.data.message)
      }

      return result.data

    } catch (error) {
      if (axios.isAxiosError<ApiResponse>(error)) {
        throw new Error(error.response?.data?.message)
      }
      throw error
    }

    
  }

  return (
    <ProductEditorPanel title="Tambah produk" description="Masukkan informasi produk yang ingin ditambahkan.">
      <Link href="/dashboard/produk" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground"><ArrowLeft className="size-4" aria-hidden="true" /> Kembali ke produk</Link>
      <Alert className="mb-5"><Info /><AlertTitle>Status produk</AlertTitle><AlertDescription>Produk disimpan sebagai draft kecuali Anda memilih untuk mempublikasikannya.</AlertDescription></Alert>
      <p className="mb-6 text-sm text-muted-foreground">Nama dan harga wajib diisi.</p>
      <ProductForm onSubmit={handleCreate} mode="create" />
    </ProductEditorPanel>
  )
}
