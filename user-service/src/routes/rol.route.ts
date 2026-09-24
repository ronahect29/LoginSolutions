import {
    Router,
} from "express";

import * as RolController from "../controllers/rol.controller";
import {
    requireAuth,
} from "../middlewares/authMiddleware";
import {
    requireRole,
} from "../middlewares/roleMiddleware";

const rolRoutes =
    Router();

// ======================================================
// ADMINISTRACIÓN DE ROLES
// ======================================================

rolRoutes.get(
    "/admin",
    requireAuth,
    requireRole([
        "SA-PAW",
    ]),
    RolController.getRolesAdmin
);

rolRoutes.post(
    "/admin",
    requireAuth,
    requireRole([
        "SA-PAW",
    ]),
    RolController.createRolAdmin
);

rolRoutes.put(
    "/admin/:id_rol",
    requireAuth,
    requireRole([
        "SA-PAW",
    ]),
    RolController.updateRolAdmin
);

rolRoutes.patch(
    "/admin/:id_rol/activo",
    requireAuth,
    requireRole([
        "SA-PAW",
    ]),
    RolController.changeActivoRolAdmin
);

// ======================================================
// CONSULTAS UTILIZADAS POR USUARIOS
// ======================================================

rolRoutes.get(
    "/findByActivoAndApp/:activo/:id_app",
    requireAuth,
    RolController.getRolesByActivoAndApp
);

rolRoutes.post(
    "/findByActivoAndCodigosAplicacionActivo",
    requireAuth,
    RolController
        .getRolesByActivoAndCodigosAplicacionActivo
);

export default rolRoutes;