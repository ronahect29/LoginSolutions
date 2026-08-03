import { execSync } from "node:child_process";

export function runPrismaBootstrap(): void {
    if (process.env.RUN_PRISMA_BOOTSTRAP !== "true") {
        return;
    }

    try {
        console.log("Generando cliente de Prisma...");

        execSync("npx prisma generate", {
            stdio: "inherit"
        });

        console.log("Cliente de Prisma generado correctamente.");
    } catch (error) {
        console.error(
            "Error durante la generación del cliente de Prisma:",
            error
        );

        throw error;
    }
}