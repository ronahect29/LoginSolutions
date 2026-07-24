import { VwMarcajesService } from "../services/vw.marcajes.service";
import type { BuscarMarcajesDto } from "../models/marcaje";

export async function reporteMarcajesByFilterUseCase(
    body: BuscarMarcajesDto
) {
    if (body.fechaDesde && isNaN(Date.parse(body.fechaDesde)))
        throw new Error("fechaDesde inválida (yyyy-mm-dd)");

    if (body.fechaHasta && isNaN(Date.parse(body.fechaHasta)))
        throw new Error("fechaHasta inválida (yyyy-mm-dd)");

    if (body.fueraDeRango !== undefined && body.fueraDeRango !== null && typeof body.fueraDeRango !== "boolean")
        throw new Error("fueraDeRango debe ser boolean o null");

    return VwMarcajesService.findByFilters({
        fechaDesde: body.fechaDesde ?? null,
        fechaHasta: body.fechaHasta ?? null,
        sucursales: body.sucursales ?? null,
        fueraDeRango: body.fueraDeRango ?? null,
    });
}