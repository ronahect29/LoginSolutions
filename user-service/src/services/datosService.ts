import { TotalEntidadesDto } from "../models/Resultados";
import { prisma } from "../prisma";


export async function getTotalEntidadesByActivo(activo: boolean): Promise<TotalEntidadesDto> {
    const [
        totalUsuarios,
        totalRoles,
        totalApps
    ] = await Promise.all([
        prisma.usuario.count({
            where: { activo }
        }),
        prisma.rol.count({
            where: { activo }
        }),
        prisma.aplicacion.count({
            where: { activo }
        })
    ]);

    return {
        total_usuarios: totalUsuarios,
        total_roles: totalRoles,
        total_apps: totalApps
    };
}