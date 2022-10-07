/*
  Warnings:

  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Store` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `SubCategory` table. All the data in the column will be lost.
  - Added the required column `categoryName` to the `Category` table without a default value. This is not possible if the table is not empty.
  - Added the required column `storeName` to the `Store` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subCategoryName` to the `SubCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "name",
ADD COLUMN     "categoryName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Store" DROP COLUMN "name",
ADD COLUMN     "storeName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "SubCategory" DROP COLUMN "name",
ADD COLUMN     "subCategoryName" TEXT NOT NULL;
