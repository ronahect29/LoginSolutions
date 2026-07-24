import { Prisma } from "@prisma/client";
import { PagedResult } from "../models/PagedResult";
import { BuscarUsuariosDto, CreateUserDto, UsuarioAdminTable } from "../models/Usuario";
import { prisma } from "../prisma";
import { ES_LOCAL } from "../utils/constantes";
import { cleanDate, formatDateTime } from "../utils/utilDates";
import { RolConfigUsuario, RolFiltroDto } from "../models/Rol";

export const UsuarioService = {
    findAll() {
        return prisma.usuario.findMany();
    },
    findOne(id: number) {
        return prisma.usuario.findUnique({
            where: { id_usuario: id }
        });
    },
    findByCorreoAndActivo(correo: string, activo: boolean,) {
        return prisma.usuario.findFirst({
            where: {
                correo,
                activo
            }
        });
    },
    async changeUsuarioActivoById(id_usuario: number, activo: boolean, modificador: number) {
        return prisma.usuario.update({
            where: { id_usuario },
            data: {
                activo,
                fecha_modificacion: new Date(),
                modificador
            }
        });
    },

    async findAllWithRolesAndApp(): Promise<UsuarioAdminTable[]> {
        const usuarios = await prisma.usuario.findMany({
            select: {
                id_usuario: true,
                nombre: true,
                correo: true,
                username: true,
                activo: true,
                fecha_creacion: true,
                fecha_modificacion: true,
                configuracion_usuario_rol_configuracion_usuario_rol_usuarioTousuario: {
                    where: {
                        activo: true
                    },
                    select: {
                        rol_configuracion_usuario_rol_rolTorol: {
                            select: {
                                codigo: true,
                                aplicacion_rol_aplicacionToaplicacion: {
                                    select: {
                                        codigo: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });
        const resultado: UsuarioAdminTable[] = usuarios.map(u => {
            const roles = new Set<string>();
            const apps = new Set<string>();
            u.configuracion_usuario_rol_configuracion_usuario_rol_usuarioTousuario.forEach(cur => {
                const rol = cur.rol_configuracion_usuario_rol_rolTorol;
                roles.add(rol.codigo);
                apps.add(rol.aplicacion_rol_aplicacionToaplicacion.codigo);
            });
            return {
                id_usuario: u.id_usuario,
                nombre: u.nombre,
                correo: u.correo,
                usuario: u.username,
                fechaCreacion: u.fecha_creacion ? u.fecha_creacion.toISOString() : "",
                fechaModificacion: u.fecha_modificacion ? u.fecha_modificacion.toISOString() :
                    "",
                activo: u.activo,
                roles: Array.from(roles),
                apps: Array.from(apps),
            };
        });
        return resultado;
    },
    async findByFilters(filtros: BuscarUsuariosDto): Promise<PagedResult<UsuarioAdminTable>> {
        // console.log("usuario.service findByFilters - filtros: ", JSON.stringify(filtros));
        const page = Math.max(1, filtros.page ?? 1);
        const pageSize = Math.min(100, Math.max(1, filtros.pageSize ?? 10));
        const skip = (page - 1) * pageSize;
        const where = {
            ...(filtros.nombre && { nombre: { contains: filtros.nombre, } }),
            ...(filtros.usuario && { username: { contains: filtros.usuario, } }),
            ...(filtros.activo !== null && { activo: filtros.activo }),
            ...((filtros.creadoDesde || filtros.creadoHasta) && {
                fecha_creacion: {
                    ...(filtros.creadoDesde && { gte: cleanDate(filtros.creadoDesde, true), }),
                    ...(filtros.creadoHasta && { lte: cleanDate(filtros.creadoHasta, false) }),
                }
            }),
            ...((filtros.modDesde || filtros.modHasta) && {
                fecha_modificacion: {
                    ...(filtros.modDesde && { gte: cleanDate(filtros.modDesde, true), }),
                    ...(filtros.modHasta && { lte: cleanDate(filtros.modHasta, false), }),
                }
            }),
            ...((filtros.appsCodes?.length || filtros.rolesCodes?.length) && {
                configuracion_usuario_rol_configuracion_usuario_rol_usuarioTousuario: {
                    some: {
                        activo: true,

                        ...(filtros.rolesCodes?.length && {
                            rol_configuracion_usuario_rol_rolTorol: {
                                codigo: {
                                    in: filtros.rolesCodes,
                                },
                            },
                        }),

                        ...(filtros.appsCodes?.length && {
                            rol_configuracion_usuario_rol_rolTorol: {
                                aplicacion_rol_aplicacionToaplicacion: {
                                    codigo: {
                                        in: filtros.appsCodes,
                                    },
                                },
                            },
                        }),
                    },
                },
            }),
        };
        // console.log("usuario.service findByFilters - filtros.orderBy: ", JSON.stringify(filtros.orderBy));
        const orderBy = filtros.orderBy ? { [filtros.orderBy.field]: filtros.orderBy.direction as Prisma.SortOrder } : { nombre: "asc" as Prisma.SortOrder };
        // console.log("usuario.service findByFilters - orderBy: ", JSON.stringify(orderBy));
        const total = await prisma.usuario.count({ where });
        const usuarios = await prisma.usuario.findMany({
            where,
            skip,
            take: pageSize,
            orderBy,
            select: {
                id_usuario: true,
                nombre: true,
                correo: true,
                username: true,
                activo: true,
                fecha_creacion: true,
                fecha_modificacion: true,
                configuracion_usuario_rol_configuracion_usuario_rol_usuarioTousuario: {
                    where: { activo: true },
                    select: {
                        rol_configuracion_usuario_rol_rolTorol: {
                            select: {
                                codigo: true,
                                aplicacion_rol_aplicacionToaplicacion: {
                                    select: {
                                        codigo: true
                                    },
                                },
                            },
                        },
                    },
                },
            },
        });

        const data: UsuarioAdminTable[] = usuarios.map(u => {
            const roles = new Set<string>();
            const apps = new Set<string>();
            u.configuracion_usuario_rol_configuracion_usuario_rol_usuarioTousuario.forEach((cur) => {
                const rol = cur.rol_configuracion_usuario_rol_rolTorol;
                roles.add(rol.codigo);
                apps.add(rol.aplicacion_rol_aplicacionToaplicacion.codigo);
            });
            return {
                id_usuario: u.id_usuario,
                nombre: u.nombre,
                correo: u.correo,
                usuario: u.username,
                fechaCreacion: u.fecha_creacion ? formatDateTime(u.fecha_creacion) : "",
                fechaModificacion: u.fecha_modificacion ? formatDateTime(u.fecha_modificacion) : "",
                activo: u.activo,
                roles: Array.from(roles),
                apps: Array.from(apps),
            };
        });
        return { data, page, pageSize, total, totalPages: Math.ceil(total / pageSize) };
    },
    async createUsuarioWithRolConfig(usuario: CreateUserDto, roles: RolConfigUsuario[], id_creador: number) {
        return prisma.$transaction(async (tx) => {
            const nuevoUsuario = await tx.usuario.create({
                data: {
                    nombre: usuario.nombre,
                    correo: usuario.correo,
                    username: usuario.username,
                    password: usuario.password,
                    direccion: usuario.direccion,
                    telefono: usuario.telefono,
                    activo: true,
                    fecha_creacion: new Date(),
                    creador: id_creador ?? 0,
                }
            })
            await tx.configuracion_usuario_rol.createMany({
                data: roles.map(rol => ({
                    usuario: nuevoUsuario.id_usuario,
                    rol: rol.id_rol,
                    activo: true,
                    por_defecto: rol.default
                }))
            });
            return {
                message: "Usuario creado correctamente",
                usuarioId: nuevoUsuario.id_usuario
            };
        });
    }
}