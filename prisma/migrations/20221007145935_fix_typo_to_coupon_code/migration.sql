/*
  Warnings:

  - You are about to drop the column `couopnCode` on the `Offer` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Offer" DROP COLUMN "couopnCode",
ADD COLUMN     "couponCode" TEXT DEFAULT '';
