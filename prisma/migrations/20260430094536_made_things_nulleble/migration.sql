/*
  Warnings:

  - Made the column `name` on table `WeeklyReport` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weekStart` on table `WeeklyReport` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weekEnd` on table `WeeklyReport` required. This step will fail if there are existing NULL values in that column.
  - Made the column `weekNumber` on table `WeeklyReport` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "DailyReport" ALTER COLUMN "activities" DROP NOT NULL,
ALTER COLUMN "learnings" DROP NOT NULL,
ALTER COLUMN "challenges" DROP NOT NULL,
ALTER COLUMN "hoursWorked" DROP NOT NULL;

-- AlterTable
ALTER TABLE "MonthlyReport" ALTER COLUMN "summary" DROP NOT NULL,
ALTER COLUMN "keyAchievements" DROP NOT NULL,
ALTER COLUMN "goals" DROP NOT NULL,
ALTER COLUMN "totalHours" DROP NOT NULL,
ALTER COLUMN "instructions" DROP NOT NULL,
ALTER COLUMN "remarks" DROP NOT NULL;

-- AlterTable
ALTER TABLE "WeeklyReport" ALTER COLUMN "name" SET NOT NULL,
ALTER COLUMN "weekStart" SET NOT NULL,
ALTER COLUMN "weekEnd" SET NOT NULL,
ALTER COLUMN "weekNumber" SET NOT NULL;

-- AlterTable
ALTER TABLE "YearlyReport" ALTER COLUMN "summary" DROP NOT NULL,
ALTER COLUMN "achievements" DROP NOT NULL,
ALTER COLUMN "skillsImproved" DROP NOT NULL,
ALTER COLUMN "goals" DROP NOT NULL,
ALTER COLUMN "totalHours" DROP NOT NULL;
