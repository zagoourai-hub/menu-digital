-- CreateTable
CREATE TABLE "Pesanan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "produkId" TEXT NOT NULL,
    "produkTitle" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'creating',
    "snapToken" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
