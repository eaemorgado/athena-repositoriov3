
DROP DATABASE IF exists `athenashop` ;
CREATE DATABASE `athenashop`;
USE `athenashop`;

DROP TABLE IF EXISTS `usuarios`;

CREATE TABLE usuarios (
  id int primary key auto_increment,
  nome varchar(255) NOT NULL,
  email varchar(60) NOT NULL,
  senha longtext NOT NULL,
  telefone varchar(20) DEFAULT NULL
);








