import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import path from "path";
import sharp from "sharp";

export class ImageValidationError extends Error {
    constructor(message: string) {
        super(message)
        this.name = 'Image Validator Error'
    }
}


const UPLOAD_DIR = path.join(
    process.cwd(),
    "public",
    "uploads",
    "products",
);

const MAX_SIZE = 5 * 1024 * 1024;

export class ImageStorageService {
    async upload(file: File): Promise<string> {
        if (file.size === 0 || file.size > MAX_SIZE) {
            throw new ImageValidationError(
                "Ukuran gambar maksimal 5MB",
            );
        }

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp",
        ];

        if (!allowedTypes.includes(file.type)) {
            throw new ImageValidationError(
                "Format harus JPG, PNG, atau WebP",
            );
        }

        const buffer = Buffer.from(
            await file.arrayBuffer(),
        );

        let optimized: Buffer;

        try {
            const metadata = await sharp(buffer, {
                limitInputPixels: 20_000_000,
            }).metadata();

            if (
                !metadata.format ||
                !["jpeg", "png", "webp"].includes(metadata.format)
            ) {
                throw new Error("Unsupported format");
            }

            optimized = await sharp(buffer, {
                limitInputPixels: 20_000_000,
            })
                .rotate()
                .resize(1200, 1200, {
                    fit: "inside",
                    withoutEnlargement: true,
                })
                .webp({ quality: 80 })
                .toBuffer();
        } catch {
            throw new ImageValidationError(
                "File gambar tidak valid",
            );
        }

        await mkdir(UPLOAD_DIR, { recursive: true });

        const filename = `${randomUUID()}.webp`;

        await writeFile(
            path.join(UPLOAD_DIR, filename),
            optimized,
            { flag: "wx" },
        );

        return `/uploads/products/${filename}`;
    }

    async remove(imageUrl: string): Promise<void> {
        if (
            !/^\/uploads\/products\/[a-f0-9-]{36}\.webp$/.test(
                imageUrl,
            )
        ) {
            throw new Error("Path gambar tidak valid");
        }

        await unlink(
            path.join(UPLOAD_DIR, path.basename(imageUrl)),
        );
    }
}