import { Request, Response } from 'express';
import { UsuarioService } from '../services/usuario.service';
import { BuscarUsuariosDto } from '../models/Usuario';
import { prisma } from '../prisma';
import { AuthRequest } from '../types/AuthRequest';
import { ES_LOCAL } from '../utils/constantes';
import bcrypt from "bcryptjs";

const SALT_ROUNDS = 10;

export const UsuarioController = {
    async getAll(req: Request, res: Response) {
        try {
            const data = await UsuarioService.findAll();
            return res.json(data);
        } catch (err) {
            console.error("Error en getAll:", err);
            return res.status(500).json({ message: "Error interno" });
        }
    },

    async findByUsuarioId(req: Request, res: Response) {
        try {
            const id = Number(req.params.id);
            const data = await UsuarioService.findOne(id);
            if (!data) {
                return res.status(404).json({ message: "Usuario no encontrado" });
            }
            return res.json(data);
        } catch (err) {
            console.error("Error en findByUsuarioId:", err);
            return res.status(500).json({ message: "Error interno" });
        }
    },
    async findAllWithRolesAndApps(_req: Request, res: Response) {
        try {
            const data = await UsuarioService.findAllWithRolesAndApp();
            return res.json(data);
        } catch (err) {
            console.log("Error al obtener los usuarios con codigos de roles y apps: ", err);
            return res.status(500).json({ message: "Error interno" });
        }
    },
    async changeUsuarioActivoById(req: AuthRequest, res: Response) {

        const id_usuario = Number(req.params.id);
        const { activo } = req.body;
        if (isNaN(id_usuario)) {
            return res.status(400).json({ message: "ID de usuario inválido." })
        }
        if (typeof activo !== "boolean") {
            return res.status(400).json({ message: "El campo 'activo' debe ser booleano." });
        }
        try {
            const usuario = await prisma.usuario.findFirst({
                where: { id_usuario },
                select: { id_usuario: true }
            });
            if (!usuario) {
                return res.status(404).json({ message: "Usuario no encontrado." })
            }
            if (ES_LOCAL)
                console.log(`usuario.controller changeUsuarioActivoById - MODIFICADOR: ${req.user?.id_usuario}`);
            await UsuarioService.changeUsuarioActivoById(id_usuario, activo, req.user?.id_usuario || 0);
            return res.json({ success: true })
        } catch (err) {
            console.error("usuario.controller Error en changeUsuarioActivoById: ", err);
            return res.status(500).json({ message: "Error interno del servidor." });
        }
    },
    async findByFilters(req: Request, res: Response) {
        try {
            const filtros = req.body as BuscarUsuariosDto;
            console.log("usuario.controller findByFilters - body: ", JSON.stringify(filtros));
            const usuarios = await UsuarioService.findByFilters(filtros);
            return res.json(usuarios);
        } catch (err) {
            console.error("Error al obtener usuarios por filtros: ", err);
            return res.status(500).json({ message: "Error interno" });
        }
    },
    async create(req: AuthRequest, res: Response) {
        try {
            const { user, roles } = req.body;

            /* ================= VALIDACIONES ================= */
            if (!user) {
                return res.status(400).json({
                    message: "Información del usuario requerida"
                });
            }

            if (!roles || roles.length === 0) {
                return res.status(400).json({
                    message: "Debe asignarse al menos un rol"
                });
            }

            const hasDefault = roles.some((r: any) => r.default === true);
            if (!hasDefault) {
                return res.status(400).json({
                    message: "Debe existir un rol por defecto"
                });
            }

            if (!user.password || user.password.length < 6) {
                return res.status(400).json({
                    message: "La contraseña debe tener al menos 6 caracteres"
                });
            }

            /* ================= CIFRAR PASSWORD ================= */
            const hashedPassword = await bcrypt.hash(
                user.password,
                SALT_ROUNDS
            );

            /* ================= DELEGAR AL SERVICE ================= */
            const result = await UsuarioService.createUsuarioWithRolConfig(
                {
                    ...user,
                    password: hashedPassword
                },
                roles,
                req.user?.id_usuario || 0
            );

            return res.status(201).json(result);

        } catch (error: any) {
            console.error("UsuarioController.create", error);

            // error de negocio controlado
            if (error.message === "Correo o username ya registrados") {
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