-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('ADMIN', 'MANAGER', 'USER', 'TEST', 'NOTLOGDIN');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'APPROVED', 'REJECTED', 'REVISION_REQUIRED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "passwordHash" TEXT NOT NULL,
    "lastLoginAt" TIMESTAMP(3),
    "lastLoginIp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DailyReport" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "weeklyReportId" INTEGER,
    "reportDate" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "activities" TEXT NOT NULL,
    "learnings" TEXT NOT NULL,
    "challenges" TEXT NOT NULL,
    "hoursWorked" DOUBLE PRECISION NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DailyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WeeklyReport" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "monthlyReportId" INTEGER,
    "name" TEXT,
    "weekStart" TIMESTAMP(3),
    "weekEnd" TIMESTAMP(3),
    "weekNumber" INTEGER,
    "department" TEXT,
    "yearOfTraining" INTEGER,
    "summary" TEXT,
    "activities" TEXT,
    "school" TEXT,
    "totalHours" DOUBLE PRECISION,
    "remarks" TEXT,
    "status" "ReportStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeeklyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MonthlyReport" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "yearlyReportId" INTEGER,
    "month" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "monthStart" TIMESTAMP(3) NOT NULL,
    "monthEnd" TIMESTAMP(3) NOT NULL,
    "summary" TEXT NOT NULL,
    "keyAchievements" TEXT NOT NULL,
    "goals" TEXT NOT NULL,
    "totalHours" DOUBLE PRECISION NOT NULL,
    "yearOfTraining" INTEGER,
    "name" TEXT NOT NULL,
    "instructions" TEXT NOT NULL,
    "remarks" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MonthlyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "YearlyReport" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,
    "trainingYear" TEXT NOT NULL,
    "yearStart" TIMESTAMP(3) NOT NULL,
    "yearEnd" TIMESTAMP(3) NOT NULL,
    "summary" TEXT NOT NULL,
    "achievements" TEXT NOT NULL,
    "skillsImproved" TEXT NOT NULL,
    "goals" TEXT NOT NULL,
    "totalHours" DOUBLE PRECISION NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT 'DRAFT',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "YearlyReport_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Attachment" (
    "id" SERIAL NOT NULL,
    "dailyReportId" INTEGER,
    "weeklyReportId" INTEGER,
    "monthlyReportId" INTEGER,
    "yearlyReportId" INTEGER,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Attachment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "dailyReportId" INTEGER,
    "weeklyReportId" INTEGER,
    "monthlyReportId" INTEGER,
    "yearlyReportId" INTEGER,
    "content" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_name_idx" ON "User"("name");

-- CreateIndex
CREATE INDEX "DailyReport_userId_idx" ON "DailyReport"("userId");

-- CreateIndex
CREATE INDEX "DailyReport_weeklyReportId_idx" ON "DailyReport"("weeklyReportId");

-- CreateIndex
CREATE INDEX "DailyReport_reportDate_idx" ON "DailyReport"("reportDate");

-- CreateIndex
CREATE INDEX "DailyReport_status_idx" ON "DailyReport"("status");

-- CreateIndex
CREATE INDEX "DailyReport_userId_status_idx" ON "DailyReport"("userId", "status");

-- CreateIndex
CREATE INDEX "DailyReport_userId_reportDate_idx" ON "DailyReport"("userId", "reportDate");

-- CreateIndex
CREATE INDEX "WeeklyReport_userId_idx" ON "WeeklyReport"("userId");

-- CreateIndex
CREATE INDEX "WeeklyReport_monthlyReportId_idx" ON "WeeklyReport"("monthlyReportId");

-- CreateIndex
CREATE INDEX "WeeklyReport_weekStart_weekEnd_idx" ON "WeeklyReport"("weekStart", "weekEnd");

-- CreateIndex
CREATE INDEX "WeeklyReport_status_idx" ON "WeeklyReport"("status");

-- CreateIndex
CREATE INDEX "WeeklyReport_userId_status_idx" ON "WeeklyReport"("userId", "status");

-- CreateIndex
CREATE INDEX "MonthlyReport_userId_idx" ON "MonthlyReport"("userId");

-- CreateIndex
CREATE INDEX "MonthlyReport_yearlyReportId_idx" ON "MonthlyReport"("yearlyReportId");

-- CreateIndex
CREATE INDEX "MonthlyReport_month_year_idx" ON "MonthlyReport"("month", "year");

-- CreateIndex
CREATE INDEX "MonthlyReport_status_idx" ON "MonthlyReport"("status");

-- CreateIndex
CREATE INDEX "MonthlyReport_userId_status_idx" ON "MonthlyReport"("userId", "status");

-- CreateIndex
CREATE INDEX "YearlyReport_userId_idx" ON "YearlyReport"("userId");

-- CreateIndex
CREATE INDEX "YearlyReport_year_idx" ON "YearlyReport"("year");

-- CreateIndex
CREATE INDEX "YearlyReport_status_idx" ON "YearlyReport"("status");

-- CreateIndex
CREATE INDEX "YearlyReport_userId_status_idx" ON "YearlyReport"("userId", "status");

-- CreateIndex
CREATE INDEX "Attachment_dailyReportId_idx" ON "Attachment"("dailyReportId");

-- CreateIndex
CREATE INDEX "Attachment_weeklyReportId_idx" ON "Attachment"("weeklyReportId");

-- CreateIndex
CREATE INDEX "Attachment_monthlyReportId_idx" ON "Attachment"("monthlyReportId");

-- CreateIndex
CREATE INDEX "Attachment_yearlyReportId_idx" ON "Attachment"("yearlyReportId");

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

-- CreateIndex
CREATE INDEX "Comment_userId_createdAt_idx" ON "Comment"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "DailyReport" ADD CONSTRAINT "DailyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DailyReport" ADD CONSTRAINT "DailyReport_weeklyReportId_fkey" FOREIGN KEY ("weeklyReportId") REFERENCES "WeeklyReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReport" ADD CONSTRAINT "WeeklyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WeeklyReport" ADD CONSTRAINT "WeeklyReport_monthlyReportId_fkey" FOREIGN KEY ("monthlyReportId") REFERENCES "MonthlyReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyReport" ADD CONSTRAINT "MonthlyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MonthlyReport" ADD CONSTRAINT "MonthlyReport_yearlyReportId_fkey" FOREIGN KEY ("yearlyReportId") REFERENCES "YearlyReport"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "YearlyReport" ADD CONSTRAINT "YearlyReport_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_dailyReportId_fkey" FOREIGN KEY ("dailyReportId") REFERENCES "DailyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_weeklyReportId_fkey" FOREIGN KEY ("weeklyReportId") REFERENCES "WeeklyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_monthlyReportId_fkey" FOREIGN KEY ("monthlyReportId") REFERENCES "MonthlyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attachment" ADD CONSTRAINT "Attachment_yearlyReportId_fkey" FOREIGN KEY ("yearlyReportId") REFERENCES "YearlyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_dailyReportId_fkey" FOREIGN KEY ("dailyReportId") REFERENCES "DailyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_weeklyReportId_fkey" FOREIGN KEY ("weeklyReportId") REFERENCES "WeeklyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_monthlyReportId_fkey" FOREIGN KEY ("monthlyReportId") REFERENCES "MonthlyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_yearlyReportId_fkey" FOREIGN KEY ("yearlyReportId") REFERENCES "YearlyReport"("id") ON DELETE CASCADE ON UPDATE CASCADE;
