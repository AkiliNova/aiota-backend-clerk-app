/*
  Warnings:

  - Added the required column `description` to the `AiEvent` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `aievent` ADD COLUMN `description` VARCHAR(191) NOT NULL;
