/*
  Warnings:

  - You are about to drop the `investments` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "investments";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "jokes" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "setup" TEXT NOT NULL,
    "punchline" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "created_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "jokes_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
