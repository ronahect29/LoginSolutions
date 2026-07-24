import { type RolFiltroDto } from "../models/Rol";
import { prisma } from "../prisma";

export const RolService = {
    async findRolesByActivoAndApp(activo: boolean, id_app: number): Promise<RolFiltroDto[]> {
        const data = prisma.rol.findMany(
            {
                where: {
                    activo,
                    aplicacion_rol_aplicacionToaplicacion: {
                        id_aplicacion: id_app
                    }
                },
                select: { id_rol: true, nombre: true, codigo: true }
            }
        );
        return data;
    },
    async findRolesByActivoAndCodigosAplicacionActivo(activo: boolean, appsCodes: string[]): Promise<RolFiltroDto[]> {
        const data = prisma.rol.findMany({
            where: { activo, aplicacion_rol_aplicacionToaplicacion: { codigo: { in: appsCodes }, activo: true } },
            select: { id_rol: true, nombre: true, codigo: true }
        });
        return data;
    }
}