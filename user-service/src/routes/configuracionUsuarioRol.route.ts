import {
    Router
} from "express";

import {
    ConfiguracionUsuarioRolController
} from "../controllers/configuracionUsuarioRol.controller";

import {
    requireAuth
} from "../middlewares/authMiddleware";

import {
    requireRole
} from "../middlewares/roleMiddleware";


const configuracionUsuarioRolRoutes =
    Router();


configuracionUsuarioRolRoutes.use(
    requireAuth,
    requireRole([
        "SA-PAW"
    ])
);


configuracionUsuarioRolRoutes.get(
    "/findAll",
    ConfiguracionUsuarioRolController
        .findAll
);


configuracionUsuarioRolRoutes.get(
    "/findOne/:id",
    ConfiguracionUsuarioRolController
        .findOne
);


configuracionUsuarioRolRoutes.get(
    "/findRolesByUsuarioIdAndAplicacionCodigo/:id/:codeApp",
    ConfiguracionUsuarioRolController
        .findRolesByUsuarioIdAndAplicacionCodigo
);


configuracionUsuarioRolRoutes.get(
    "/findAccessByUsuarioId/:id",
    ConfiguracionUsuarioRolController
        .findAccessByUsuarioId
);


configuracionUsuarioRolRoutes.post(
    "/create",
    ConfiguracionUsuarioRolController
        .create
);


configuracionUsuarioRolRoutes.put(
    "/updateAccessByUsuarioId/:id",
    ConfiguracionUsuarioRolController
        .updateAccessByUsuarioId
);


export default configuracionUsuarioRolRoutes;