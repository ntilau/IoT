CREATE DATABASE IF NOT EXISTS apidb;
USE apidb;
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
 `id` SERIAL PRIMARY KEY NOT NULL AUTO_INCREMENT,
 `device` varchar(40) NOT NULL,
 `name` varchar(25) NOT NULL,
 `age` varchar(2) NOT NULL,
 `sex` ENUM('M','F') NOT NULL,
 `image` longtext NOT NULL,
 `peers` longtext NOT NULL,
 `chats` longtext NOT NULL,
 `date` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1 AUTO_INCREMENT=1;