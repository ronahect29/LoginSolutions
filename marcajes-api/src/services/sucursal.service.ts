import { prisma } from "../prisma";
export const SucursalService = {
    findAll() {
        return prisma.sucursal.findMany();
    },
    findOne(id_sucursal: number) {
        return prisma.sucursal.findFirst({ where: { id_sucursal } });
    },
    findByActivo(activo: boolean) {
        return prisma.sucursal.findMany({ where: { activo }, select: { id_sucursal: true, nombre: true } })
    }
}