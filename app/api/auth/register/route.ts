
import { prisma } from "@/lib/prisma";
import { registerSchema } from "@/lib/schemas/auth.schema";
import {
    EmailAlreadyError,
    UserService,
} from "@/lib/server/auth.service";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const userService = new UserService(prisma);

export async function POST(req: Request) {
    const body: unknown = await req.json().catch(() => null);

    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json(
            {
                success: false,
                message: "Validasi gagal",
                errors: validation.error.flatten().fieldErrors,
            },
            { status: 400 },
        );
    }

    try {
        const res = await userService.register(
            validation.data,
        );

        return NextResponse.json(res, {
            status: 201,
        });

    } catch (error: unknown) {
        if (error instanceof EmailAlreadyError) {
            return NextResponse.json(
                {
                    success: false,
                    message: error.message,
                },
                { status: 409 },
            );
        }

        // Log error asli di terminal Next.js
        console.error("REGISTER ERROR:", error);

        // Fallback untuk semua error lainnya
        return NextResponse.json(
            {
                success: false,
                message: "Registrasi gagal, silakan coba lagi",
            },
            { status: 500 },
        );
    }
}
