
import {  Prisma, PrismaClient } from "@/generated/prisma/client"
import { RegisterInput } from "../schemas/auth.schema"
import { hash, pseudoRandomBytes, scrypt } from "crypto"
import { promisify } from "util"

const scryptAsync = promisify(scrypt);

export class EmailAlreadyError extends Error {
constructor() {
    super("Email Telah Terdaftar")
    this.name = 'Email Sudah Terdaftar '
}
}


export class UserService {
    constructor(private db: PrismaClient) {}

    async register(values: RegisterInput) {


        const salt = pseudoRandomBytes(16).toString("hex");


        // 2. Hash password
        const hashing = (await scryptAsync(
            values.password,
            salt,
            64
        )) as Buffer;


        const passHash = `${salt}:${hashing.toString("hex")}`

        try {
            
            const user = await this.db.user.create({
                data :{
                    email: values.email,
                    name: values.name,
                    passHash
                },
                select : {
                    id: true,
                    email : true,
                    name: true,
                },
            })


            return {
                success : true,
                message: "Register Telah berhasil",
                user
            }

        } catch (error) {

            if(error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
                throw new EmailAlreadyError();
            }
            throw error
            
        }
    }
}