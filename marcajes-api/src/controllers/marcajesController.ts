import { Request, Response } from 'express';
import { MarcajeService } from '../services/marcajes.service';
import { BuscarMarcajesDto, Marcaje } from '../models/marcaje';
import { ES_LOCAL } from '../utils/utilidades';
import { VwMarcajesService } from '../services/vw.marcajes.service';
export const MarcajeController = {
    async getAll(req: Request, res: Response) {
        const data = await MarcajeService.findAll();
        return res.json(data);
    },
    async findMarcajeByEmpleadoAndFecha(req: Request, res: Response) {
        if (ES_LOCAL) {
            console.log("marcajesController: req.params: ", JSON.stringify(req.params));
        }
        const id_empleado = Number(req.params.id_empleado);
        const fecha = req.params.fecha;
        const data = await MarcajeService.findMarcajeByEmpleadoAndFecha(id_empleado, fecha);
        res.json(data);
    },
    async createMarcaje(req: Request, res: Response) {
        const { empleado, es_entrada, hora, latitud, longitud } = req.body;
        if (empleado == null || es_entrada == null || !hora) {
            console.log("marcajesController - createMarcaje: datos incompletos");
            return res.status(400).json({ message: "Datos incompletos para registro de marcaje" });
        }
        const marcaje: Marcaje = {
            empleado,
            es_entrada,
            hora,
            latitud,
            longitud,
            fecha: new Date()
        };
        const data = await MarcajeService.registrarMarcajeByEmpleadoData(marcaje);
        return res.status(201).json(data);
    },
    async findOne(req: Request, res: Response) {
        const id = Number(req.params.id);
        const data = await MarcajeService.findOne(id);
        res.json(data);
    },
    async create(req: Request, res: Response) {
        const data = await MarcajeService.create(req.body);
        res.json(data);
    }
};