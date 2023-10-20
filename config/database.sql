
-- DROP DATABASE IF exists `athenashop` ;
-- CREATE DATABASE `athenashop`;
-- USE `athenashop`;

-- DROP TABLE IF EXISTS `usuarios`;

-- CREATE TABLE usuarios (
--   id int primary key auto_increment,
--   nome varchar(255) NOT NULL,
--   email varchar(60) NOT NULL,
--   senha longtext NOT NULL,
--   telefone varchar(20) DEFAULT NULL
-- );


-- DROP DATABASE `athenashop` ;
CREATE DATABASE `athenashop`;
USE `athenashop`;

DROP TABLE IF EXISTS `usuarios`;
use `athenashop`;
CREATE TABLE usuarios (
  id varchar(200) primary key,
  nome varchar(255) NOT NULL,
  email varchar(60) NOT NULL,
  senha longtext NOT NULL,
  id_tipo_usuario int not null default '1'
);

create table `tipo_usuario` (
	id_tipo_usuario int not null auto_increment,
	tipo_usuario varchar (25) default null,
    inscricao_usuario varchar (155) default null,
    status_tipo_usuario int default '1',
    primary key (`id_tipo_usuario`)
    
);	

alter table usuarios
add constraint tipo_usuario
foreign key (`id_tipo_usuario`) references tipo_usuario(`id_tipo_usuario`);

INSERT INTO `athenashop`.`tipo_usuario` (`id_tipo_usuario`, `tipo_usuario`, `inscricao_usuario`, `status_tipo_usuario`) VALUES ('1', 'cliente', 'usuario logado', '1');
INSERT INTO `athenashop`.`tipo_usuario` (`id_tipo_usuario`, `tipo_usuario`, `inscricao_usuario`, `status_tipo_usuario`) VALUES ('2', 'vendedor', 'vendedor', '1');
INSERT INTO `athenashop`.`tipo_usuario` (`id_tipo_usuario`, `tipo_usuario`, `inscricao_usuario`, `status_tipo_usuario`) VALUES ('3', 'adm', 'adm', '1');











