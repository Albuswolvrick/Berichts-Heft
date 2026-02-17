/*
  Warnings:

  - You are about to drop the column `instructions` on the `WeeklyReport` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_WeeklyReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "monthlyReportId" INTEGER,
    "name" TEXT,
    "weekStart" DATETIME,
    "weekEnd" DATETIME,
    "weekNumber" INTEGER,
    "department" TEXT,
    "summary" TEXT,
    "activities" TEXT,
    "school" TEXT,
    "totalHours" REAL,
    "remarks" TEXT,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WeeklyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WeeklyReport_monthlyReportId_fkey" FOREIGN KEY ("monthlyReportId") REFERENCES "MonthlyReport" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_WeeklyReport" ("activities", "createdAt", "department", "id", "monthlyReportId", "school", "status", "summary", "totalHours", "updatedAt", "userId", "weekEnd", "weekNumber", "weekStart") SELECT "activities", "createdAt", "department", "id", "monthlyReportId", "school", "status", "summary", "totalHours", "updatedAt", "userId", "weekEnd", "weekNumber", "weekStart" FROM "WeeklyReport";
DROP TABLE "WeeklyReport";
ALTER TABLE "new_WeeklyReport" RENAME TO "WeeklyReport";
CREATE INDEX "WeeklyReport_userId_idx" ON "WeeklyReport"("userId");
CREATE INDEX "WeeklyReport_monthlyReportId_idx" ON "WeeklyReport"("monthlyReportId");
CREATE INDEX "WeeklyReport_weekStart_weekEnd_idx" ON "WeeklyReport"("weekStart", "weekEnd");
CREATE INDEX "WeeklyReport_status_idx" ON "WeeklyReport"("status");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
