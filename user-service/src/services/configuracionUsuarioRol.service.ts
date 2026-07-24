import { prisma } from "../prisma";

export const ConfiguracionUsuarioRolService = {
    findAll() {
        return prisma.configuracion_usuario_rol.findMany();
    },
    async findRolesByUsuarioIdAndAplicacionCodigo(id: number, codeApp: string) {
        const config = await prisma.configuracion_usuario_rol.findMany({
            where: {
                activo: true,
                usuario_configuracion_usuario_rol_usuarioTousuario: {
                    id_usuario: id
                },
                rol_configuracion_usuario_rol_rolTorol: {
                    activo: true,
                    aplicacion_rol_aplicacionToaplicacion: {
                        codigo: codeApp
                    }
                }
            },
            include: {
                rol_configuracion_usuario_rol_rolTorol: true
            }
        });
        return config.map((c) => ({ ...c.rol_configuracion_usuario_rol_rolTorol, por_defecto: c.por_defecto, en_uso: c.por_defecto }));
    },
    findOne(id: number) {
        return prisma.configuracion_usuario_rol.findUnique({
            where: { id_configuracion_usuario_rol: id }
        });
    },
    create(data: any) {
        return prisma.configuracion_usuario_rol.create({
            data
        });
    }
}