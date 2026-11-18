
import { z } from "zod";

export const createProdukSchema = z.object({
    title: z.string().trim().min(3, {
        message: "Nama produk minimal 3 karakter",
    }),

    description: z.string().optional(),

    price: z.number().int().min(0, {
        message: "Harga tidak boleh negatif",
    }),

    published: z.boolean().optional(),
    image: z
        .instanceof(File, { error: "Gambar wajib diupload" })
        .refine(
            (file) => file.size > 0 && file.size <= 5 * 1024 * 1024,
            "Ukuran gambar maksimal 5MB",
        )
        .refine(
            (file) =>
                ["image/jpeg", "image/png", "image/webp"].includes(
                    file.type,
                ),
            "Format gambar harus JPG, PNG, atau WebP",
        ),
});

export const updateProdukSchema =
    createProdukSchema
        .extend({
            published: z.boolean(),
        })
        .partial()
        .refine(
            (data) => Object.keys(data).length > 0,
            { message: "Tidak ada data yang diubah" },
        );

export type CreateProdukInput = z.infer<
    typeof createProdukSchema
>;

export type Produk = z.infer<typeof createProdukSchema>

export type UpdateProdukInput = z.infer<
    typeof updateProdukSchema
>;
