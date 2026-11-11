import express from "express";
import helmet from "helmet";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { apiRouter } from "./routes/api.js";
import { notFound, errorHandler } from "./middleware/errors.js";
export function createApp(secret) {
  if (!secret || secret.length < 32 || secret.startsWith("REPLACE_"))
    throw new Error(
      "Set JWT_SECRET to a random value of at least 32 characters in .env.",
    );
  const app = express();
  app.disable("x-powered-by");
  app.use(helmet());
  app.use(express.json({ limit: "32kb" }));
  app.use("/api", (req, res, next) => {
    if (
      ["POST", "PATCH"].includes(req.method) &&
      (!req.body || typeof req.body !== "object" || Array.isArray(req.body))
    )
      return res
        .status(400)
        .json({ message: "Send a JSON object as the request body." });
    next();
  });
  app.get("/api/health", (req, res) => res.json({ status: "ok" }));
  app.use("/api", apiRouter(secret));
  app.use("/api", notFound);
  const dist = path.resolve(
    path.dirname(fileURLToPath(import.meta.url)),
    "../client/dist",
  );
  app.use(express.static(dist));
  app.get("/{*splat}", (req, res) =>
    res.sendFile(path.join(dist, "index.html")),
  );
  app.use(errorHandler);
  return app;
}
