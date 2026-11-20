
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { createProdukSchema } from "@/lib/schemas/produk.schema";
import { ProdukServices } from "@/lib/server/produk.service";
import { getCurrentActor } from "@/lib/server/authorize";
import { ImageStorageService } from "@/lib/server/image.service";

export const runtime = "nodejs";
const storage = new ImageStorageService();
const produkService = new ProdukServices(prisma, storage);

// GET /api/produk
export async function GET() {
    try {
        const actor = await getCurrentActor();

        if (!actor) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Silakan login terlebih dahulu",
                },
                { status: 401 },
            );
        }   

        const produk = await produkService.findAll();

        return NextResponse.json({
            success: true,
            message: "Daftar produk berhasil diambil",
            produk,
        });
    } catch (error) {
        console.error("GET PRODUK ERROR:", error);

        return NextResponse.json(
            { success: false, message: "Gagal mengambil produk" },
            { status: 500 },
        );
    }
}

// POST /api/produk
export async function POST(request: Request) {
    try {
        const actor = await getCurrentActor();

        if (!actor) {
            return NextResponse.json(
                { success: false, message: "Silakan login" },
                { status: 401 },
            );
        }

        if (actor.role !== "ADMIN") {
            return NextResponse.json({ success: false, message: "Hanya admin yang dapat menambah produk." }, { status: 403 });
        }

        const formData = await request.formData()


        const rawPrice = formData.get("price");

        const values = {
            title: formData.get("title"),
            description: formData.get("description") ?? undefined,
            price:
                typeof rawPrice === "string" &&
                    /^\d+$/.test(rawPrice)
                    ? Number(rawPrice)
                    : undefined,
            image: formData.get("image"),
        };

        const validation = createProdukSchema.safeParse(values);

        if (!validation.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Validasi produk gagal",
                    errors: validation.error.flatten().fieldErrors,
                },
                { status: 400 },
            );
        }

        const {image, ...produkData} = validation.data

        const produk = await produkService.create(
            actor,
            produkData,
            image
            

            
        );

        return NextResponse.json(
            {
                success: true,
                message: "Produk berhasil ditambahkan",
                produk,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error("CREATE PRODUK ERROR:", error);

        return NextResponse.json(
            { success: false, message: "Gagal menambahkan produk" },
            { status: 500 },
        );
    }
}
