import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
const SCHEMA_PATH = path.join(__dirname, "../../prisma/schema.prisma");
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

export function fixTimeFields() {
  let schema = fs.readFileSync(SCHEMA_PATH, "utf8");

  // Reemplaza SOLO DateTime @db.Time
  const updated = schema.replace(
    /DateTime\s+@db\.Time/g,
    "String   @db.Time"
  );

  if (schema !== updated) {
    fs.writeFileSync(SCHEMA_PATH, updated);
    console.log("✔ TIME fields converted to String");
  } else {
    console.log("ℹ No TIME fields found to convert");
  }
}