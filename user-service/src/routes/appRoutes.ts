import {
    Router,
} from "express";

import * as appController from "../controllers/appController";
import {
    requireAuth,
} from "../middlewares/authMiddleware";
import {
    requireRole,
} from "../middlewares/roleMiddleware";

const router =
    Router();

// ======================================================
// LISTADO
// ======================================================

router.get(
    "/",
    requireAuth,
    requireRole([
        "SA-PAW",
    ]),
    appController.getApps
);

// ======================================================
// CREACIÓN
// ======================================================

router.post(
    "/",
    requireAuth,
    requireRole([
        "SA-PAW",
    ]),
    appController.createApp
);

// ======================================================
// ACTUALIZACIÓN
// ======================================================

router.put(
    "/:id",
    requireAuth,
    requireRole([
        "SA-PAW",
    ]),
    appController.updateApp
);

// ======================================================
// CAMBIO DE ESTADO
// ======================================================

router.patch(
    "/:id/activo",
    requireAuth,
    requireRole([
        "SA-PAW",
    ]),
    appController.changeAppActivo
);

export default router;