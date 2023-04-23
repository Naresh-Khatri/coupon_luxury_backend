/*
  Warnings:

  - You are about to drop the column `image` on the `Slide` table. All the data in the column will be lost.
  - Added the required column `imgURL` to the `Slide` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Slide" DROP COLUMN "image",
ADD COLUMN     "imgURL" TEXT NOT NULL;
