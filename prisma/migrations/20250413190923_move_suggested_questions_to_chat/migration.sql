/*
  Warnings:

  - You are about to drop the column `suggestedQuestions` on the `Message` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Chat" ADD COLUMN "suggestedQuestions" TEXT;

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Message" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "content" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "chatId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "cost" INTEGER NOT NULL DEFAULT 10,
    "paid" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Message_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "Chat" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Message_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Message" ("chatId", "content", "cost", "createdAt", "id", "paid", "role", "userId") SELECT "chatId", "content", "cost", "createdAt", "id", "paid", "role", "userId" FROM "Message";
DROP TABLE "Message";
ALTER TABLE "new_Message" RENAME TO "Message";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
