import pool from "../db/pool";

export async function getApps() {
  const [rows]: any = await pool.query(
    "SELECT id_aplicacion, codigo, nombre, descripcion, activo FROM auth_db.aplicacion"
  );
  return rows;
}

export async function createApp(data: any) {
  const { code, name, description } = data;

  if (!code || !name || !description) {
    return { status: 400, body: { message: "code, name y description son requeridos" } };
  }

  const [exists]: any = await pool.query(
    "SELECT id_aplicacion FROM auth_db.aplicacion WHERE codigo = ? AND activo = 1",
    [code]
  );

  if (exists.length > 0) {
    return { status: 409, body: { message: "La app ya existe" } };
  }

  await pool.query(
    "INSERT INTO auth_db.aplicacion (codigo, nombre, activo, descripcion) VALUES (?, ?, 1, ?)",
    [code, name, description]
  );

  return { status: 201, body: { message: "Aplicación creada correctamente" } };
}

export async function deleteApp(id: number) {
  const [del]: any = await pool.query(
    "UPDATE auth_db.aplicacion SET activo = 0 WHERE id_aplicacion = ?",
    [id]
  );

  if (del.affectedRows === 0) {
    return { status: 404, body: { message: "App no encontrada" } };
  }

  return { status: 200, body: { message: "App eliminada correctamente" } };
}
