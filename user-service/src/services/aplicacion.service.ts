import { type AplicacionFiltroDto } from "../models/Aplicacion";
import { prisma } from "../prisma";

export const AplicacionService = {
    async findAppsByActivo(activo: boolean): Promise<AplicacionFiltroDto[]> {
        const data = prisma.aplicacion.findMany({
            where: { activo },
            select: { id_aplicacion: true, nombre: true, codigo: true }
        });
        return data;
    }
}