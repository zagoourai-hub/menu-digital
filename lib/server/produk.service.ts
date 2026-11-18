import { PrismaClient, Role } from "@/generated/prisma/client";
import { Actor } from "./authorize";
import { CreateProdukInput, UpdateProdukInput } from "../schemas/produk.schema";
import { ImageStorageService } from "./image.service";


export class ProdukServices{
    constructor(private db: PrismaClient, private storage : ImageStorageService) {}

    async findAll(actor: Actor) {
        return this.db.produk.findMany({
            where: actor.role === Role.ADMIN ? {} : {authorId: actor.id},


            include: {
                author: {
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },

            orderBy: {
                createdAt: "desc",
            }
        })
    }


    async create(actor: Actor, values:Omit<CreateProdukInput, "image">, image: File) {

        const imageUrl = await this.storage.upload(image)

        try {
            
            return this.db.produk.create({
                data: {
                    ...values,
                    imageUrl,
    
                    author: {
                        connect: {
                            id: actor.id
                        }
                    }
                }
            })
        } catch (error) {
            await this.storage.remove(imageUrl).catch((cleanupError) => {
                console.error("IMAGE CLEANUP ERROR:", cleanupError);
            });
            throw error;
        }
    }


    async update(
        actor: Actor,
        produkId: string,
        values: UpdateProdukInput,
    ) {
        const result = await this.db.produk.updateMany({
            where: {
                id: produkId,

                ...(actor.role === Role.ADMIN
                    ? {}
                    : { authorId: actor.id }),
            },

            data: values,
        });

        return result.count > 0;
    }

    
    async delete(
        actor: Actor,
        produkId: string,
    ) {
        const result = await this.db.produk.deleteMany({
            where: {
                id: produkId,

                ...(actor.role === Role.ADMIN
                    ? {}
                    : { authorId: actor.id }),
            },
        });

        return result.count > 0;
    }
}