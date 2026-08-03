import type { Request, Response } from "express";
import { SucursalService } from "../services/sucursal.service";
import type {
    ActualizarSucursalDto,
    CrearSucursalDto
} from "../models/sucursal";

function obtenerIdParametro(valor: string): number | null {
    const id = Number(valor);

    if (!Number.isInteger(id) || id <= 0) {
        return null;
    }

    return id;
}

function esNumeroValido(valor: unknown): boolean {
    return (
        typeof valor === "number" &&
        Number.isFinite(valor)
    );
}

function validarCoordenadas(
    latitud: unknown,
    longitud: unknown
): string | null {
    if (
        latitud !== undefined &&
        latitud !== null &&
        !esNumeroValido(latitud)
    ) {
        return "La latitud debe ser un número válido.";
    }

    if (
        longitud !== undefined &&
        longitud !== null &&
        !esNumeroValido(longitud)
    ) {
        return "La longitud debe ser un número válido.";
    }

    if (
        typeof latitud === "number" &&
        (latitud < -90 || latitud > 90)
    ) {
        return "La latitud debe estar entre -90 y 90.";
    }

    if (
        typeof longitud === "number" &&
        (longitud < -180 || longitud > 180)
    ) {
        return "La longitud debe estar entre -180 y 180.";
    }

    const tieneLatitud =
        latitud !== undefined && latitud !== null;

    const tieneLongitud =
        longitud !== undefined && longitud !== null;

    if (tieneLatitud !== tieneLongitud) {
        return (
            "La latitud y la longitud deben enviarse juntas."
        );
    }

    return null;
}

function validarRadio(
    radio: unknown
): string | null {
    if (radio === undefined) {
        return null;
    }

    if (
        typeof radio !== "number" ||
        !Number.isInteger(radio)
    ) {
        return (
            "El radio de marcaje debe ser un número entero."
        );
    }

    if (radio < 10 || radio > 5000) {
        return (
            "El radio de marcaje debe estar entre 10 y 5000 metros."
        );
    }

    return null;
}

function responderErrorServicio(
    error: unknown,
    res: Response
): Response {
    console.error("Error en sucursal.controller:", error);

    if (error instanceof Error) {
        if (
            error.message.includes("Ya existe")
        ) {
            return res.status(409).json({
                message: error.message
            });
        }

        if (
            error.message.includes("no existe")
        ) {
            return res.status(404).json({
                message: error.message
            });
        }
    }

    return res.status(500).json({
        message:
            "Ocurrió un error procesando la sucursal."
    });
}

export const SucursalController = {
    async getAll(
        _req: Request,
        res: Response
    ) {
        try {
            const sucursales =
                await SucursalService.findAll();

            return res.json(sucursales);
        } catch (error) {
            return responderErrorServicio(error, res);
        }
    },

    async findOne(
        req: Request,
        res: Response
    ) {
        const idSucursal = obtenerIdParametro(
            req.params.id
        );

        if (idSucursal === null) {
            return res.status(400).json({
                message:
                    "El identificador de la sucursal es inválido."
            });
        }

        try {
            const sucursal =
                await SucursalService.findOne(
                    idSucursal
                );

            if (!sucursal) {
                return res.status(404).json({
                    message:
                        "La sucursal no existe."
                });
            }

            return res.json(sucursal);
        } catch (error) {
            return responderErrorServicio(error, res);
        }
    },

    async findByActivo(
        req: Request,
        res: Response
    ) {
        const { activo } = req.params;

        if (
            activo !== "true" &&
            activo !== "false"
        ) {
            return res.status(400).json({
                message:
                    "El parámetro activo debe ser true o false."
            });
        }

        try {
            const sucursales =
                await SucursalService.findByActivo(
                    activo === "true"
                );

            return res.json(sucursales);
        } catch (error) {
            return responderErrorServicio(error, res);
        }
    },

    async create(
        req: Request,
        res: Response
    ) {
        const {
            nombre,
            telefono,
            direccion,
            latitud,
            longitud,
            radio_marcaje_metros,
            activo,
            creador
        } = req.body;

        if (
            typeof nombre !== "string" ||
            nombre.trim().length === 0
        ) {
            return res.status(400).json({
                message:
                    "El nombre de la sucursal es obligatorio."
            });
        }

        if (nombre.trim().length > 150) {
            return res.status(400).json({
                message:
                    "El nombre no puede superar 150 caracteres."
            });
        }

        if (
            typeof direccion !== "string" ||
            direccion.trim().length === 0
        ) {
            return res.status(400).json({
                message:
                    "La dirección de la sucursal es obligatoria."
            });
        }

        if (direccion.trim().length > 200) {
            return res.status(400).json({
                message:
                    "La dirección no puede superar 200 caracteres."
            });
        }

        if (
            telefono !== undefined &&
            telefono !== null &&
            (
                typeof telefono !== "string" ||
                telefono.trim().length > 10
            )
        ) {
            return res.status(400).json({
                message:
                    "El teléfono debe ser texto y no superar 10 caracteres."
            });
        }

        if (
            activo !== undefined &&
            typeof activo !== "boolean"
        ) {
            return res.status(400).json({
                message:
                    "El estado activo debe ser verdadero o falso."
            });
        }

        if (
            typeof creador !== "string" ||
            creador.trim().length === 0
        ) {
            return res.status(400).json({
                message:
                    "El usuario creador es obligatorio."
            });
        }

        const errorCoordenadas =
            validarCoordenadas(
                latitud,
                longitud
            );

        if (errorCoordenadas) {
            return res.status(400).json({
                message: errorCoordenadas
            });
        }

        const errorRadio =
            validarRadio(
                radio_marcaje_metros
            );

        if (errorRadio) {
            return res.status(400).json({
                message: errorRadio
            });
        }

        const data: CrearSucursalDto = {
            nombre,
            telefono: telefono ?? null,
            direccion,
            latitud: latitud ?? null,
            longitud: longitud ?? null,
            radio_marcaje_metros:
                radio_marcaje_metros ?? 150,
            activo: activo ?? true,
            creador
        };

        try {
            const sucursal =
                await SucursalService.create(data);

            return res.status(201).json({
                message:
                    "Sucursal creada correctamente.",
                sucursal
            });
        } catch (error) {
            return responderErrorServicio(error, res);
        }
    },

    async update(
        req: Request,
        res: Response
    ) {
        const idSucursal = obtenerIdParametro(
            req.params.id
        );

        if (idSucursal === null) {
            return res.status(400).json({
                message:
                    "El identificador de la sucursal es inválido."
            });
        }

        const {
            nombre,
            telefono,
            direccion,
            latitud,
            longitud,
            radio_marcaje_metros,
            activo,
            modificador
        } = req.body;

        if (
            nombre !== undefined &&
            (
                typeof nombre !== "string" ||
                nombre.trim().length === 0 ||
                nombre.trim().length > 150
            )
        ) {
            return res.status(400).json({
                message:
                    "El nombre debe contener entre 1 y 150 caracteres."
            });
        }

        if (
            direccion !== undefined &&
            (
                typeof direccion !== "string" ||
                direccion.trim().length === 0 ||
                direccion.trim().length > 200
            )
        ) {
            return res.status(400).json({
                message:
                    "La dirección debe contener entre 1 y 200 caracteres."
            });
        }

        if (
            telefono !== undefined &&
            telefono !== null &&
            (
                typeof telefono !== "string" ||
                telefono.trim().length > 10
            )
        ) {
            return res.status(400).json({
                message:
                    "El teléfono debe ser texto y no superar 10 caracteres."
            });
        }

        if (
            activo !== undefined &&
            typeof activo !== "boolean"
        ) {
            return res.status(400).json({
                message:
                    "El estado activo debe ser verdadero o falso."
            });
        }

        if (
            typeof modificador !== "string" ||
            modificador.trim().length === 0
        ) {
            return res.status(400).json({
                message:
                    "El usuario modificador es obligatorio."
            });
        }

        const errorCoordenadas =
            validarCoordenadas(
                latitud,
                longitud
            );

        if (errorCoordenadas) {
            return res.status(400).json({
                message: errorCoordenadas
            });
        }

        const errorRadio =
            validarRadio(
                radio_marcaje_metros
            );

        if (errorRadio) {
            return res.status(400).json({
                message: errorRadio
            });
        }

        const data: ActualizarSucursalDto = {
            nombre,
            telefono,
            direccion,
            latitud,
            longitud,
            radio_marcaje_metros,
            activo,
            modificador
        };

        try {
            const sucursal =
                await SucursalService.update(
                    idSucursal,
                    data
                );

            return res.json({
                message:
                    "Sucursal actualizada correctamente.",
                sucursal
            });
        } catch (error) {
            return responderErrorServicio(error, res);
        }
    },

    async cambiarEstado(
        req: Request,
        res: Response
    ) {
        const idSucursal = obtenerIdParametro(
            req.params.id
        );

        if (idSucursal === null) {
            return res.status(400).json({
                message:
                    "El identificador de la sucursal es inválido."
            });
        }

        const {
            activo,
            modificador
        } = req.body;

        if (typeof activo !== "boolean") {
            return res.status(400).json({
                message:
                    "El estado activo debe ser verdadero o falso."
            });
        }

        if (
            typeof modificador !== "string" ||
            modificador.trim().length === 0
        ) {
            return res.status(400).json({
                message:
                    "El usuario modificador es obligatorio."
            });
        }

        try {
            const sucursal =
                await SucursalService.cambiarEstado(
                    idSucursal,
                    activo,
                    modificador
                );

            return res.json({
                message: activo
                    ? "Sucursal activada correctamente."
                    : "Sucursal desactivada correctamente.",
                sucursal
            });
        } catch (error) {
            return responderErrorServicio(error, res);
        }
    }
};