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
    "kundaliLimit" INTEGER NOT NULL DEFAULT 1,
    "expertiseLevel" TEXT NOT NULL DEFAULT 'BEGINNER',
    "rating" REAL NOT NULL DEFAULT 5.0,
    "totalReviews" INTEGER NOT NULL DEFAULT 0,
    "todayChats" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_Agent" ("avatar", "createdAt", "description", "id", "isActive", "kundaliLimit", "messageCost", "name", "systemPrompt", "tags", "updatedAt") SELECT "avatar", "createdAt", "description", "id", "isActive", "kundaliLimit", "messageCost", "name", "systemPrompt", "tags", "updatedAt" FROM "Agent";
DROP TABLE "Agent";
ALTER TABLE "new_Agent" RENAME TO "Agent";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
