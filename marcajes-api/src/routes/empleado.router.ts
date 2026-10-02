import {
    Router
} from "express";

import {
    EmpleadoController
} from "../controllers/empleado.controller";

import {
    requireAuth
} from "../middlewares/sessionMiddleware";

const router =
    Router();

router.get(
    "/findAll",
    requireAuth,
    EmpleadoController.getAll
);

router.get(
    "/findSinSupervisor",
    requireAuth,
    EmpleadoController.findSinSupervisor
);

router.get(
    "/findBySupervisor/:idSupervisor",
    requireAuth,
    EmpleadoController.findEquipoPorSupervisor
);

router.get(
    "/findByCorreoAndIdAuth/:correo/:id_auth",
    requireAuth,
    EmpleadoController.findByByCorreoAndIdAuth
);

router.get(
    "/findOne/:id",
    requireAuth,
    EmpleadoController.findOne
);

router.post(
    "/create",
    requireAuth,
    EmpleadoController.create
);

router.put(
    "/updateOperational/:id",
    requireAuth,
    EmpleadoController.actualizarDatosOperativos
);

router.put(
    "/updateIdentityByAuth/:idAuth",
    requireAuth,
    EmpleadoController.actualizarIdentidadPorIdAuth
);

router.patch(
    "/changeActivoByAuth/:idAuth",
    requireAuth,
    EmpleadoController.cambiarEstadoPorIdAuth
);

export default router;