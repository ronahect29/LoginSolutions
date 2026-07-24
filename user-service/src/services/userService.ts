import pool from "../db/pool";

export async function getAllUsers() {
  const [rows]: any = await pool.query(`
    SELECT id_usuario, correo, nombre, activo, fecha_creacion
    FROM auth_db.usuario
  `);

  return rows;
}

export async function getUserById(id: number) {
  const [rows]: any = await pool.query(
    "SELECT id_usuario, correo, nombre, activo, fecha_creacion FROM auth_db.usuario WHERE id_usuario = ?",
    [id]
  );

  if (rows.length === 0) return null;

  // roles del usuario
  const [roleRows]: any = await pool.query(
    `SELECT r.id_rol, r.codigo, r.nombre, a.codigo AS app_codigo
     FROM auth_db.configuracion_usuario_rol cur
     JOIN auth_db.rol r ON cur.rol = r.id_rol
     JOIN auth_db.aplicacion a ON r.aplicacion = a.id_aplicacion
     WHERE cur.usuario = ?`,
    [id]
  );

  return {
    ...rows[0],
    roles: roleRows
  };
}

export async function assignRole(userId: number, roleId: number) {
  // validar rol existente
  const [role]: any = await pool.query(
    "SELECT id_rol FROM auth_db.rol WHERE id_rol = ?",
    [roleId]
  );

  if (role.length === 0) {
    return { status: 404, body: { message: "Rol no encontrado" } };
  }

  // validar usuario existente
  const [user]: any = await pool.query(
    "SELECT id_usuario FROM auth_db.usuario WHERE id_usuario = ?",
    [userId]
  );

  if (user.length === 0) {
    return { status: 404, body: { message: "Usuario no encontrado" } };
  }

  // verificar si ya tiene ese rol
  const [exists]: any = await pool.query(
    `SELECT * FROM auth_db.configuracion_usuario_rol cur
     WHERE cur.usuario = ? AND cur.rol = ? AND cur.activo = 1`,
    [userId, roleId]
  );

  if (exists.length > 0) {
    return { status: 409, body: { message: "El usuario ya tiene este rol" } };
  }

  await pool.query(
    "INSERT INTO auth_db.configuracion_usuario_rol (usuario, rol) VALUES (?, ?)",
    [userId, roleId]
  );

  return { status: 201, body: { message: "Rol asignado correctamente" } };
}

export async function removeRole(userId: number, roleId: number) {
  const [result]: any = await pool.query(
    `UPDATE auth_db.configuracion_usuario_rol
     SET activo = 0
     WHERE usuario = ? AND rol = ?`,
    [userId, roleId]
  );

  if (result.affectedRows === 0) {
    return { status: 404, body: { message: "El rol no estaba asignado al usuario" } };
  }

  return { status: 200, body: { message: "Rol removido correctamente" } };
}
