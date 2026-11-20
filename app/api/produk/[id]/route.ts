
import { NextResponse } from "next/server";

import { prisma } from "@/lib/prisma";
import { updateProdukSchema } from "@/lib/schemas/produk.schema";
import { ProdukServices } from "@/lib/server/produk.service";
import { getCurrentActor } from "@/lib/server/authorize";
import { ImageStorageService } from "@/lib/server/image.service";

export const runtime = "nodejs";

const produkService = new ProdukServices(prisma, new ImageStorageService());

type Context = {
    params: Promise<{ id: string }>;
};

// PATCH /api/produk/:id
export async function PATCH(
    request: Request,
    { params }: Context,
) {
    try {
        const actor = await getCurrentActor();

        if (!actor) {
            return NextResponse.json(
                { success: false, message: "Belum login" },
                { status: 401 },
            );
        }
        if (actor.role !== "ADMIN") {
            return NextResponse.json({ success: false, message: "Hanya admin yang dapat mengubah produk." }, { status: 403 });
        }

        const { id } = await params;
        const body: unknown = await request
            .json()
            .catch(() => null);

        const validation = updateProdukSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { success: false, message: "Validasi gagal" },
                { status: 400 },
            );
        }

        const updated = await produkService.update(
            actor,
            id,
            validation.data,
        );

        if (!updated) {
            return NextResponse.json(
                { success: false, message: "Produk tidak ditemukan" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            message: "Produk berhasil diperbarui",
        });
    } catch (error) {
        console.error("UPDATE PRODUK ERROR:", error);

        return NextResponse.json(
            { success: false, message: "Gagal mengubah produk" },
            { status: 500 },
        );
    }
}

// DELETE /api/produk/:id
export async function DELETE(
    _request: Request,
    { params }: Context,
) {
    try {
        const actor = await getCurrentActor();

        if (!actor) {
            return NextResponse.json(
                { success: false, message: "Belum login" },
                { status: 401 },
            );
        }
        if (actor.role !== "ADMIN") {
            return NextResponse.json({ success: false, message: "Hanya admin yang dapat menghapus produk." }, { status: 403 });
        }

        const { id } = await params;

        const deleted = await produkService.delete(
            actor,
            id,
        );

        if (!deleted) {
            return NextResponse.json(
                { success: false, message: "Produk tidak ditemukan" },
                { status: 404 },
            );
        }

        return NextResponse.json({
            success: true,
            message: "Produk berhasil dihapus",
        });
    } catch (error) {
        console.error("DELETE PRODUK ERROR:", error);

        return NextResponse.json(
            { success: false, message: "Gagal menghapus produk" },
            { status: 500 },
        );
    }
}
