CREATE DATABASE IF NOT EXISTS marcajes_db;
USE marcajes_db;
#MOTORISTAS
CREATE TABLE IF NOT EXISTS sucursal(
	id_sucursal int(11) NOT NULL PRIMARY KEY AUTO_INCREMENT,
	nombre varchar(150) NOT NULL,
	telefono varchar(10),
	direccion varchar(200),
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
