import { execSync } from 'child_process';
export function runPrismaBootstrap() {
    if (process.env.RUN_PRISMA_BOOTSTRAP !== "true") return;

    try {
        console.log("🔄 Running prisma db pull...");
        execSync("npx prisma db pull", { stdio: "inherit" });

        console.log("⚙️ Running prisma generate...");
        execSync("npx prisma generate", { stdio: "inherit" });

        console.log("✅ Prisma bootstrap completed");
    } catch (error) {
        console.error("❌ Prisma bootstrap failed", error);
        process.exit(1);
    }
}
