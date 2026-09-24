import {
    ConfiguracionUsuarioRolService,
} from "./configuracionUsuarioRol.service";
import {
    UsuarioService,
} from "./usuario.service";
import {
    comparePassword,
} from "../utils/hash";
import {
    signToken,
} from "../utils/jwt";
import {
    prisma,
} from "../prisma";
import {
    type UsuarioSesionDto,
} from "../models/Usuario";
import {
    type JwtPayload,
} from "../types";

// ======================================================
// LOGIN
// ======================================================

export async function login(
    data: any
) {
    const {
        correo,
        password,
        app,
    } = data;

    console.log(
        "sesionService login data:",
        data
    );

    // ======================================================
    // VALIDACIÓN DE DATOS
    // ======================================================

    if (
        !correo ||
        !password ||
        !app
    ) {
        console.log(
            "sesionService - Datos incompletos"
        );

        return {
            status: 400,
            body: {
                message:
                    "Datos incompletos",
            },
        };
    }

    // ======================================================
    // APLICACIÓN
    // ======================================================

    const aplicacion =
        await prisma.aplicacion.findFirst({
            where: {
                codigo:
                    String(
                        app
                    ).toUpperCase(),

                activo: true,
            },

            select: {
                id_aplicacion: true,
                nombre: true,
                codigo: true,
                activo: true,
            },
        });

    if (!aplicacion) {
        console.log(
            "sesionService - Aplicación deshabilitada o inexistente:",
            app
        );

        return {
            status: 403,

            body: {
                message:
                    "La aplicación se encuentra deshabilitada o no está disponible.",
            },
        };
    }

    // ======================================================
    // USUARIO
    // ======================================================

    const usuario =
        await UsuarioService
            .findByCorreoAndActivo(
                correo,
                true
            );

    if (!usuario) {
        console.log(
            "sesionService - Usuario no encontrado"
        );

        return {
            status: 404,

            body: {
                message:
                    "Usuario no encontrado",
            },
        };
    }

    // ======================================================
    // CONTRASEÑA
    // ======================================================

    const ok =
        await comparePassword(
            password,
            usuario.password
        );

    if (!ok) {
        console.log(
            "sesionService - Credenciales inválidas"
        );

        return {
            status: 401,

            body: {
                message:
                    "Credenciales inválidas",
            },
        };
    }

    if (!usuario.activo) {
        console.log(
            "sesionService - Usuario inactivo"
        );

        return {
            status: 403,

            body: {
                message:
                    "Usuario inactivo",
            },
        };
    }

    // ======================================================
    // ROLES
    // ======================================================

    const roles =
        await ConfiguracionUsuarioRolService
            .findRolesByUsuarioIdAndAplicacionCodigo(
                usuario.id_usuario,
                aplicacion.codigo
            );

    if (
        roles.length ===
        0
    ) {
        return {
            status: 403,

            body: {
                message:
                    "Usuario no tiene roles activos asignados para la aplicación.",
            },
        };
    }

    const rolesToken:
        string[] =
        roles.map(
            (role) =>
                role.codigo
        );

    // ======================================================
    // TOKEN
    // ======================================================

    const token =
        signToken({
            id_usuario:
                usuario.id_usuario,

            correo,

            app:
                aplicacion.codigo,

            roles:
                rolesToken,
        });

    // ======================================================
    // RESPUESTA
    // ======================================================

    const usuarioResponse = {
        id_usuario:
            usuario.id_usuario,

        nombre:
            usuario.nombre,

        username:
            usuario.username,

        correo:
            usuario.correo,

        activo:
            usuario.activo,

        roles,
    } as UsuarioSesionDto;

    console.log(
        "USUARIO LOGUEADO:",
        usuarioResponse
    );

    return {
        status: 200,

        body: {
            accessToken:
                token,

            empleado:
                usuarioResponse,
        },
    };
}

// ======================================================
// VALIDACIÓN DE SESIÓN ACTIVA
// ======================================================

export async function validateSession(
    payload:
        JwtPayload | undefined
) {
    // ======================================================
    // TOKEN
    // ======================================================

    if (!payload) {
        return {
            status: 401,

            body: {
                valid: false,

                message:
                    "Sesión inválida.",
            },
        };
    }

    // ======================================================
    // USUARIO
    // ======================================================

    const usuario =
        await UsuarioService.findOne(
            payload.id_usuario
        );

    if (
        !usuario ||
        !usuario.activo
    ) {
        return {
            status: 401,

            body: {
                valid: false,

                message:
                    "El usuario se encuentra inactivo.",
            },
        };
    }

    // ======================================================
    // APLICACIÓN
    // ======================================================

    const aplicacion =
        await prisma.aplicacion.findFirst({
            where: {
                codigo:
                    payload.app,

                activo: true,
            },

            select: {
                id_aplicacion:
                    true,

                codigo:
                    true,
            },
        });

    if (!aplicacion) {
        return {
            status: 403,

            body: {
                valid: false,

                message:
                    "La aplicación se encuentra deshabilitada.",
            },
        };
    }

    // ======================================================
    // ROLES ACTIVOS
    // ======================================================

    const roles =
        await ConfiguracionUsuarioRolService
            .findRolesByUsuarioIdAndAplicacionCodigo(
                payload.id_usuario,
                payload.app
            );

    const rolesActivos =
        new Set(
            roles.map(
                (role) =>
                    role.codigo
            )
        );

    const tieneRolActivo =
        payload.roles.some(
            (codigo) =>
                rolesActivos.has(
                    codigo
                )
        );

    if (!tieneRolActivo) {
        return {
            status: 403,

            body: {
                valid: false,

                message:
                    "El usuario ya no posee acceso activo a esta aplicación.",
            },
        };
    }

    // ======================================================
    // SESIÓN VÁLIDA
    // ======================================================

    return {
        status: 200,

        body: {
            valid: true,

            app:
                payload.app,

            id_usuario:
                payload.id_usuario,
        },
    };
}

// ======================================================
// LOGOUT
// ======================================================

export async function logout(
    _data: any
) {
    return {
        status: 200,

        body: {
            message:
                "Logout exitoso.",
        },
    };
}