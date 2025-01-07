/*
  Warnings:

  - The `content` column on the `Notification` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Notification" DROP COLUMN "content",
ADD COLUMN     "content" JSONB;
