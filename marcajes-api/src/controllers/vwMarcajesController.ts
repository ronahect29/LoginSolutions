import { Request, Response } from "express";
import { VwMarcajesService } from "../services/vw.marcajes.service";
import { ES_LOCAL } from "../utils/utilidades";
import { BuscarMarcajesDto, MarcajeReporteRespuestaDto } from "../models/marcaje";
import ExcelJS from "exceljs";
import { reporteMarcajesByFilterUseCase } from "../use-cases/reporteMarcajes.usecase";
import {
    applyStyle,
    applyHeaderRow,
    autoFitColumns,
    dateStyle,
    timeStyle,
    normalStyle,
    distanciaFont,
    linkFont,
    hyperlinkCell,
} from "../helper/excelStyles";
import { head } from "axios";
export const VwMarcajesController = {
    async getAll(req: Request, res: Response) {
        console.log("ENTRO AL CONTROLLER");
        try {
            if (ES_LOCAL)
                console.log("INICIA BUSQUEDA DE TODOS LOS MARCAJES PARA REPORTE");
            const data = await VwMarcajesService.findAll();
            if (ES_LOCAL)
                console.log("FINALIZA BUSQUEDA DE TODOS LOS MARCAJES PARA REPORTE");
            return res.json(data)
        } catch (error) {
            console.error("Error en getAllMarcajes: ", error);
            return res.status(500).json({ message: "Error obteniendo marcajes" });
        }
    },
    async reporteMarcajesByFilters(req: Request, res: Response) {
        try {
            const body = req.body as BuscarMarcajesDto;
            const data = await reporteMarcajesByFilterUseCase(body);
            return res.status(200).json(data);
            // if (body.fechaDesde && isNaN(Date.parse(body.fechaDesde))) {
            //     console.log("marcajesController - FechaDesde inválida", 1);
            //     return res.status(400).json({ message: "fechaDesde inválida (yyy-mm-dd)" });
            // }
            // if (body.fechaHasta && isNaN(Date.parse(body.fechaHasta))) {
            //     console.log("marcajesController - FechaHasta inválida", 2);
            //     return res.status(400).json({ message: "fechaHasta inválida (yyyy-mm-dd)" });
            // }
            // if (
            //     body.fueraDeRango !== undefined &&
            //     body.fueraDeRango !== null &&
            //     typeof body.fueraDeRango !== "boolean"
            // ) {
            //     console.log("marcajesController - fueraDeRango debe ser boolean o null", 3);
            //     return res.status(400).json({
            //         message: "fueraDeRango debe ser boolean o null",
            //     });
            // }
            // const data = await VwMarcajesService.findByFilters({
            //     fechaDesde: body.fechaDesde ?? null,
            //     fechaHasta: body.fechaHasta ?? null,
            //     sucursales: body.sucursales ?? null,
            //     fueraDeRango: body.fueraDeRango ?? null,
            // });
            // return res.status(200).json(data);
        } catch (err) {
            console.log(`marcajesController - reporteMarcajesByFilters: ${err}`, 0);
            return res.status(500).json({ message: "Error interno al buscar marcajes" });
        }
    },
    async exporReporteMarcajesByFilters(req: Request, res: Response) {
        try {
            const body = req.body as BuscarMarcajesDto;
            const data: MarcajeReporteRespuestaDto[] = await reporteMarcajesByFilterUseCase(body);
            const wb = new ExcelJS.Workbook();
            wb.creator = "Sistema de Marcajes";
            wb.created = new Date();

            const ws = wb.addWorksheet("Reporte Marcajes", {
                views: [{ state: "frozen", ySplit: 1 }],
            });

            ws.columns = [
                { header: "Empleado", key: "empleado", width: 24 },
                { header: "Correo", key: "correo", width: 24 },
                { header: "Fecha", key: "fecha", width: 14 },
                { header: "Entrada", key: "entrada", width: 14 },
                { header: "Salida", key: "salida", width: 14 },
                { header: "Horas Trabajadas", key: "total", width: 18 },
                { header: "Ubicación Entrada", key: "ubicacionEntrada", width: 22 },
                { header: "Distancia Entrada", key: "distanciaEntrada", width: 20 },
                { header: "Ubicación Salida", key: "ubicacionSalida", width: 22 },
                { header: "Distancia Salida", key: "distanciaSalida", width: 22 },
                { header: "Sucursal", key: "sucursal", width: 18 },
                { header: "Ubicación Sucursal", key: "ubicacionSucursal", width: 22, },
            ];
            applyHeaderRow(ws, 1);
            data.forEach(row => {
                const excelRow = ws.addRow({
                    empleado: row.empleado_nombre,
                    correo: row.empleado_correo,
                    fecha: new Date(row.fecha),
                    entrada: row.hora_entrada ?? "-",
                    salida: row.hora_salida ?? "-",
                    total: row.horas_trabajadas ?? "-",
                    ubicacionEntrada: row.ubicacion_entrada
                        ? hyperlinkCell("Ver mapa", row.ubicacion_entrada)
                        : "-",
                    distanciaEntrada: row.distancia_entrada > 0
                        ? `${row.distancia_entrada} m` : "-",
                    ubicacionSalida: row.ubicacion_salida
                        ? hyperlinkCell("Ver mapa", row.ubicacion_salida)
                        : "-",
                    distanciaSalida: row.distancia_salida > 0
                        ? `${row.distancia_salida} m` : "-",
                    sucursal: row.sucursal_nombre,
                    ubicacionSucursal: row.sucursal_ubicacion
                        ? hyperlinkCell("Ver mapa", row.sucursal_ubicacion)
                        : "-"
                });
                const r = excelRow.number;
                // 📅 Fecha
                applyStyle(ws.getCell(`C${r}`), dateStyle());

                // ⏰ Horas
                applyStyle(ws.getCell(`D${r}`), timeStyle());
                applyStyle(ws.getCell(`E${r}`), timeStyle());

                // 🧾 Texto normal
                applyStyle(ws.getCell(`A${r}`), normalStyle());
                applyStyle(ws.getCell(`B${r}`), normalStyle());
                applyStyle(ws.getCell(`F${r}`), normalStyle());
                applyStyle(ws.getCell(`K${r}`), normalStyle());

                // 🔗 Hipervínculos
                if (row.ubicacion_entrada) {
                    ws.getCell(`G${r}`).font = linkFont();
                }
                if (row.ubicacion_salida) {
                    ws.getCell(`I${r}`).font = linkFont();
                }
                if (row.sucursal_ubicacion) {
                    ws.getCell(`L${r}`).font = linkFont();
                }
                // ⚠️ Distancias (regla negocio)
                ws.getCell(`H${r}`).font = distanciaFont(row.distancia_entrada);
                ws.getCell(`J${r}`).font = distanciaFont(row.distancia_salida);
            });

            autoFitColumns(ws);
            res.setHeader(
                "Content-Type",
                "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
            );
            res.setHeader(
                "Content-Disposition",
                'attachment; filename="reporte_marcajes.xlsx"'
            );

            await wb.xlsx.write(res);
            res.end();
        } catch (err) {
            console.error("vwMarcajesController - exportReporteMarcajesByFilters: ", err);
            return res.status(500).json({ message: "Error al generar el reporte de excel" });
        }
    }
}