/*
  Warnings:

  - Added the required column `recipientName` to the `Order` table without a default value. This is not possible if the table is not empty.
  - Added the required column `recipientPhone` to the `Order` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Order" ADD COLUMN     "recipientName" TEXT NOT NULL,
ADD COLUMN     "recipientPhone" TEXT NOT NULL;
