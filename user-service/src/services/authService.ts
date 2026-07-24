import { hash } from "crypto";
import pool from "../db/pool";
import { hashPassword, comparePassword } from "../utils/hash";
import { signToken } from "../utils/jwt";
import { access } from "fs";

export async function register(data: any) {
    const { email, password, nombre, username, telefono, activo, reintentos, fecha_creacion } = data;
    if (!email || !password || !nombre || !username || !telefono) return { status: 400, body: { message: "Datos incompletos" } };

    const [exists]: any = await pool.query(
        "SELECT id_usuario FROM auth_db.usuario WHERE correo = ?", [email]);
    if (exists.length > 0) return { status: 409, body: { message: "El correo ya está registrado" } };

    const hash = await hashPassword(password);

    const [result]: any = await pool.query(
        "INSERT INTO auth_db.usuario " +
        "(correo, nombre, username, password, " +
        "telefono, activo, reintentos, fecha_creacion) " +
        "VALUES (?, ?, ?, ?, ? , 1, 3, NOW())",
        [email, nombre, username, hash, telefono]);

    return { status: 201, body: { message: "Usuario registrado exitosamente", userId: result.insertId } };
}

export async function login(data: any) {
    const { correo, password, app } = data;
    console.log("AuthService login data:", data);
    if (!correo || !password || !app) return { status: 400, body: { message: "Datos incompletos" } };

    const [rows]: any = await pool.query(
        "SELECT id_usuario, password, activo FROM auth_db.usuario WHERE correo = ?", [correo]);
    if (rows.length === 0) return { status: 404, body: { message: "Credenciales inválidas" } };

    const user = rows[0];

    const ok = await comparePassword(password, user.password);
    if (!ok) return { status: 401, body: { message: "Credenciales inválidas" } };
    if (user.activo === 0) return { status: 403, body: { message: "Usuario inactivo" } };

    const [rolesRows]: any = await pool.query(
        `SELECT
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
	u.id_usuario = ?
	AND a.codigo = ?
	AND r.activo = 1
	AND a.activo = 1;`, [user.id_usuario, app]);

    const roles = rolesRows.map((r: any) => r.codigo);

    const apps = [...new Set(rolesRows.map((r: any) => r.aplicacion))];

    // const token = signToken({
    //     id_usuario: user.id_usuario,
    //     correo: correo,
    //     app: app,
    //    // roles: roles
    // });
    // console.log("USUARIO :", user);
    // const usuario = {
    //     user,
    //     roles
    // }
    // return { status: 200, body: { accessToken: token, usuario } };
}



export async function logout(_data: any) {
  return {
    status: 200,
    body: { message: "Logout exitoso." }
  };
}
