import ExcelJS from "exceljs";

export function asLinkOrDash(url?: string) {
    if (!url) return "-";
    return { text: "Ver mapa", hyperlink: url };
}

export function getDistanciaLabel(distancia?: number) {
    if (!distancia) return "-";
    return distancia <= 5 ? "En rango" : `⚠️ ${distancia} m`;
}

export function getDistanciaFill(distancia?: number): ExcelJS.Fill | undefined {
    if (!distancia) return undefined;

    return {
        type: "pattern",
        pattern: "solid",
        fgColor: {
            argb: distancia <= 5 ? "FFE7F7EC" : "FFFEE2E2",
        },
    };
}

export function getDistanciaFont(distancia?: number): Partial<ExcelJS.Font> {
    if (!distancia) return { color: { argb: "FF6B7280" } };

    return {
        bold: true,
        color: {
            argb: distancia <= 5 ? "FF15803D" : "FFB91C1C",
        },
    };
}
