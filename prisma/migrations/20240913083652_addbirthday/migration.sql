-- AlterTable
ALTER TABLE `Class` 
  DROP FOREIGN KEY `Class_supervisorId_fkey`,
  MODIFY COLUMN `supervisorId` VARCHAR(255) NULL;

-- If the Student table is not empty, this will fail unless birthday is nullable or has a default
-- Recommended solution: make it nullable or use a default for now
ALTER TABLE `Student` ADD COLUMN `birthday` DATETIME(3) NULL;
ALTER TABLE `Teacher` ADD COLUMN `birthday` DATETIME(3) NULL;

-- AddForeignKey (re-added with SET NULL on DELETE)
ALTER TABLE `Class` 
  ADD CONSTRAINT `Class_supervisorId_fkey` 
  FOREIGN KEY (`supervisorId`) REFERENCES `Teacher`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
