USE marcajes_db;

INSERT INTO marcajes_db.empleado (
    correo,
    id_auth,
    nombre,
    username,
    direccion,
    telefono
)
SELECT
    u.correo,
    u.id_usuario,
    u.nombre,
    u.username,
    u.direccion,
    u.telefono
FROM auth_db.configuracion_usuario_rol cur
JOIN auth_db.usuario u 
    ON u.id_usuario = cur.usuario
JOIN auth_db.rol r 
    ON r.id_rol = cur.rol
JOIN auth_db.aplicacion a 
    ON a.id_aplicacion = r.aplicacion
WHERE
    a.activo = 1
    AND r.activo = 1
    AND cur.activo = 1
    AND a.codigo = 'PMW'
    AND NOT EXISTS (
        SELECT 1
        FROM marcajes_db.empleado e
        WHERE e.id_auth = u.id_usuario
    )
GROUP BY
    u.id_usuario;


CREATE DATABASE IF NOT EXISTS cargas;