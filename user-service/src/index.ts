import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import router from "./routes"
import { runPrismaBootstrap } from './bootstrap/prisma'

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutos
    max: 100, // limitar a cada IP a solo 100 peticiones por ventana
}));

app.use("/user-service/api", router);

app.get('/health', (_req, res) => {
    res.json({ status: "ok", service: "user-service" });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`User Service running on port ${PORT}`);
    console.log("Inicia proceso de configuración inicial...");
    runPrismaBootstrap();
    console.log("Proceso de configuración inicial finalizado.");
});