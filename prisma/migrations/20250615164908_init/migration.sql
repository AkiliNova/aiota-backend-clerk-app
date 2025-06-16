-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NULL,
    `name` VARCHAR(191) NULL,
    `username` VARCHAR(191) NULL,
    `phone` VARCHAR(191) NULL,
    `profileImage` VARCHAR(191) NULL,
    `clerkUserId` VARCHAR(191) NULL,
    `clerkCreatedAt` DATETIME(3) NULL,
    `clerkUpdatedAt` DATETIME(3) NULL,
    `lastSignInAt` DATETIME(3) NULL,
    `isEmailVerified` BOOLEAN NULL DEFAULT false,
    `emailVerificationToken` VARCHAR(191) NULL,
    `phoneVerified` BOOLEAN NULL DEFAULT false,
    `role` ENUM('ADMIN', 'STAFF', 'USER') NOT NULL DEFAULT 'USER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    UNIQUE INDEX `User_username_key`(`username`),
    UNIQUE INDEX `User_phone_key`(`phone`),
    UNIQUE INDEX `User_clerkUserId_key`(`clerkUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
