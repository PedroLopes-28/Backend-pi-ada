/*
  Warnings:

  - Added the required column `quantity` to the `investments` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_investments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "investedValue" REAL NOT NULL,
    "quantity" INTEGER NOT NULL,
    "dateInvested" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "ticker" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "investments_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_investments" ("created_at", "dateInvested", "id", "investedValue", "name", "ticker", "updated_at", "user_id") SELECT "created_at", "dateInvested", "id", "investedValue", "name", "ticker", "updated_at", "user_id" FROM "investments";
DROP TABLE "investments";
ALTER TABLE "new_investments" RENAME TO "investments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
