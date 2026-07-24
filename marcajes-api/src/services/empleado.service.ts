import { prisma } from "../prisma";

export const EmpleadoService = {
    findAll() {
        return prisma.empleado.findMany();
    },
    findOne(id: number) {
        return prisma.empleado.findUnique({
            where: { id_empleado: id }
        });
    },
    findByCorreoAndIdAuth(correo: string, id_auth: number) {
        return prisma.empleado.findMany({
            where: { id_auth, correo }
        });
    },
    findByCorreo(correo: string) {
        return prisma.empleado.findFirst({
            where: { correo },
        });
    },
    create(data: any) {
        return prisma.empleado.create({
            data
        });
    }
};