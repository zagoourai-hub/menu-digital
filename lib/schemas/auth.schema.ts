
import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().trim().min(2, {
        error: "Nama minimal 2 karakter",
    }),

    email: z.email({
        error: "Format email tidak valid",
    }),

    password: z.string().min(8, {
        error: "Password minimal 8 karakter",
    }),
});

export type RegisterInput = z.infer<
    typeof registerSchema
>;
