/*
  Warnings:

  - Added the required column `queue_number` to the `Sales` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Sales" ADD COLUMN     "queue_number" INTEGER NOT NULL;
