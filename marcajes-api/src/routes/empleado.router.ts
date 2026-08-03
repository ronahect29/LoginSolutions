import { Router } from "express";

import { EmpleadoController } from "../controllers/empleado.controller";
import { requireAuth } from "../middlewares/sessionMiddleware";

const router = Router();

/**
 * Lista todos los empleados con:
 * - Sucursal
 * - Supervisor
 * - Último marcaje
 */
router.get(
    "/findAll",
    requireAuth,
    EmpleadoController.getAll
);

/**
 * Lista los empleados que todavía no tienen
 * un supervisor asignado.
 *
 * Debe declararse antes de findOne/:id para evitar
 * que Express interprete "findSinSupervisor" como un ID.
 */
router.get(
    "/findSinSupervisor",
    requireAuth,
    EmpleadoController.findSinSupervisor
);

/**
 * Lista el equipo asignado a un supervisor.
 */
router.get(
    "/findBySupervisor/:idSupervisor",
    requireAuth,
    EmpleadoController.findEquipoPorSupervisor
);

/**
 * Consulta un empleado por correo e identificador
 * del servicio de autenticación.
 */
router.get(
    "/findByCorreoAndIdAuth/:correo/:id_auth",
    requireAuth,
    EmpleadoController.findByByCorreoAndIdAuth
);

/**
 * Consulta individual de un empleado.
 */
router.get(
    "/findOne/:id",
    requireAuth,
    EmpleadoController.findOne
);

/**
 * Crea el registro operativo de un empleado.
 *
 * Este endpoint continúa siendo utilizado por
 * user-service durante la creación automática.
 */
router.post(
    "/create",
    requireAuth,
    EmpleadoController.create
);

/**
 * Actualiza:
 * - Dirección
 * - Teléfono
 * - Sucursal
 * - Supervisor
 */
router.put(
    "/updateOperational/:id",
    requireAuth,
    EmpleadoController.actualizarDatosOperativos
);

export default router;