

    CREATE TABLE `users` (
        `id` INT NOT NULL AUTO_INCREMENT,
        `email` VARCHAR(100) NOT NULL,
        `password` VARCHAR(100) NOT NULL,
        `auth_token` VARCHAR(100) NOT NULL,
        `date_added` DATETIME,
        `date_modified` DATETIME,
         PRIMARY KEY (`id`),
         UNIQUE INDEX `email_UNIQUE` (`email` ASC));

    CREATE TABLE `products` (
      `id` INT NOT NULL AUTO_INCREMENT,
      `user_id` INT NOT NULL,
      `product_name` VARCHAR(100) NOT NULL,
      `product_desc` VARCHAR(100) NOT NULL,
      `product_price` INT NOT NULL,
      `product_sku` VARCHAR(100) NOT NULL,
      `product_url` VARCHAR(100) NOT NULL,
      `date_added` DATETIME,
      `date_modified` DATETIME,
       PRIMARY KEY (`id`),
       FOREIGN KEY (`user_id`) REFERENCES users(id));

     CREATE TABLE `api_auth` (
      `id` INT NOT NULL AUTO_INCREMENT,
      `api_token` VARCHAR(100) NOT NULL,
      `date_added` DATETIME,
      `date_modified` DATETIME,
        PRIMARY KEY (`id`));
