-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL,
    "roles" TEXT NOT NULL DEFAULT 'user',
    "hashedPassword" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    "resetToken" TEXT,
    "resetTokenExpiresAt" DATETIME,
    "expirePasswordPeriod" INTEGER NOT NULL DEFAULT -1,
    "expirePasswordStartDate" DATETIME,
    "forceNewPasswordOnLogin" BOOLEAN NOT NULL DEFAULT false,
    "passwordComplexityRules" TEXT,
    "expiresAt" DATETIME,
    "deletedAt" DATETIME
);

-- CreateTable
CREATE TABLE "UserPreviousPasswords" (
    "userId" INTEGER NOT NULL,
    "hashedPassword" TEXT NOT NULL,
    "salt" TEXT NOT NULL,
    CONSTRAINT "UserPreviousPasswords_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "User_username_key" ON "User"("username");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreviousPasswords_userId_hashedPassword_salt_key" ON "UserPreviousPasswords"("userId", "hashedPassword", "salt");
