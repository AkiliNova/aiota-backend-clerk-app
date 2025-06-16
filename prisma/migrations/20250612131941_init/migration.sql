/*
  Warnings:

  - You are about to alter the column `supervisorId` on the `class` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `VarChar(191)`.
  - Made the column `birthday` on table `student` required. This step will fail if there are existing NULL values in that column.
  - Made the column `birthday` on table `teacher` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE `class` DROP FOREIGN KEY `Class_supervisorId_fkey`;

-- AlterTable
ALTER TABLE `announcement` MODIFY `description` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `class` MODIFY `supervisorId` VARCHAR(191) NULL;

-- AlterTable
ALTER TABLE `event` MODIFY `description` VARCHAR(191) NOT NULL;

-- AlterTable
ALTER TABLE `student` MODIFY `img` VARCHAR(191) NULL,
    MODIFY `birthday` DATETIME(3) NOT NULL;

-- AlterTable
ALTER TABLE `teacher` MODIFY `img` VARCHAR(191) NULL,
    MODIFY `birthday` DATETIME(3) NOT NULL;

-- CreateTable
CREATE TABLE `CameraZone` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NULL,
    `location` VARCHAR(191) NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Camera` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `zoneId` INTEGER NOT NULL,
    `ipAddress` VARCHAR(191) NOT NULL,
    `isActive` BOOLEAN NOT NULL DEFAULT true,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `SurveillanceEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `cameraId` INTEGER NOT NULL,
    `eventType` ENUM('face_detected', 'unauthorized_access', 'bullying', 'fighting', 'sneaking', 'cheating', 'weapon_detected', 'phone_detected', 'fire_detected') NOT NULL,
    `timestamp` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `description` VARCHAR(191) NULL,
    `severity` INTEGER NOT NULL DEFAULT 1,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `FlaggedEvent` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventId` INTEGER NOT NULL,
    `flaggedById` VARCHAR(191) NOT NULL,
    `reason` VARCHAR(191) NOT NULL,
    `reviewed` BOOLEAN NOT NULL DEFAULT false,
    `reviewedAt` DATETIME(3) NULL,
    `additionalNotes` VARCHAR(191) NULL,

    UNIQUE INDEX `FlaggedEvent_eventId_key`(`eventId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Class` ADD CONSTRAINT `Class_supervisorId_fkey` FOREIGN KEY (`supervisorId`) REFERENCES `Teacher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Camera` ADD CONSTRAINT `Camera_zoneId_fkey` FOREIGN KEY (`zoneId`) REFERENCES `CameraZone`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `SurveillanceEvent` ADD CONSTRAINT `SurveillanceEvent_cameraId_fkey` FOREIGN KEY (`cameraId`) REFERENCES `Camera`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `FlaggedEvent` ADD CONSTRAINT `FlaggedEvent_eventId_fkey` FOREIGN KEY (`eventId`) REFERENCES `SurveillanceEvent`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
