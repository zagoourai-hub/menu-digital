import { z } from "zod"
import { createProdukSchema } from "@/lib/schemas/produk.schema"

export const productSchema = z.object({
  title: createProdukSchema.shape.title,
  price: z.string().trim().regex(/^\d+$/, "Harga harus berupa angka bulat dalam rupiah").transform(Number).pipe(createProdukSchema.shape.price),
  description: z.string().trim(),
  published: z.boolean(),
  image: z
    .file()
    .max(5 * 1024 * 1024, "Maksimal 5MB")
    .mime(
      ["image/jpeg", "image/png", "image/webp"],
      "Format gambar tidak didukung"
    )
    .optional(),
})

export type ProductFormInput = z.input<typeof productSchema>
export type ProductFormValues = z.output<typeof productSchema>

export type Product = { id: string; title: string; price: number; description: string | null; published: boolean; imageUrl: string | null }
