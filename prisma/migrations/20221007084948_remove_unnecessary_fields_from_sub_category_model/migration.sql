/*
  Warnings:

  - You are about to drop the column `country` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `imgAlt` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `metaDescription` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `metaKeywords` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `metaSchema` on the `SubCategory` table. All the data in the column will be lost.
  - You are about to drop the column `metaTitle` on the `SubCategory` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "SubCategory" DROP COLUMN "country",
DROP COLUMN "image",
DROP COLUMN "imgAlt",
DROP COLUMN "metaDescription",
DROP COLUMN "metaKeywords",
DROP COLUMN "metaSchema",
DROP COLUMN "metaTitle";
