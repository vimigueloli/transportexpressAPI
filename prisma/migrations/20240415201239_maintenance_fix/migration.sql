/*
  Warnings:

  - Added the required column `commission` to the `maintenance` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cost` to the `maintenance` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "maintenance" ADD COLUMN     "commission" DECIMAL(65,30) NOT NULL,
ADD COLUMN     "cost" DECIMAL(65,30) NOT NULL;
