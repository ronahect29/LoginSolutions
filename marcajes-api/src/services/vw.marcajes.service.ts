import { prisma } from "../prisma";
import { BuscarMarcajesDto, MarcajeReporteDto } from "../models/marcaje";
import { MarcajeReporteRespuestaDto } from "../models/marcaje";
import { mapMarcajeToRespuesta } from "../helper/marcajes";
import { Prisma } from "@prisma/client";
import { getRangoGPSPermitido } from "../utils/utilidades";
import { cleanDate } from "../utils/utilDates";

function getDistanciaLabel(dist?: number) {
    if (dist == null || dist === 0) return "-";
    return dist <= getRangoGPSPermitido() ? "En rango" : `⚠️ ${dist} m`;
}

function getDistanciaFill(dist?: number) {
    // colores suaves (formal)
    if (dist == null || dist === 0) return { type: "pattern", pattern: "solid", fgColor: { argb: "FFF3F4F6" } }; // gris claro
    if (dist <= getRangoGPSPermitido()) return { type: "pattern", pattern: "solid", fgColor: { argb: "FFDCFCE7" } }; // verde suave
    return { type: "pattern", pattern: "solid", fgColor: { argb: "FFFEE2E2" } }; // rojo suave
}

function getDistanciaFont(dist?: number) {
    if (dist == null || dist === 0) return { color: { argb: "FF6B7280" } }; // gris
    if (dist <= getRangoGPSPermitido()) return { color: { argb: "FF166534" }, bold: true }; // verde
    return { color: { argb: "FF991B1B" }, bold: true }; // rojo
}

function asLinkOrDash(url?: string) {
    if (!url) return null;
    return { text: "Ver mapa 🗺️", hyperlink: url };
}


export const VwMarcajesService = {

    async findAll(): Promise<MarcajeReporteRespuestaDto[]> {
        const data = await prisma.$queryRaw<MarcajeReporteDto[]>`
            SELECT * FROM marcajes_db.vw_marcajes
        `;

        return data.map(mapMarcajeToRespuesta);
    },

    async findByJefe(jefeId: number | null): Promise<MarcajeReporteRespuestaDto[]> {
        let data: MarcajeReporteDto[];

        if (jefeId === null) {
            data = await prisma.$queryRaw<MarcajeReporteDto[]>`
                SELECT * FROM marcajes_db.vw_marcajes
                WHERE empleado_jefe IS NULL
            `;
        } else {
            data = await prisma.$queryRaw<MarcajeReporteDto[]>`
                SELECT * FROM marcajes_db.vw_marcajes
                WHERE empleado_jefe = ${jefeId}
            `;
        }

        return data.map(mapMarcajeToRespuesta);
    },
    async findByFilters(filtros: BuscarMarcajesDto): Promise<MarcajeReporteRespuestaDto[]> {
        const conditions: Prisma.Sql[] = [];
        if (filtros.fechaDesde) {
            conditions.push(Prisma.sql`AND fecha >= ${cleanDate(filtros.fechaDesde, true)}`);
        }
        if (filtros.fechaHasta) {
            conditions.push(Prisma.sql`AND fecha <= ${cleanDate(filtros.fechaHasta, false)}`);
        }
        if (filtros.sucursales?.length) {
            conditions.push(Prisma.sql`AND sucursal_id IN (${Prisma.join(filtros.sucursales)})`);
        }
        const whereClause = conditions?.length > 0 ? Prisma.sql`${Prisma.join(conditions, " ")}` : Prisma.sql``;
        const data = await prisma.$queryRaw<MarcajeReporteDto[]>` 
         SELECT * FROM marcajes_db.vw_marcajes WHERE 1=1 ${whereClause}
          `;
        const mapped = data.map(mapMarcajeToRespuesta);
        if (filtros.fueraDeRango !== null) {
            return mapped.filter(m => filtros.fueraDeRango
                ? m.distancia_entrada > getRangoGPSPermitido() || m.distancia_salida > getRangoGPSPermitido()
                : m.distancia_entrada <= getRangoGPSPermitido() || m.distancia_salida <= getRangoGPSPermitido());
        } return mapped;
    },
};
