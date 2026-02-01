/*
  Warnings:

  - A unique constraint covering the columns `[odooId]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[odooId]` on the table `Product` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[odooId]` on the table `ProductVariant` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateEnum
CREATE TYPE "ProductStatus" AS ENUM ('DRAFT', 'ACTIVE', 'OUT_OF_STOCK', 'ARCHIVED');

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "odooId" INTEGER;

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "odooId" INTEGER,
ADD COLUMN     "status" "ProductStatus" NOT NULL DEFAULT 'DRAFT';

-- AlterTable
ALTER TABLE "ProductVariant" ADD COLUMN     "isActive" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "odooId" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "isEmailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "isPhoneVerified" BOOLEAN NOT NULL DEFAULT false;

-- CreateIndex
CREATE UNIQUE INDEX "Category_odooId_key" ON "Category"("odooId");

-- CreateIndex
CREATE UNIQUE INDEX "Product_odooId_key" ON "Product"("odooId");

-- CreateIndex
CREATE UNIQUE INDEX "ProductVariant_odooId_key" ON "ProductVariant"("odooId");
