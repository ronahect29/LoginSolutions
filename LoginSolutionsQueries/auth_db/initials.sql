USE auth_db;

#ESTO ES OBLIGATORIO - LAS DESCRIPCIONES PUEDEN SER MODIFICADAS, EL NOMBRE, CODIGO Y ACTIVO DEBEN PERMANECER COMO ESTÁN
INSERT
	INTO
	auth_db.aplicacion
	(nombre,
	codigo,
	activo,
	descripcion)
VALUES ('admin-web', 'PAW',
1,
'Plataforma de administración de todos los sitemas');
INSERT
	INTO
	auth_db.aplicacion
	(nombre,
	codigo,
	activo,
	descripcion)
VALUES ('marcajes-web', 'PMW',
1,
'Plataforma de marcajes web para colaboradores y reportería para superiores');

SELECT * FROM auth_db.aplicacion a ;

INSERT
	INTO
	auth_db.rol (nombre,
	codigo,
	descripcion,
	activo,
	aplicacion)
VALUES ('superadmin',
'SA-PAW',
'Super administrador del sistema',
1,
(
SELECT
	a.id_aplicacion
FROM
	auth_db.aplicacion a
WHERE
	a.nombre = 'admin-web'));

INSERT
	INTO
	auth_db.rol (nombre,
	codigo,
	descripcion,
	activo,
	aplicacion)
VALUES ('colaborador',
'COL-PMW',
'Permiso para motorista colaborador',
1,
(
SELECT
	a.id_aplicacion
FROM
	auth_db.aplicacion a
WHERE
	a.nombre = 'marcajes-web'));


INSERT
	INTO
	auth_db.rol (nombre,
	codigo,
	descripcion,
	activo,
	aplicacion)
VALUES ('supervisor',
'SUP-PMW',
'Permiso para supervisor de colaboradores',
1,
(
SELECT
	a.id_aplicacion
FROM
	auth_db.aplicacion a
WHERE
	a.nombre = 'marcajes-web'));


#ESTO YA NO ES OBLIGATORIO
SELECT * FROM auth_db.rol;

INSERT
	INTO
	auth_db.usuario (
	correo,
	nombre,
	username,
	password,
	telefono,
	activo,
	reintentos,
	fecha_creacion
)
VALUES (
	'admin@system.com',
'administrador',
'admin',
	'$2a$12$jq04CGVeGohj.u5akxnnVu/zOQLLBLEc3B8fY1yF0ZMbBjJn9PO1S',
	'12345678',
1,
3,
NOW()
);

INSERT
	INTO
	auth_db.usuario (
	correo,
	nombre,
	username,
	password,
	telefono,
	activo,
	reintentos,
	fecha_creacion
)
VALUES (
	'moto1@gmail.com',
'motorista 1',
'moto 1',
	'$2a$12$jq04CGVeGohj.u5akxnnVu/zOQLLBLEc3B8fY1yF0ZMbBjJn9PO1S',
	'12345678',
1,
3,
NOW()
);

INSERT
	INTO
	auth_db.usuario (
	correo,
	nombre,
	username,
	password,
	telefono,
	activo,
	reintentos,
	fecha_creacion
)
VALUES (
	'supervisor1@gmail.com',
'Supervisor A',
'SUP-A',
	'$2a$12$jq04CGVeGohj.u5akxnnVu/zOQLLBLEc3B8fY1yF0ZMbBjJn9PO1S',
	'12345678',
1,
3,
NOW()
);


SELECT * FROM auth_db.usuario u;

INSERT
	INTO
	auth_db.configuracion_usuario_rol (
		usuario,
		rol,
		activo,
		por_defecto
	)
VALUES (
	1,
	1,
	1,
	1
);
INSERT
	INTO
	auth_db.configuracion_usuario_rol (
		usuario,
		rol,
		activo,
		por_defecto
	)
VALUES (
		2,
		2,
		1,
		1
);
INSERT
	INTO
	auth_db.configuracion_usuario_rol (
		usuario,
		rol,
		activo,
		por_defecto
	)
VALUES (
		3,
		3,
		1,
		1
);
SELECT * FROM auth_db.aplicacion a ;
SELECT * FROM auth_db.rol r ;
SELECT * FROM auth_db.usuario u;
SELECT * FROM auth_db.configuracion_usuario_rol cur;




SELECT user, host FROM mysql.user;

SELECT user, host, plugin FROM mysql.user WHERE user='auth_user';


