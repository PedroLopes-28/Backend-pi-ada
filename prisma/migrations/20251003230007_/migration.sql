/*
  Warnings:

  - You are about to drop the `types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `type_id` on the `investments` table. All the data in the column will be lost.
  - You are about to alter the column `dateInvested` on the `investments` table. The data in that column could be lost. The data in that column will be cast from `String` to `DateTime`.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "types";
PRAGMA foreign_keys=on;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_investments" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "investedValue" REAL NOT NULL,
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
