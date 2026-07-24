import { ConfiguracionUsuarioRolController } from "../controllers/configuracionUsuarioRol.controller";
import { signToken } from "../utils/jwt";
import { ConfiguracionUsuarioRolService } from "./configuracionUsuarioRol.service";
import { UsuarioService } from "./usuario.service";
import { UsuarioSesionDto } from "../models/Usuario";
import { comparePassword } from "../utils/hash";

export async function login(data: any) {
    const { correo, password, app } = data;
    console.log("sesionService login data:", data);
    if (!correo || !password || !app) {
        console.log("sesionService-Datos incompletos");
        return { status: 400, body: { message: "Datos incompletos" } };
    }

    const usuario = await UsuarioService.findByCorreoAndActivo(correo, true);
    if (!usuario) {
        console.log("sesionService - Usuario no encontrado")
        return { status: 404, body: { message: "Usuario no encontrado" } };
    };
    const ok = await comparePassword(password, usuario.password);
    if (!ok) {
        console.log("sesionService - Credenciales inválidas");
        return { status: 401, body: { message: "Credenciales inválidas" } };
    }
    if (!usuario.activo) {
        console.log("sesionService - Usuario no activo en esta aplicación")
        return { status: 403, body: { message: "Usuario no activo en esta aplicación" } };
    }
    console.log("sesionService-USUARIO: ", usuario)
    const roles = await ConfiguracionUsuarioRolService.findRolesByUsuarioIdAndAplicacionCodigo(usuario.id_usuario, app);
    const rolesToken: string[] = roles.map(r => r.codigo);
    if (roles.length === 0) return { status: 403, body: { message: "Usuario no tiene roles asignados para la aplicación" } };
    const token = signToken({
        id_usuario: usuario.id_usuario,
        correo: correo,
        app: app,
        roles: rolesToken
    });
    const usuarioResponse = {
        id_usuario: usuario.id_usuario,
        nombre: usuario.nombre,
        username: usuario.username,
        correo: usuario.correo,
        activo: usuario.activo,
        roles: roles
    } as UsuarioSesionDto;
    console.log("USUARIO LOGUEADO :", usuarioResponse);
    return { status: 200, body: { accessToken: token, empleado: usuarioResponse } };
}
export async function logout(_data: any) {
    return {
        status: 200,
        body: { message: "Logout exitoso." }
    };
}