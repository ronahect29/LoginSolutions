import {
    ConfiguracionUsuarioRolService
} from "./configuracionUsuarioRol.service";

import {
    UsuarioService
} from "./usuario.service";

import {
    comparePassword
} from "../utils/hash";

import {
    signToken
} from "../utils/jwt";

import {
    prisma
} from "../prisma";

import {
    type UsuarioSesionDto
} from "../models/Usuario";

import {
    type JwtPayload
} from "../types";


function obtenerNombreAplicacion(
    codigo:
        string
): string {
    switch (
        codigo
            .trim()
            .toUpperCase()
    ) {
        case "PAW":
            return "Plataforma de Administración";

        case "PMW":
            return "Plataforma de Marcajes";

        default:
            return "esta plataforma";
    }
}


// ======================================================
// LOGIN
// ======================================================

export async function login(
    data:
        any
) {
    const correo =
        typeof data?.correo ===
            "string"
            ? data.correo
                .trim()
                .toLowerCase()
            : "";

    const password =
        typeof data?.password ===
            "string"
            ? data.password
            : "";

    const app =
        typeof data?.app ===
            "string"
            ? data.app
                .trim()
                .toUpperCase()
            : "";


    // ======================================================
    // VALIDACIÓN DE CAMPOS
    // ======================================================

    if (
        !correo ||
        !password ||
        !app
    ) {
        return {
            status:
                400,

            body: {
                code:
                    "MISSING_FIELDS",

                message:
                    "Ingresa tu correo y contraseña."
            }
        };
    }


    // ======================================================
    // APLICACIÓN
    // ======================================================

    const aplicacion =
        await prisma.aplicacion
            .findFirst({
                where: {
                    codigo:
                        app,

                    activo:
                        true
                },

                select: {
                    id_aplicacion:
                        true,

                    nombre:
                        true,

                    codigo:
                        true,

                    activo:
                        true
                }
            });


    if (!aplicacion) {
        console.log(
            "sesionService - Aplicación no disponible:",
            app
        );

        return {
            status:
                403,

            body: {
                code:
                    "APP_UNAVAILABLE",

                message:
                    `${obtenerNombreAplicacion(
                        app
                    )} se encuentra temporalmente deshabilitada o no está disponible.`
            }
        };
    }


    // ======================================================
    // USUARIO
    //
    // IMPORTANTE:
    // Se consulta sin filtrar por activo para poder distinguir
    // una cuenta inactiva DESPUÉS de validar la contraseña.
    // ======================================================

    const usuario =
        await prisma.usuario
            .findFirst({
                where: {
                    correo
                }
            });


    /*
     * Por seguridad no indicamos si el correo existe.
     * Correo inexistente y contraseña incorrecta deben
     * producir exactamente la misma respuesta.
     */
    if (!usuario) {
        console.log(
            "sesionService - Intento con credenciales inválidas"
        );

        return {
            status:
                401,

            body: {
                code:
                    "INVALID_CREDENTIALS",

                message:
                    "Correo o contraseña incorrectos."
            }
        };
    }


    // ======================================================
    // CONTRASEÑA
    // ======================================================

    const passwordCorrecto =
        await comparePassword(
            password,
            usuario.password
        );


    if (
        !passwordCorrecto
    ) {
        console.log(
            "sesionService - Intento con credenciales inválidas"
        );

        return {
            status:
                401,

            body: {
                code:
                    "INVALID_CREDENTIALS",

                message:
                    "Correo o contraseña incorrectos."
            }
        };
    }


    // ======================================================
    // ESTADO DEL USUARIO
    // ======================================================

    if (
        usuario.activo !==
        true
    ) {
        console.log(
            "sesionService - Usuario inactivo:",
            usuario.id_usuario
        );

        return {
            status:
                403,

            body: {
                code:
                    "USER_INACTIVE",

                message:
                    "Tu cuenta se encuentra inactiva. Contacta al administrador del sistema."
            }
        };
    }


    // ======================================================
    // ROLES PARA LA APLICACIÓN SOLICITADA
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
        console.log(
            "sesionService - Usuario sin acceso:",
            usuario.id_usuario,
            aplicacion.codigo
        );

        return {
            status:
                403,

            body: {
                code:
                    "APP_ACCESS_DENIED",

                message:
                    `Tu cuenta no tiene acceso a la ${obtenerNombreAplicacion(
                        aplicacion.codigo
                    )}.`
            }
        };
    }


    // ======================================================
    // ROLES DEL TOKEN
    // ======================================================

    const rolesToken:
        string[] =
        roles.map(
            (
                role
            ) =>
                role.codigo
        );


    // ======================================================
    // TOKEN
    // ======================================================

    const token =
        signToken({
            id_usuario:
                usuario.id_usuario,

            correo:
                usuario.correo,

            app:
                aplicacion.codigo,

            roles:
                rolesToken
        });


    // ======================================================
    // RESPUESTA DEL USUARIO
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

        roles
    } as UsuarioSesionDto;


    console.log(
        "sesionService - Inicio de sesión correcto:",
        {
            id_usuario:
                usuario.id_usuario,

            app:
                aplicacion.codigo,

            roles:
                rolesToken
        }
    );


    return {
        status:
            200,

        body: {
            accessToken:
                token,

            empleado:
                usuarioResponse
        }
    };
}


// ======================================================
// VALIDACIÓN DE SESIÓN ACTIVA
// ======================================================

export async function validateSession(
    payload:
        JwtPayload |
        undefined
) {
    if (!payload) {
        return {
            status:
                401,

            body: {
                valid:
                    false,

                code:
                    "INVALID_SESSION",

                message:
                    "La sesión no es válida."
            }
        };
    }


    // ======================================================
    // USUARIO
    // ======================================================

    const usuario =
        await UsuarioService
            .findOne(
                payload.id_usuario
            );


    if (!usuario) {
        return {
            status:
                401,

            body: {
                valid:
                    false,

                code:
                    "INVALID_SESSION",

                message:
                    "La sesión no es válida."
            }
        };
    }


    if (
        usuario.activo !==
        true
    ) {
        return {
            status:
                401,

            body: {
                valid:
                    false,

                code:
                    "USER_INACTIVE",

                message:
                    "Tu cuenta se encuentra inactiva."
            }
        };
    }


    // ======================================================
    // APLICACIÓN
    // ======================================================

    const aplicacion =
        await prisma.aplicacion
            .findFirst({
                where: {
                    codigo:
                        payload.app,

                    activo:
                        true
                },

                select: {
                    id_aplicacion:
                        true,

                    codigo:
                        true
                }
            });


    if (!aplicacion) {
        return {
            status:
                403,

            body: {
                valid:
                    false,

                code:
                    "APP_UNAVAILABLE",

                message:
                    `${obtenerNombreAplicacion(
                        payload.app
                    )} se encuentra temporalmente deshabilitada.`
            }
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
                (
                    role
                ) =>
                    role.codigo
            )
        );


    const tieneRolActivo =
        payload.roles.some(
            (
                codigo
            ) =>
                rolesActivos.has(
                    codigo
                )
        );


    if (
        !tieneRolActivo
    ) {
        return {
            status:
                403,

            body: {
                valid:
                    false,

                code:
                    "APP_ACCESS_REVOKED",

                message:
                    `Ya no tienes acceso a la ${obtenerNombreAplicacion(
                        payload.app
                    )}. Inicia sesión nuevamente o contacta al administrador.`
            }
        };
    }


    // ======================================================
    // SESIÓN VÁLIDA
    // ======================================================

    return {
        status:
            200,

        body: {
            valid:
                true,

            app:
                payload.app,

            id_usuario:
                payload.id_usuario
        }
    };
}


// ======================================================
// LOGOUT
// ======================================================

export async function logout(
    _data:
        any
) {
    return {
        status:
            200,

        body: {
            message:
                "Logout exitoso."
        }
    };
}