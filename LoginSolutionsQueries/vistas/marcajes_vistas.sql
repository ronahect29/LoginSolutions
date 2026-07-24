USE marcajes_db;

CREATE OR REPLACE VIEW marcajes_db.vw_marcajes AS
SELECT
	MIN(m.id_marcaje) AS id_marcaje,
	m.fecha,
	MIN(CASE WHEN m.es_entrada = 1 THEN m.hora END) AS hora_entrada,
	MAX(CASE WHEN m.es_entrada = 0 THEN m.hora END) AS hora_salida,
	SEC_TO_TIME(
        TIMESTAMPDIFF(
            SECOND,
            MIN(CASE WHEN m.es_entrada = 1 THEN m.hora END),
            MAX(CASE WHEN m.es_entrada = 0 THEN m.hora END)
        )
    ) AS horas_trabajadas,
	MIN(
        CASE 
            WHEN m.es_entrada = 1 
            THEN CONCAT('https://www.google.com/maps?q=', m.latitud, ',', m.longitud)
        END
    ) AS ubicacion_entrada,
	MAX(
        CASE 
            WHEN m.es_entrada = 0 
            THEN CONCAT('https://www.google.com/maps?q=', m.latitud, ',', m.longitud)
        END
    ) AS ubicacion_salida,
	e.id_empleado AS empleado_id,
	e.jefe AS empleado_jefe,
	e.nombre AS empleado_nombre,
	e.correo AS empleado_correo,
	s.id_sucursal AS sucursal_id,
	s.nombre AS sucursal_nombre,
	CONCAT('https://www.google.com/maps?q=', s.latitud, ',', s.longitud)
                         AS sucursal_ubicacion,
	MIN(CASE WHEN m.es_entrada = 1 THEN m.latitud END) AS lat_entrada,
	MIN(CASE WHEN m.es_entrada = 1 THEN m.longitud END) AS lng_entrada,
	MAX(CASE WHEN m.es_entrada = 0 THEN m.latitud END) AS lat_salida,
	MAX(CASE WHEN m.es_entrada = 0 THEN m.longitud END) AS lng_salida,
	s.latitud AS sucursal_latitud,
	s.longitud AS sucursal_longitud
FROM
	marcajes_db.marcaje m
JOIN marcajes_db.empleado e 
    ON
	m.empleado = e.id_empleado
LEFT JOIN marcajes_db.sucursal s 
    ON
	e.sucursal = s.id_sucursal
GROUP BY
	m.fecha,
	m.empleado,
	e.id_empleado,
	e.jefe,
	e.nombre,
	e.correo,
	s.id_sucursal,
	s.nombre,
	s.direccion;


SELECT * FROM marcajes_db.vw_marcajes;