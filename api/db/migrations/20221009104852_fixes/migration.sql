/*
  Warnings:

  - You are about to drop the `UserPreviousPasswords` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "UserPreviousPasswords";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "UserPreviousPassword" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    CONSTRAINT "UserPreviousPassword_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "UserPreviousPassword_userId_hashedPassword_salt_key" ON "UserPreviousPassword"("userId", "hashedPassword", "salt");
