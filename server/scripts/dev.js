import "dotenv/config";
import { spawn } from "node:child_process";
import { randomBytes } from "node:crypto";
const demo =
  process.argv.includes("--demo") || process.env.CAMPUSKIT_DEMO === "true";
let database;
const env = { ...process.env };
if (demo) {
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  database = await MongoMemoryServer.create({
    instance: { args: ["--nounixsocket"] },
  });
  env.MONGODB_URI = database.getUri("campuskit_demo");
  env.JWT_SECRET = randomBytes(48).toString("hex");
  env.SEED_ADMIN_PASSWORD = "CampusKitDemo2026!";
  env.SEED_STUDENT_PASSWORD = "CampusKitDemo2026!";
  console.log(
    "DEMO MODE: temporary database. All demo data is removed when this process stops.",
  );
  const seed = spawn(process.execPath, ["server/scripts/seed.js"], {
    env,
    stdio: "inherit",
  });
  const code = await new Promise((resolve) => seed.on("exit", resolve));
  if (code !== 0) {
    await database.stop();
    process.exit(1);
  }
}
const children = [
  spawn(process.execPath, ["--watch", "server/index.js"], {
    env: { ...env, PORT: "5002" },
    stdio: "inherit",
  }),
  spawn(
    process.execPath,
    [
      "node_modules/vite/bin/vite.js",
      "--config",
      "client/vite.config.js",
      ...process.argv.slice(2).filter((arg) => arg !== "--demo"),
    ],
    { env, stdio: "inherit" },
  ),
];
let closing = false;
async function close(code = 0) {
  if (closing) return;
  closing = true;
  for (const child of children) child.kill("SIGTERM");
  if (database) await database.stop();
  process.exit(code);
}
for (const child of children) child.on("exit", (code) => close(code || 0));
process.on("SIGINT", () => close());
process.on("SIGTERM", () => close());
