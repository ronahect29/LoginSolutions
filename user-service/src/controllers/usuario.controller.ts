import { Request, Response } from "express";
import bcrypt from "bcryptjs";

import { UsuarioService } from "../services/usuario.service";
import { MarcajesIntegrationService } from "../services/marcajesIntegration.service";

import { BuscarUsuariosDto } from "../models/Usuario";
import { prisma } from "../prisma";
import { AuthRequest } from "../types/AuthRequest";
import { ES_LOCAL } from "../utils/constantes";

const SALT_ROUNDS = 10;

export const UsuarioController = {
    async getAll(_req: Request, res: Response) {
        try {
            const data = await UsuarioService.findAll();

            return res.status(200).json(data);
        } catch (error) {
            console.error("UsuarioController.getAll:", error);

            return res.status(500).json({
                message: "Error interno"
            });
        }
    },

    async findByUsuarioId(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);

            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    message: "ID de usuario inválido"
                });
            }

            const data = await UsuarioService.findOne(id);

            if (!data) {
                return res.status(404).json({
                    message: "Usuario no encontrado"
                });
            }

            return res.status(200).json(data);
        } catch (error) {
            console.error("UsuarioController.findByUsuarioId:", error);

            return res.status(500).json({
                message: "Error interno"
            });
        }
    },

    async findAllWithRolesAndApps(_req: Request, res: Response) {
        try {
            const data = await UsuarioService.findAllWithRolesAndApp();

            return res.status(200).json(data);
        } catch (error) {
            console.error(
                "UsuarioController.findAllWithRolesAndApps:",
                error
            );

            return res.status(500).json({
                message: "Error interno"
            });
        }
    },

    async changeUsuarioActivoById(
        req: AuthRequest,
        res: Response
    ) {
        const idUsuario = Number(req.params.id);
        const { activo } = req.body;

        if (!Number.isInteger(idUsuario) || idUsuario <= 0) {
            return res.status(400).json({
                message: "ID de usuario inválido"
            });
        }

        if (typeof activo !== "boolean") {
            return res.status(400).json({
                message: "El campo 'activo' debe ser booleano"
            });
        }

        try {
            const usuario = await prisma.usuario.findFirst({
                where: {
                    id_usuario: idUsuario
                },
                select: {
                    id_usuario: true
                }
            });

            if (!usuario) {
                return res.status(404).json({
                    message: "Usuario no encontrado"
                });
            }

            if (ES_LOCAL) {
                console.log(
                    "UsuarioController.changeUsuarioActivoById - modificador:",
                    req.user?.id_usuario
                );
            }

            await UsuarioService.changeUsuarioActivoById(
                idUsuario,
                activo,
                req.user?.id_usuario || 0
            );

            return res.status(200).json({
                success: true
            });
        } catch (error) {
            console.error(
                "UsuarioController.changeUsuarioActivoById:",
                error
            );

            return res.status(500).json({
                message: "Error interno del servidor"
            });
        }
    },

    async findByFilters(req: Request, res: Response) {
        try {
            const filtros = req.body as BuscarUsuariosDto;

            if (ES_LOCAL) {
                console.log(
                    "UsuarioController.findByFilters:",
                    JSON.stringify(filtros)
                );
            }

            const usuarios =
                await UsuarioService.findByFilters(filtros);

            return res.status(200).json(usuarios);
        } catch (error) {
            console.error(
                "UsuarioController.findByFilters:",
                error
            );

            return res.status(500).json({
                message: "Error interno"
            });
        }
    },

    async create(req: AuthRequest, res: Response) {
        try {
            const { user, roles } = req.body;

            if (!user) {
                return res.status(400).json({
                    message: "Información del usuario requerida"
                });
            }

            if (!Array.isArray(roles) || roles.length === 0) {
                return res.status(400).json({
                    message: "Debe asignarse al menos un rol"
                });
            }

            const tieneRolPorDefecto = roles.some(
                (rol: any) => rol.default === true
            );

            if (!tieneRolPorDefecto) {
                return res.status(400).json({
                    message: "Debe existir un rol por defecto"
                });
            }

            if (
                typeof user.password !== "string" ||
                user.password.length < 6
            ) {
                return res.status(400).json({
                    message:
                        "La contraseña debe tener al menos 6 caracteres"
                });
            }

            const passwordCifrado = await bcrypt.hash(
                user.password,
                SALT_ROUNDS
            );

            const resultado =
                await UsuarioService.createUsuarioWithRolConfig(
                    {
                        ...user,
                        password: passwordCifrado
                    },
                    roles,
                    req.user?.id_usuario || 0
                );

            const tieneAccesoMarcajes = roles.some(
                (rol: any) =>
                    typeof rol.codigo === "string" &&
                    rol.codigo
                        .trim()
                        .toUpperCase()
                        .endsWith("-PMW")
            );

            if (!tieneAccesoMarcajes) {
                return res.status(201).json(resultado);
            }

            const authorizationHeader =
                req.headers.authorization;

            if (!authorizationHeader) {
                return res.status(201).json({
                    ...resultado,
                    sincronizacionMarcajes: false,
                    advertencia:
                        "El usuario fue creado, pero no se recibió el token para registrarlo en Marcajes"
                });
            }

            try {
                const respuestaMarcajes =
                    await MarcajesIntegrationService.crearEmpleado(
                        {
                            id_auth: resultado.usuarioId,
                            correo: user.correo,
                            nombre: user.nombre,
                            username: user.username,
                            direccion: user.direccion || null,
                            telefono: user.telefono || null
                        },
                        authorizationHeader
                    );

                return res.status(201).json({
                    ...resultado,
                    sincronizacionMarcajes: true,
                    empleadoMarcajes:
                        respuestaMarcajes.empleado
                });
            } catch (errorMarcajes) {
                console.error(
                    "UsuarioController.create - no se pudo crear el empleado en Marcajes:",
                    errorMarcajes
                );

                return res.status(201).json({
                    ...resultado,
                    sincronizacionMarcajes: false,
                    advertencia:
                        "El usuario fue creado, pero no pudo registrarse automáticamente como empleado en Marcajes",
                    detalle:
                        errorMarcajes instanceof Error
                            ? errorMarcajes.message
                            : "Error desconocido"
                });
            }
        } catch (error: any) {
            console.error("UsuarioController.create:", error);

            if (
                error.message ===
                "Correo o username ya registrados"
            ) {
                return res.status(409).json({
                    message: error.message
                });
            }

            return res.status(500).json({
                message: "Error interno al crear usuario"
            });
        }
    }
};