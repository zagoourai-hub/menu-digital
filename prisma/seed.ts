import "dotenv/config"
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3"
import { PrismaClient } from "../generated/prisma/client"

const databaseUrl = process.env.DATABASE_URL
const authorId = process.env.SEED_AUTHOR_ID

if (!databaseUrl || !authorId) {
  throw new Error("DATABASE_URL dan SEED_AUTHOR_ID harus diisi.")
}

const prisma = new PrismaClient({ adapter: new PrismaBetterSqlite3({ url: databaseUrl }) })

const menus = [
  { id: "seed-es-teh-original", title: "Es Teh Original", description: "Teh klasik yang disajikan dingin dengan rasa ringan dan menyegarkan. Pilihan sederhana untuk menemani makan siang atau istirahat di tengah hari.", price: 5000, imageUrl: "/assets/kecil.png" },
  { id: "seed-es-teh-jumbo", title: "Es Teh Jumbo", description: "Kesegaran teh klasik dalam ukuran lebih besar. Cocok untuk dinikmati lebih lama saat beraktivitas atau bersantai di hari yang hangat.", price: 8000, imageUrl: "/assets/jumbo.png" },
  { id: "seed-lemon-tea", title: "Lemon Tea", description: "Perpaduan teh dingin dan cita rasa lemon yang segar. Sentuhan asamnya memberikan rasa yang ringan dan menyenangkan di setiap tegukan.", price: 10000, imageUrl: "/assets/lemon.png" },
  { id: "seed-matcha-latte", title: "Matcha Latte", description: "Minuman matcha dengan perpaduan susu yang lembut dan creamy. Rasa khas teh hijaunya cocok untuk Anda yang ingin mencoba pilihan selain teh klasik.", price: 15000, imageUrl: "/assets/matcha.png" },
  { id: "seed-teh-tarik", title: "Teh Tarik", description: "Teh berpadu susu dengan rasa lembut dan creamy. Pilihan nikmat untuk menemani waktu santai, dengan cita rasa teh susu yang khas.", price: 12000, imageUrl: "/assets/tarik.png" },
]

async function main() {
  if (!await prisma.user.findUnique({ where: { id: authorId } })) {
    throw new Error("Pemilik menu tidak ditemukan.")
  }

  for (const menu of menus) {
    const existing = await prisma.produk.findUnique({ where: { id: menu.id } })
    if (existing) {
      console.log(`Dilewati: ${menu.title}`)
      continue
    }
    await prisma.produk.create({ data: { ...menu, authorId: authorId!, published: true } })
    console.log(`Ditambahkan: ${menu.title}`)
  }
}

main()
  .catch((error: unknown) => {
    console.error(error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
