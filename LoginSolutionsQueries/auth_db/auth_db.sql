CREATE DATABASE IF NOT EXISTS auth_db;

USE auth_db;

CREATE TABLE IF NOT EXISTS aplicacion(
	id_aplicacion int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	nombre varchar(100) NOT NULL,
	codigo varchar(10) NOT NULL,
	activo TINYINT(1) NOT NULL,
	descripcion varchar (150)
);

CREATE TABLE IF NOT EXISTS rol(
	id_rol int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	nombre varchar(50) NOT NULL,
	codigo varchar(10) NOT NULL,
	descripcion varchar(150) NOT NULL,
	activo TINYINT(1) NOT NULL,
	aplicacion int(11) NOT NULL,
	CONSTRAINT fk_rol_aplicacion FOREIGN KEY (aplicacion) REFERENCES aplicacion(id_aplicacion)
);

CREATE TABLE IF NOT EXISTS usuario (
	id_usuario int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	correo varchar(150) NOT NULL,
	nombre varchar (75) NOT NULL,
	username varchar(50) NOT NULL ,
	password varchar(255) NOT NULL,
	direccion varchar(150),
	telefono varchar(15) NOT NULL,
	activo TINYINT(1) NOT NULL,
	reintentos int,
	bloqueado_hasta datetime,
	ultimo_inicio datetime,
	fecha_creacion datetime DEFAULT NOW(),
	fecha_modificacion datetime,
	creador int(11),
	modificador int(11),
	CONSTRAINT fk_usuario_creador FOREIGN KEY (creador) REFERENCES usuario(id_usuario),
	CONSTRAINT fk_usuario_modificador FOREIGN KEY (modificador) REFERENCES usuario(id_usuario)	
);


CREATE TABLE IF NOT EXISTS configuracion_usuario_rol(
	id_configuracion_usuario_rol int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	usuario int(11) NOT NULL,
	rol int(11) NOT NULL,
	activo tinyint(1) NOT NULL,
	por_defecto TINYINT(1) NOT NULL,
	CONSTRAINT fk_configuracion_usuario_rol_usuario FOREIGN KEY (usuario) REFERENCES usuario(id_usuario),
	CONSTRAINT fk_configuracion_usuario_rol_rol FOREIGN KEY (rol) REFERENCES rol (id_rol)
);