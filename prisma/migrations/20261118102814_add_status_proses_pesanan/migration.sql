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
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Pesanan" ("amount", "createdAt", "id", "produkId", "produkTitle", "snapToken", "status", "updatedAt") SELECT "amount", "createdAt", "id", "produkId", "produkTitle", "snapToken", "status", "updatedAt" FROM "Pesanan";
DROP TABLE "Pesanan";
ALTER TABLE "new_Pesanan" RENAME TO "Pesanan";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
