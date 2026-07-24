import { Router } from "express";
import * as sesionController from "../controllers/sesionController";
const sessionRouter = Router();

sessionRouter.post("/login", sesionController.login);
sessionRouter.post("/logout", sesionController.logout);

export default sessionRouter;