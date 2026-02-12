/*
  Warnings:

  - You are about to drop the `Report` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Week` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `reportId` on the `Attachment` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "Report_status_idx";

-- DropIndex
DROP INDEX "Report_weekId_idx";

-- DropIndex
DROP INDEX "Report_userId_idx";

-- DropIndex
DROP INDEX "Week_startDate_endDate_idx";

-- DropIndex
DROP INDEX "Week_userId_idx";

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Report";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "Week";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "DailyReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "weeklyReportId" INTEGER,
    "reportDate" DATETIME NOT NULL,
    "title" TEXT NOT NULL,
    "activities" TEXT NOT NULL,
    "learnings" TEXT NOT NULL,
    "challenges" TEXT NOT NULL,
    "hoursWorked" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "DailyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DailyReport_weeklyReportId_fkey" FOREIGN KEY ("weeklyReportId") REFERENCES "WeeklyReport" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "WeeklyReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "monthlyReportId" INTEGER,
    "weekStart" DATETIME NOT NULL,
    "weekEnd" DATETIME NOT NULL,
    "weekNumber" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "activities" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "school" TEXT NOT NULL,
    "department" TEXT NOT NULL,
    "totalHours" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "WeeklyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "WeeklyReport_monthlyReportId_fkey" FOREIGN KEY ("monthlyReportId") REFERENCES "MonthlyReport" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "MonthlyReport" (
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
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "MonthlyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "MonthlyReport_yearlyReportId_fkey" FOREIGN KEY ("yearlyReportId") REFERENCES "YearlyReport" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "YearlyReport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "trainingYear" TEXT NOT NULL,
    "yearStart" DATETIME NOT NULL,
    "yearEnd" DATETIME NOT NULL,
    "summary" TEXT NOT NULL,
    "achievements" TEXT NOT NULL,
    "skillsImprofed" TEXT NOT NULL,
    "goals" TEXT NOT NULL,
    "totalHours" REAL NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "YearlyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "dailyReportId" INTEGER,
    "weeklyReportId" INTEGER,
    "monthlyReportId" INTEGER,
    "yearlyReportId" INTEGER,
    "content" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_dailyReportId_fkey" FOREIGN KEY ("dailyReportId") REFERENCES "DailyReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_weeklyReportId_fkey" FOREIGN KEY ("weeklyReportId") REFERENCES "WeeklyReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_monthlyReportId_fkey" FOREIGN KEY ("monthlyReportId") REFERENCES "MonthlyReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Comment_yearlyReportId_fkey" FOREIGN KEY ("yearlyReportId") REFERENCES "YearlyReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Attachment" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "dailyReportId" INTEGER,
    "weeklyReportId" INTEGER,
    "monthlyReportId" INTEGER,
    "yearlyReportId" INTEGER,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Attachment_dailyReportId_fkey" FOREIGN KEY ("dailyReportId") REFERENCES "DailyReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attachment_weeklyReportId_fkey" FOREIGN KEY ("weeklyReportId") REFERENCES "WeeklyReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attachment_monthlyReportId_fkey" FOREIGN KEY ("monthlyReportId") REFERENCES "MonthlyReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "Attachment_yearlyReportId_fkey" FOREIGN KEY ("yearlyReportId") REFERENCES "YearlyReport" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Attachment" ("fileName", "filePath", "fileSize", "id", "mimeType", "uploadedAt") SELECT "fileName", "filePath", "fileSize", "id", "mimeType", "uploadedAt" FROM "Attachment";
DROP TABLE "Attachment";
ALTER TABLE "new_Attachment" RENAME TO "Attachment";
CREATE INDEX "Attachment_dailyReportId_idx" ON "Attachment"("dailyReportId");
CREATE INDEX "Attachment_weeklyReportId_idx" ON "Attachment"("weeklyReportId");
CREATE INDEX "Attachment_monthlyReportId_idx" ON "Attachment"("monthlyReportId");
CREATE INDEX "Attachment_yearlyReportId_idx" ON "Attachment"("yearlyReportId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE INDEX "DailyReport_userId_idx" ON "DailyReport"("userId");

-- CreateIndex
CREATE INDEX "DailyReport_weeklyReportId_idx" ON "DailyReport"("weeklyReportId");

-- CreateIndex
CREATE INDEX "DailyReport_reportDate_idx" ON "DailyReport"("reportDate");

-- CreateIndex
CREATE INDEX "DailyReport_status_idx" ON "DailyReport"("status");

-- CreateIndex
CREATE INDEX "WeeklyReport_userId_idx" ON "WeeklyReport"("userId");

-- CreateIndex
CREATE INDEX "WeeklyReport_monthlyReportId_idx" ON "WeeklyReport"("monthlyReportId");

-- CreateIndex
CREATE INDEX "WeeklyReport_weekStart_weekEnd_idx" ON "WeeklyReport"("weekStart", "weekEnd");

-- CreateIndex
CREATE INDEX "WeeklyReport_status_idx" ON "WeeklyReport"("status");

-- CreateIndex
CREATE INDEX "MonthlyReport_userId_idx" ON "MonthlyReport"("userId");

-- CreateIndex
CREATE INDEX "MonthlyReport_yearlyReportId_idx" ON "MonthlyReport"("yearlyReportId");

-- CreateIndex
CREATE INDEX "MonthlyReport_month_year_idx" ON "MonthlyReport"("month", "year");

-- CreateIndex
CREATE INDEX "MonthlyReport_status_idx" ON "MonthlyReport"("status");

-- CreateIndex
CREATE INDEX "YearlyReport_userId_idx" ON "YearlyReport"("userId");

-- CreateIndex
CREATE INDEX "YearlyReport_year_idx" ON "YearlyReport"("year");

-- CreateIndex
CREATE INDEX "YearlyReport_status_idx" ON "YearlyReport"("status");

-- CreateIndex
CREATE INDEX "Comment_userId_idx" ON "Comment"("userId");

-- CreateIndex
CREATE INDEX "Comment_dailyReportId_idx" ON "Comment"("dailyReportId");

-- CreateIndex
CREATE INDEX "Comment_weeklyReportId_idx" ON "Comment"("weeklyReportId");

-- CreateIndex
CREATE INDEX "Comment_monthlyReportId_idx" ON "Comment"("monthlyReportId");

-- CreateIndex
CREATE INDEX "Comment_yearlyReportId_idx" ON "Comment"("yearlyReportId");
