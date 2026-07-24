import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import dotenv from 'dotenv';
import router from './routes';
import { fixTimeFields, runPrismaBootstrap } from './bootstrap/prisma';

dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4100;

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 200, // limit each IP to 100 requests per windowMs
}));

app.use('/marcajes-api/api', router);

app.get('/health', (_req, res) => {
    res.json({ status: 'ok', service: 'marcajes-api' });
});

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Marcajes API is running on port ${PORT}`);
    console.log("INICIO DE PROCESOS AUTOMÁTICOS...");
    runPrismaBootstrap();
    //fixTimeFields();
    console.log("PROCESOS AUTOMÁTICOS FINALIZADOS.");
});