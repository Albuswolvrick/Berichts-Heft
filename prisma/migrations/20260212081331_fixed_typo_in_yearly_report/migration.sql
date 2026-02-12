/*
  Warnings:

  - You are about to drop the column `skillsImprofed` on the `YearlyReport` table. All the data in the column will be lost.
  - Added the required column `skillsImproved` to the `YearlyReport` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_YearlyReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "trainingYear" TEXT NOT NULL,
    "yearStart" DATETIME NOT NULL,
    "yearEnd" DATETIME NOT NULL,
    "summary" TEXT NOT NULL,
    "achievements" TEXT NOT NULL,
    "skillsImproved" TEXT NOT NULL,
    "goals" TEXT NOT NULL,
    "totalHours" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "YearlyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_YearlyReport" ("achievements", "createdAt", "goals", "id", "status", "summary", "totalHours", "trainingYear", "updatedAt", "userId", "year", "yearEnd", "yearStart") SELECT "achievements", "createdAt", "goals", "id", "status", "summary", "totalHours", "trainingYear", "updatedAt", "userId", "year", "yearEnd", "yearStart" FROM "YearlyReport";
DROP TABLE "YearlyReport";
ALTER TABLE "new_YearlyReport" RENAME TO "YearlyReport";
CREATE INDEX "YearlyReport_userId_idx" ON "YearlyReport"("userId");
CREATE INDEX "YearlyReport_year_idx" ON "YearlyReport"("year");
CREATE INDEX "YearlyReport_status_idx" ON "YearlyReport"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
