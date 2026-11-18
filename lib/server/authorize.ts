
import "server-only";

import { prisma } from "@/lib/prisma";
import type { Role } from "@/generated/prisma/client";
import { auth } from "../auth";

export type Actor = {
    id: string;
    role: Role;
};

export async function getCurrentActor(): Promise<Actor | null> {
    // 1. Baca session dari Auth.js
    const session = await auth();

    // 2. Pastikan pengguna sudah login
    if (!session?.user?.id) {
        return null;
    }

    // 3. Ambil ID dan role terbaru dari database
    return prisma.user.findUnique({
        where: {
            id: session.user.id,
        },
        select: {
            id: true,
            role: true,
        },
    });
}
