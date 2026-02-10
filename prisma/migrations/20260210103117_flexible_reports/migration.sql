/*
  Warnings:

  - You are about to drop the column `content1` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `content2` on the `Report` table. All the data in the column will be lost.
  - You are about to drop the column `content3` on the `Report` table. All the data in the column will be lost.
  - Added the required column `content` to the `Report` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Report" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "weekId" INTEGER,
    "reportType" TEXT NOT NULL DEFAULT 'WEEK',
    "date" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "title" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "Report_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Report_weekId_fkey" FOREIGN KEY ("weekId") REFERENCES "Week" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Report" ("createdAt", "date", "id", "status", "title", "updatedAt", "userId", "weekId") SELECT "createdAt", "date", "id", "status", "title", "updatedAt", "userId", "weekId" FROM "Report";
DROP TABLE "Report";
ALTER TABLE "new_Report" RENAME TO "Report";
CREATE INDEX "Report_userId_idx" ON "Report"("userId");
CREATE INDEX "Report_weekId_idx" ON "Report"("weekId");
CREATE INDEX "Report_status_idx" ON "Report"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
