module.exports = [
    'ALTER TABLE `Releases` ADD COLUMN `dateRelease` DATETIME AFTER `type`;',
    'ALTER TABLE `Categories` ADD COLUMN `type` TEXT AFTER `id`;',
    'ALTER TABLE `Categories` ADD COLUMN `label` TEXT AFTER `name`;',
    'ALTER TABLE `Categories` ADD COLUMN `icon` TEXT AFTER `label`;',
    'ALTER TABLE `Categories` ADD COLUMN `color` TEXT AFTER `icon`;',
    'ALTER TABLE `Releases` ADD COLUMN `categoryId` TEXT AFTER `userId`;',
    'ALTER TABLE `Categories` RENAME COLUMN type TO typeRelease;',
]