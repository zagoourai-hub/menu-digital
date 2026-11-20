-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Pesanan" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "produkId" TEXT NOT NULL,
    "produkTitle" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'creating',
    "proses" TEXT NOT NULL DEFAULT 'PENDING',
    "snapToken" TEXT,
    "customerName" TEXT,
    "customerPhone" TEXT,
    "fulfillment" TEXT,
    "deliveryAddress" TEXT,
    "distanceKm" REAL,
    "deliveryFee" INTEGER NOT NULL DEFAULT 0,
    "productPrice" INTEGER,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Pesanan" ("amount", "createdAt", "customerName", "customerPhone", "deliveryAddress", "fulfillment", "id", "produkId", "produkTitle", "proses", "snapToken", "status", "updatedAt") SELECT "amount", "createdAt", "customerName", "customerPhone", "deliveryAddress", "fulfillment", "id", "produkId", "produkTitle", "proses", "snapToken", "status", "updatedAt" FROM "Pesanan";
DROP TABLE "Pesanan";
ALTER TABLE "new_Pesanan" RENAME TO "Pesanan";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
