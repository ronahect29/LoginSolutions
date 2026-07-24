CREATE DATABASE IF NOT EXISTS auth_db;
CREATE DATABASE IF NOT EXISTS marcajes_db;

-- Usuario con permisos solo para auth_db
CREATE USER IF NOT EXISTS 'auth_user'@'%' IDENTIFIED BY 'strong_auth_password';
GRANT ALL PRIVILEGES ON auth_db.* TO 'auth_user'@'%';

-- Usuario con permisos solo para marcajes_db
CREATE USER IF NOT EXISTS 'marcajes_user'@'%' IDENTIFIED BY 'strong_marcajes_password';
GRANT ALL PRIVILEGES ON marcajes_db.* TO 'marcajes_user'@'%';

FLUSH PRIVILEGES;


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



CREATE DATABASE IF NOT EXISTS marcajes_db;
USE marcajes_db;
#MOTORISTAS
CREATE TABLE IF NOT EXISTS sucursal(
	id_sucursal int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	nombre varchar(150) NOT NULL,
	telefono varchar(10),
	direccion varchar(100),
	latitud decimal(9, 6),
	longitud decimal(9, 6),
	activo TINYINT(1),
	fecha_creacion datetime NOT NULL DEFAULT NOW(),
	creador varchar(50) NOT NULL,
	fecha_modificacion datetime,
	modificador varchar(50)
);

CREATE TABLE IF NOT EXISTS empleado(
	id_empleado int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	id_auth int(11) NOT NULL,
	correo varchar(150) NOT NULL,
	nombre varchar (75) NOT NULL,
	username varchar(50) NOT NULL,
	direccion varchar(150),
	telefono varchar(15),
	sucursal int(11),
	jefe int(11),
	CONSTRAINT fk_empleado_sucursal FOREIGN KEY (sucursal) REFERENCES sucursal(id_sucursal),
	CONSTRAINT fk_empleado_jefe FOREIGN KEY (jefe) REFERENCES empleado(id_empleado)
);


CREATE TABLE IF NOT EXISTS  marcaje(
	id_marcaje int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	fecha datetime NOT NULL,
	hora varchar(8) NOT NULL,
	es_entrada TINYINT(1) NOT NULL,
	latitud decimal(9,6),
	longitud decimal(9,6),
	empleado int(11) NOT NULL,
	CONSTRAINT fk_marcaje_empleado FOREIGN KEY (empleado) REFERENCES empleado(id_empleado)
);
