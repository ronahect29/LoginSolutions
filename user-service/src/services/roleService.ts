import pool from "../db/pool";

export async function getRolesByApp(appCode: string) {
  const [appRows]: any = await pool.query(
    "SELECT id_aplicacion FROM auth_db.aplicacion WHERE codigo = ?",
    [appCode]
  );

  if (appRows.length === 0) {
    return { status: 404, body: { message: "Aplicación no encontrada" } };
  }

  const appId = appRows[0].id;

  const [roles]: any = await pool.query(
    "SELECT id_rol, codigo, nombre, descripcion FROM auth_db.rol WHERE aplicacion = ?",
    [appId]
  );

  return roles;
}

export async function createRole(data: any) {
  const { code, name, description, appCode } = data;

  if (!code || !name || !description || !appCode) {
    return { status: 400, body: { message: "code, name, description y appCode son requeridos" } };
  }

  const [app]: any = await pool.query(
    "SELECT id_aplicacion FROM auth_db.aplicacion WHERE codigo = ?",
    [appCode]
  );

  if (app.length === 0) {
    return { status: 404, body: { message: "Aplicación no encontrada" } };
  }

  const appId = app[0].id;

  await pool.query(
    "INSERT INTO auth_db.rol (codigo, nombre, descripcion, aplicacion, activo) VALUES (?, ?, ?, ?, 1)",
    [code, name, description, appId]
  );

  return { status: 201, body: { message: "Rol creado correctamente" } };
}


export async function deleteRole(roleId: number) {
  const [del]: any = await pool.query(
    "UPDATE auth_db.rol SET activo = 0 WHERE id_rol = ?",
    [roleId]
  );

  if (del.affectedRows === 0) {
    return { status: 404, body: { message: "Rol no encontrado" } };
  }

  return { status: 200, body: { message: "Rol eliminado correctamente" } };
}
