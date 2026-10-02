import {
    Router
} from "express";

import {
    UsuarioController
} from "../controllers/usuario.controller";

import {
    requireAuth
} from "../middlewares/authMiddleware";

import {
    requireRole
} from "../middlewares/roleMiddleware";

const usuarioRoutes =
    Router();

usuarioRoutes.get(
    "/findAll",
    requireAuth,
    UsuarioController.getAll
);

usuarioRoutes.get(
    "/findOne/:id",
    requireAuth,
    UsuarioController.findByUsuarioId
);

usuarioRoutes.get(
    "/findAllWithRolesAndApps",
    requireAuth,
    UsuarioController.findAllWithRolesAndApps
);

usuarioRoutes.post(
    "/findByFilters",
    requireAuth,
    requireRole([
        "SA-PAW"
    ]),
    UsuarioController.findByFilters
);

usuarioRoutes.post(
    "/create",
    requireAuth,
    requireRole([
        "SA-PAW"
    ]),
    UsuarioController.create
);

usuarioRoutes.put(
    "/update/:id",
    requireAuth,
    requireRole([
        "SA-PAW"
    ]),
    UsuarioController.update
);

usuarioRoutes.patch(
    "/resetPassword/:id",
    requireAuth,
    requireRole([
        "SA-PAW"
    ]),
    UsuarioController.resetPassword
);

usuarioRoutes.patch(
    "/changeActivo/:id",
    requireAuth,
    requireRole([
        "SA-PAW"
    ]),
    UsuarioController.changeUsuarioActivoById
);

export default usuarioRoutes;