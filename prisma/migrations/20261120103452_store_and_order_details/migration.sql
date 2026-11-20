-- AlterTable
ALTER TABLE "Pesanan" ADD COLUMN "customerName" TEXT;
ALTER TABLE "Pesanan" ADD COLUMN "customerPhone" TEXT;
ALTER TABLE "Pesanan" ADD COLUMN "deliveryAddress" TEXT;
ALTER TABLE "Pesanan" ADD COLUMN "fulfillment" TEXT;

-- CreateTable
CREATE TABLE "Toko" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nama" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "jamBuka" TEXT NOT NULL,
    "jamTutup" TEXT NOT NULL,
    "buka" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" DATETIME NOT NULL
);
