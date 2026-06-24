-- CreateTable
CREATE TABLE `Image` (
    `id` VARCHAR(191) NOT NULL,
    `originalName` VARCHAR(191) NOT NULL,
    `mimeType` VARCHAR(191) NOT NULL,
    `size` BIGINT NOT NULL,
    `originalPath` VARCHAR(191) NOT NULL,
    `thumbnailPath` VARCHAR(191) NULL,
    `mediumPath` VARCHAR(191) NULL,
    `largePath` VARCHAR(191) NULL,
    `webpPath` VARCHAR(191) NULL,
    `avifPath` VARCHAR(191) NULL,
    `status` ENUM('PENDING', 'PROCESSING', 'COMPLETED', 'FAILED') NOT NULL DEFAULT 'PENDING',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
