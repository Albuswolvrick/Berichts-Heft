/*
  Warnings:

  - Added the required column `instructions` to the `MonthlyReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `MonthlyReport` table without a default value. This is not possible if the table is not empty.
  - Added the required column `remarks` to the `MonthlyReport` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_MonthlyReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "yearlyReportId" INTEGER,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "monthStart" DATETIME NOT NULL,
    "monthEnd" DATETIME NOT NULL,
    "summary" TEXT NOT NULL,
    "keyAchievements" TEXT NOT NULL,
    "goals" TEXT NOT NULL,
    "totalHours" REAL NOT NULL,
    "yearOfTraining" INTEGER,
    "name" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MonthlyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MonthlyReport_yearlyReportId_fkey" FOREIGN KEY ("yearlyReportId") REFERENCES "YearlyReport" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_MonthlyReport" ("createdAt", "goals", "id", "keyAchievements", "month", "monthEnd", "monthStart", "status", "summary", "totalHours", "updatedAt", "userId", "year", "yearlyReportId") SELECT "createdAt", "goals", "id", "keyAchievements", "month", "monthEnd", "monthStart", "status", "summary", "totalHours", "updatedAt", "userId", "year", "yearlyReportId" FROM "MonthlyReport";
DROP TABLE "MonthlyReport";
ALTER TABLE "new_MonthlyReport" RENAME TO "MonthlyReport";
CREATE INDEX "MonthlyReport_userId_idx" ON "MonthlyReport"("userId");
CREATE INDEX "MonthlyReport_yearlyReportId_idx" ON "MonthlyReport"("yearlyReportId");
CREATE INDEX "MonthlyReport_month_year_idx" ON "MonthlyReport"("month", "year");
CREATE INDEX "MonthlyReport_status_idx" ON "MonthlyReport"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
