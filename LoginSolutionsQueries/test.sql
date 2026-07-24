## ENCONTRAR LOS ROLES DEL USUARIO

SELECT
	r.id_rol 
FROM
	auth_db.configuracion_usuario_rol cur
JOIN auth_db.rol r ON
	cur.rol = r.id_rol
JOIN auth_db.aplicacion a ON
	r.aplicacion = a.id_aplicacion
JOIN auth_db.usuario u ON
	cur.usuario = u.id_usuario
WHERE
	u.id_usuario = ?
	AND a.codigo = ?
	AND r.activo = 1
	AND a.activo = 1;



SELECT
	r.id_rol, r.codigo
FROM
	auth_db.configuracion_usuario_rol cur
JOIN auth_db.rol r ON
	cur.rol = r.id_rol
JOIN auth_db.aplicacion a ON
	r.aplicacion = a.id_aplicacion
JOIN auth_db.usuario u ON
	cur.usuario = u.id_usuario
WHERE
	u.id_usuario = 1
	AND a.codigo = 'PAW'
	AND r.activo = 1
	AND a.activo = 1;

SELECT * FROM auth_db.configuracion_usuario_rol;
SELECT * from auth_db.rol r ;
SELECT * FROM auth_db.usuario u;

SELECT * FROM marcajes_db.marcaje m;
SELECT * FROM marcajes_db.sucursal s;

SELECT
  (SELECT COUNT(*) FROM auth_db.usuario u WHERE u.activo = 1) AS total_usuarios,
  (SELECT COUNT(*) FROM auth_db.rol r WHERE r.activo = 1) AS total_roles,
  (SELECT COUNT(*) FROM auth_db.aplicacion a WHERE a.activo = 1) AS total_aplicaciones;