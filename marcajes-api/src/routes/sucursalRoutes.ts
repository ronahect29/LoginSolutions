import { Router } from "express";
import { SucursalController } from "../controllers/sucursal.controller";
import { requireAuth } from "../middlewares/sessionMiddleware";

const router = Router();

/**
 * Catálogo completo de sucursales.
 */
router.get(
    "/findAll",
    requireAuth,
    SucursalController.getAll
);

/**
 * Sucursales filtradas por estado.
 *
 * Este endpoint ya es utilizado por el selector
 * del repositorio de marcajes.
 */
router.get(
    "/findByActivo/:activo",
    requireAuth,
    SucursalController.findByActivo
);

/**
 * Consulta individual de una sucursal.
 */
router.get(
    "/findOne/:id",
    requireAuth,
    SucursalController.findOne
);

/**
 * Registro de una nueva sucursal.
 */
router.post(
    "/create",
    requireAuth,
    SucursalController.create
);

/**
 * Actualización de datos generales, ubicación
 * y radio permitido de marcaje.
 */
router.put(
    "/update/:id",
    requireAuth,
    SucursalController.update
);

/**
 * Activación o desactivación lógica.
 */
router.patch(
    "/changeStatus/:id",
    requireAuth,
    SucursalController.cambiarEstado
);

export default router;