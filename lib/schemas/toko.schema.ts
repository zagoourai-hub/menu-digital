import { z } from "zod"
import { MAX_DELIVERY_KM } from "@/lib/ongkir"

export const tokoSchema = z.object({
  nama: z.string().trim().min(1).max(100),
  whatsapp: z.string().regex(/^62[0-9]{8,13}$/, "Gunakan format internasional, contoh 6281234567890."),
  jamBuka: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  jamTutup: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/),
  buka: z.boolean(),
})

export const customerSchema = z.discriminatedUnion("fulfillment", [
  z.object({
    fulfillment: z.literal("PICKUP"),
    customerName: z.string().trim().min(1).max(100),
    customerPhone: z.string().trim().regex(/^\+?[0-9]{9,16}$/),
  }),
  z.object({
    fulfillment: z.literal("DELIVERY"),
    customerName: z.string().trim().min(1).max(100),
    customerPhone: z.string().trim().regex(/^\+?[0-9]{9,16}$/),
    deliveryAddress: z.string().trim().min(5).max(500),
    distanceKm: z.number().finite().positive().max(MAX_DELIVERY_KM),
  }),
])
