import "dotenv/config";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { createApp } from "./app.js";
try {
  const app = createApp(process.env.JWT_SECRET);
  await connectDB(process.env.MONGODB_URI);
  const server = app.listen(Number(process.env.PORT) || 5002, () =>
    console.log(`CampusKit API: http://localhost:${process.env.PORT || 5002}`),
  );
  for (const signal of ["SIGINT", "SIGTERM"])
    process.on(signal, () =>
      server.close(async () => {
        await mongoose.disconnect();
        process.exit(0);
      }),
    );
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
