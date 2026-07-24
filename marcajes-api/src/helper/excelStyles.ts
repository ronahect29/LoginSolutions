import type ExcelJS from "exceljs";

/* ======================================================
 * TIPOS PROPIOS (para evitar pelear con ExcelJS typings)
 * ====================================================== */

export type CellStyle = {
    font?: Partial<ExcelJS.Font>;
    fill?: Partial<ExcelJS.Fill>;
    alignment?: Partial<ExcelJS.Alignment>;
    border?: Partial<ExcelJS.Borders>;
    numFmt?: string;
};

/* ======================================================
 * APLICADOR DE ESTILOS
 * ====================================================== */

export function applyStyle(cell: ExcelJS.Cell, style: CellStyle) {
    if (style.font) cell.font = style.font;
    if (style.fill) cell.fill = style.fill as ExcelJS.Fill;
    if (style.alignment) cell.alignment = style.alignment as ExcelJS.Alignment;
    if (style.border) cell.border = style.border as ExcelJS.Borders;
    if (style.numFmt) cell.numFmt = style.numFmt;
}

/* ======================================================
 * COLORES (ARGB)
 * ====================================================== */

export const ExcelColors = {
    black: "FF000000",
    white: "FFFFFFFF",
    gray: "FF6B7280",
    blue: "FF1D4ED8",
    green: "FF15803D",
    red: "FFB91C1C",
    headerBg: "FF1F2937",
};

/* ======================================================
 * FUENTES
 * ====================================================== */

export function baseFont(): Partial<ExcelJS.Font> {
    return {
        name: "Calibri",
        size: 11,
        family: 2,
    };
}

export function normalFont(): Partial<ExcelJS.Font> {
    return {
        ...baseFont(),
        color: { argb: ExcelColors.gray },
    };
}

export function headerFont(): Partial<ExcelJS.Font> {
    return {
        ...baseFont(),
        bold: true,
        color: { argb: ExcelColors.white },
    };
}

export function linkFont(): Partial<ExcelJS.Font> {
    return {
        ...baseFont(),
        underline: true,
        color: { argb: ExcelColors.blue },
    };
}

export function distanciaFont(distancia?: number): Partial<ExcelJS.Font> {
    if (distancia == null || distancia === 0) {
        return normalFont();
    }

    return {
        ...baseFont(),
        bold: true,
        color: {
            argb: distancia <= 5 ? ExcelColors.green : ExcelColors.red,
        },
    };
}

/* ======================================================
 * FORMATOS DE CELDA (Excel real)
 * ====================================================== */

export const ExcelFormats = {
    date: "dd/mm/yyyy",
    time: "hh:mm:ss",
    dateTime: "dd/mm/yyyy hh:mm:ss",
};

/* ======================================================
 * ESTILOS PREDEFINIDOS
 * ====================================================== */

export function headerStyle(): CellStyle {
    return {
        font: headerFont(),
        fill: {
            type: "pattern",
            pattern: "solid",
            fgColor: { argb: ExcelColors.headerBg },
        },
        alignment: {
            vertical: "middle",
            horizontal: "center",
        },
    };
}

export function dateStyle(): CellStyle {
    return {
        font: normalFont(),
        numFmt: ExcelFormats.date,
    };
}

export function timeStyle(): CellStyle {
    return {
        font: normalFont(),
        numFmt: ExcelFormats.time,
    };
}

export function dateTimeStyle(): CellStyle {
    return {
        font: normalFont(),
        numFmt: ExcelFormats.dateTime,
    };
}

export function normalStyle(): CellStyle {
    return {
        font: normalFont(),
    };
}

/* ======================================================
 * HIPERVÍNCULOS
 * ====================================================== */

export function hyperlinkCell(
    text: string,
    url: string
): ExcelJS.CellValue {
    return {
        text,
        hyperlink: url,
    };
}

/* ======================================================
 * HELPERS DE APLICACIÓN MASIVA
 * ====================================================== */

export function applyHeaderRow(
    ws: ExcelJS.Worksheet,
    rowIndex = 1
) {
    const style = headerStyle();
    ws.getRow(rowIndex).eachCell(cell => {
        applyStyle(cell, style);
    });
}

export function autoFitColumns(ws: ExcelJS.Worksheet) {
    ws.columns.forEach(column => {
        let max = 10;

        column.eachCell?.({ includeEmpty: true }, cell => {
            const value = cell.value ? cell.value.toString() : "";
            max = Math.max(max, value.length + 2);
        });

        column.width = max;
    });
}
