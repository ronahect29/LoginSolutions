import {
    Router,
} from "express";

import * as sesionController from "../controllers/sesionController";
import {
    requireAuth,
} from "../middlewares/authMiddleware";

const sessionRouter =
    Router();

// ======================================================
// LOGIN
// ======================================================

sessionRouter.post(
    "/login",
    sesionController.login
);

// ======================================================
// VALIDACIÓN DE SESIÓN
// ======================================================

sessionRouter.get(
    "/validate",
    requireAuth,
    sesionController.validate
);

// ======================================================
// LOGOUT
// ======================================================

sessionRouter.post(
    "/logout",
    sesionController.logout
);

export default sessionRouter;