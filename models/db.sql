use flowers_shop

CREATE TABLE `flowers` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255),
    `color` VARCHAR(255) NOT NULL,
    `price` DECIMAL(8, 2) NOT NULL,
    `flower_type` BIGINT NOT NULL,
    `photo` VARCHAR(255) NOT NULL,
    `import_from` VARCHAR(255) NOT NULL
);

CREATE TABLE `customers` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `first_name` VARCHAR(255) NOT NULL,
    `last_name` VARCHAR(255) NOT NULL,
    `phone` VARCHAR(255) NOT NULL,
    `email` VARCHAR(255) NOT NULL,
    `address` TEXT NOT NULL
);


CREATE TABLE `orders` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `customer_id` BIGINT UNSIGNED NOT NULL,
    `total_price` DECIMAL(8, 2) NOT NULL,
    `order_date` DATETIME NOT NULL,
    `status_id` BIGINT UNSIGNED NOT NULL
);

CREATE TABLE `order_details` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `order_id` BIGINT UNSIGNED NOT NULL,
    `flower_id` BIGINT UNSIGNED NOT NULL,
    `quantity` BIGINT NOT NULL
);

CREATE TABLE `status` (
    `id` BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `name` VARCHAR(255) NOT NULL
);





use flowers_shop

CREATE TABLE flowers_log (
    id int UNSIGNED NOT NULL AUTO_INCREMENT PRIMARY KEY,
    msg VARCHAR(255) NOT NULL,
    time TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    row_id int NOT NULL
)

CREATE TRIGGER insert_flowers AFTER INSERT ON flowers FOR EACH ROW
BEGIN
    INSERT INTO flowers_log SET msg = `inserted new row`, row_id = NEW.id;
END

SELECT * FROM flowers_log

DROP Trigger update_flower

CREATE Trigger update_flower BEFORE UPDATE ON flowers FOR EACH ROW
BEGIN
    INSERT INTO flowers_log SET msg = CONCAT('row updated ', OLD.name, ' to ', NEW.name), row_id = NEW.id;
END

CREATE TABLE flowers_backup (
    `id` INT AUTO_INCREMENT PRIMARY KEY,
    `flower_id` INT,
    `name` VARCHAR(255),
    `color` VARCHAR(255),
    `price` DECIMAL(8, 2),
    `flower_type` BIGINT,
    `photo` VARCHAR(255),
    `import_from` VARCHAR(255)
);

SELECT * FROM flowers_backup

CREATE TRIGGER backup_flower BEFORE UPDATE ON flowers FOR EACH ROW
BEGIN
    INSERT INTO flowers_backup
    SET flower_id = OLD.id,
    name = OLD.name,
    color = OLD.color,
    price = OLD.price,
    flower_type = OLD.flower_type,
    photo = OLD.photo,
    import_from = OLD.import_from;
END