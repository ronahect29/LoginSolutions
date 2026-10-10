import type {
    Request,
    Response
} from "express";

import {
    proxyLogin
} from "../services/authProxyService";

import {
    ES_LOCAL
} from "../utils/utilidades";

import {
    EmpleadoService
} from "../services/empleado.service";


export async function login(
    req:
        Request,

    res:
        Response
) {
    const {
        correo,
        password,
        app
    } =
        req.body;


    // ======================================================
    // CAMPOS
    // ======================================================

    if (
        typeof correo !==
            "string" ||
        !correo.trim() ||
        typeof password !==
            "string" ||
        !password ||
        typeof app !==
            "string" ||
        !app.trim()
    ) {
        return res
            .status(400)
            .json({
                code:
                    "MISSING_FIELDS",

                message:
                    "Ingresa tu correo y contraseña."
            });
    }


    if (
        ES_LOCAL
    ) {
        console.log(
            "AUTHCONTROLLER - Validando autenticación central"
        );
    }


    // ======================================================
    // AUTENTICACIÓN Y AUTORIZACIÓN CENTRAL
    // ======================================================

    const result =
        await proxyLogin(
            correo.trim(),
            password,
            app.trim()
        );


    if (
        !result.ok
    ) {
        if (
            ES_LOCAL
        ) {
            console.log(
                "AUTHCONTROLLER - Login rechazado:",
                result.error
                    .code,
                result.status
            );
        }


        /*
         * Conservamos el status del user-service.
         *
         * 401 = credenciales
         * 403 = estado/permisos
         * 503 = servicio no disponible
         */
        return res
            .status(
                result.status
            )
            .json(
                result.error
            );
    }


    // ======================================================
    // PERFIL OPERATIVO DE MARCAJES
    // ======================================================

    const empleado =
        await EmpleadoService
            .findByCorreo(
                correo.trim()
            );


    if (!empleado) {
        console.error(
            "AUTHCONTROLLER - Usuario autorizado para PMW sin perfil de empleado:",
            result.data
                .empleado
                .id_usuario
        );


        return res
            .status(403)
            .json({
                code:
                    "PLATFORM_PROFILE_MISSING",

                message:
                    "Tu acceso a la Plataforma de Marcajes no está completamente configurado. Contacta al administrador."
            });
    }


    if (
        empleado.activo !==
        true
    ) {
        return res
            .status(403)
            .json({
                code:
                    "PLATFORM_PROFILE_INACTIVE",

                message:
                    "Tu perfil de Marcajes se encuentra inactivo. Contacta al administrador."
            });
    }


    // ======================================================
    // LOGIN CORRECTO
    // ======================================================

    if (
        ES_LOCAL
    ) {
        console.log(
            "AUTHCONTROLLER - Login correcto:",
            {
                id_usuario:
                    result.data
                        .empleado
                        .id_usuario,

                id_empleado:
                    empleado.id_empleado
            }
        );
    }


    return res
        .status(200)
        .json({
            ...result.data,

            empleado: {
                ...result.data
                    .empleado,

                id_empleado:
                    empleado.id_empleado
            }
        });
}