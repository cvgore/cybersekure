-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL PRIMARY KEY,
    "value" TEXT
);

-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "roles" TEXT NOT NULL DEFAULT 'user',
    "hashedPassword" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiresAt" DATETIME,
    "expirePasswordPeriod" INTEGER NOT NULL DEFAULT -1,
    "expirePasswordStartDate" DATETIME,
    "passwordComplexityRules" TEXT,
    "forceNewPasswordOnLogin" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" DATETIME,
    "deletedAt" DATETIME,
    "oneTimePasswordEnabled" BOOLEAN NOT NULL DEFAULT false
);
INSERT INTO "new_User" ("deletedAt", "expirePasswordPeriod", "expirePasswordStartDate", "expiresAt", "forceNewPasswordOnLogin", "hashedPassword", "id", "passwordComplexityRules", "resetToken", "resetTokenExpiresAt", "roles", "salt", "username") SELECT "deletedAt", "expirePasswordPeriod", "expirePasswordStartDate", "expiresAt", "forceNewPasswordOnLogin", "hashedPassword", "id", "passwordComplexityRules", "resetToken", "resetTokenExpiresAt", "roles", "salt", "username" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;
