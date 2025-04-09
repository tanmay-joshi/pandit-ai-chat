/*
  Warnings:

  - You are about to drop the column `kundaliId` on the `Chat` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "ChatKundali" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "chatId" TEXT NOT NULL,
    "kundaliId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "ChatKundali_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "ChatKundali_kundaliId_fkey" FOREIGN KEY ("kundaliId") REFERENCES "Kundali" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Agent" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "avatar" TEXT,
    "systemPrompt" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "messageCost" INTEGER NOT NULL DEFAULT 10,
    "tags" TEXT,
    "kundaliLimit" INTEGER NOT NULL DEFAULT 1
);
INSERT INTO "new_Agent" ("avatar", "createdAt", "description", "id", "isActive", "messageCost", "name", "systemPrompt", "tags", "updatedAt") SELECT "avatar", "createdAt", "description", "id", "isActive", "messageCost", "name", "systemPrompt", "tags", "updatedAt" FROM "Agent";
DROP TABLE "Agent";
ALTER TABLE "new_Agent" RENAME TO "Agent";
CREATE TABLE "new_Chat" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "userId" TEXT NOT NULL,
    "agentId" TEXT,
    CONSTRAINT "Chat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Chat_agentId_fkey" FOREIGN KEY ("agentId") REFERENCES "Agent" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_Chat" ("agentId", "createdAt", "id", "title", "updatedAt", "userId") SELECT "agentId", "createdAt", "id", "title", "updatedAt", "userId" FROM "Chat";
DROP TABLE "Chat";
ALTER TABLE "new_Chat" RENAME TO "Chat";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "ChatKundali_chatId_kundaliId_key" ON "ChatKundali"("chatId", "kundaliId");
