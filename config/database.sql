
-- DROP DATABASE `athenashop` ;
CREATE DATABASE `athenashop`;
USE `athenashop`;

DROP TABLE IF EXISTS `usuarios`;
use `athenashop`;
CREATE TABLE usuarios (
  id int not null auto_increment,
  nome varchar(255) NOT NULL,
  email varchar(60) NOT NULL,
  cpf varchar (255),
  telefone varchar (255),
  senha longtext NOT NULL,
  img_usuario varchar (255) default 'img/profile-user.png',
  id_tipo_usuario int not null default '1',
  primary key (`id`)
);


create table favoritos (
	id_favoritos int auto_increment primary key,
	id_usuario int,
	id_produto int,
    foreign key (id_produto) references produtos(id_produto),
    foreign key (id_usuario) references usuarios(id) 
);	

CREATE TABLE produtos (
  id_produto int not null auto_increment,
  nome_produto varchar(255) NOT NULL,
  descricao_produto varchar(255) NOT NULL,
  quantidade_produto varchar (60),
  cores_produto varchar (60),
  preco_produto varchar (60),
  img_produto varchar (255),
  primary key (`id_produto`)
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


  