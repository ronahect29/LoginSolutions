import { Marcaje } from "../models/marcaje";
import { prisma } from "../prisma";
import { cleanDate } from "../utils/utilidades";

export const MarcajeService = {
  findAll() {
    return prisma.marcaje.findMany();
  },
  findMarcajeByEmpleadoAndFecha(id_empleado: number, fecha: string) {
    const date = cleanDate(fecha);
    return prisma.marcaje.findMany({
      where: { empleado_marcaje_empleadoToempleado: { id_empleado: id_empleado }, fecha: { gte: date.start, lte: date.end } },
    });
  },
  registrarMarcajeByEmpleadoData: async (marcaje: Marcaje) => {
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    const existe = await prisma.marcaje.findFirst({
      where: {
        fecha: hoy,
        empleado: marcaje.empleado,
        es_entrada: marcaje.es_entrada
      }
    });
    if (existe) {
      console.log("marcajes.service - ", marcaje.es_entrada ? "Existe Entrada registrada hoy" : "Existe Salida registrada hoy");
      throw new Error(marcaje.es_entrada ? "Ya existe una entrada registrada hoy" : "Ya existe una salida registrada hoy");
    }
    return prisma.marcaje.create({
      data: {
        empleado: marcaje.empleado,
        fecha: hoy,
        hora: marcaje.hora,
        es_entrada: marcaje.es_entrada,
        latitud: marcaje.latitud,
        longitud: marcaje.longitud
      }
    });
  },
  findOne(id: number) {
    return prisma.marcaje.findUnique({
      where: { id_marcaje: id }
    });
  },
  create(data: any) {
    return prisma.marcaje.create({
      data
    });
  }
};