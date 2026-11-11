import "dotenv/config";
import bcrypt from "bcryptjs";
import { randomBytes } from "node:crypto";
import mongoose from "mongoose";
import { connectDB } from "../config/db.js";
import User from "../models/User.js";
import Equipment from "../models/Equipment.js";
const samples = [
  [
    "Sony Alpha a6400",
    "Cameras",
    "CAM-001",
    "Media lab · B201",
    "Compact mirrorless camera with a 16-50mm lens. Ideal for interviews, short films, and campus projects.",
  ],
  [
    "Audio-Technica AT2020",
    "Audio",
    "AUD-001",
    "Audio lab · C104",
    "Condenser microphone with a stand and XLR cable. Audio interface required.",
  ],
  [
    "Focusrite Scarlett 2i2",
    "Audio",
    "AUD-002",
    "Audio lab · C104",
    "Two-input USB audio interface for recording vocals, instruments, and podcasts.",
  ],
  [
    "MacBook Air M2",
    "Computing",
    "LAP-001",
    "IT desk · A110",
    "Lightweight laptop with 16GB memory, a charger, and a protective sleeve.",
  ],
  [
    "Manfrotto Compact Tripod",
    "Accessories",
    "ACC-001",
    "Media lab · B201",
    "Portable camera tripod with a quick-release plate and carrying bag.",
  ],
  [
    "Canon EOS Rebel T7",
    "Cameras",
    "CAM-002",
    "Media lab · B201",
    "Entry-level DSLR with an 18-55mm lens, battery, and SD card.",
  ],
  [
    "Zoom H5 Recorder",
    "Audio",
    "AUD-003",
    "Audio lab · C104",
    "Portable recorder for field recordings and interviews. Includes a windscreen.",
  ],
  [
    "LED Video Light Kit",
    "Accessories",
    "ACC-002",
    "Media lab · B201",
    "Bi-colour LED panel, light stand, power supply, and carry case.",
  ],
];
try {
  await connectDB(process.env.MONGODB_URI);
  for (const [name, email, role, key] of [
    [
      "CampusKit Administrator",
      "admin@campuskit.test",
      "admin",
      "SEED_ADMIN_PASSWORD",
    ],
    [
      "Demo Student",
      "student@campuskit.test",
      "student",
      "SEED_STUDENT_PASSWORD",
    ],
  ]) {
    if (await User.exists({ email })) {
      console.log(`${email}: already exists (password unchanged).`);
      continue;
    }
    const password = process.env[key] || randomBytes(15).toString("base64url");
    if (password.length < 10 || Buffer.byteLength(password) > 72)
      throw new Error(
        `${key} must have 10 characters minimum and 72 bytes maximum.`,
      );
    await User.create({
      name,
      email,
      role,
      password: await bcrypt.hash(password, 12),
    });
    console.log(`Created ${role}: ${email} | Password: ${password}`);
  }
  for (const [name, category, assetTag, location, description] of samples)
    await Equipment.updateOne(
      { assetTag },
      {
        $setOnInsert: {
          name,
          category,
          assetTag,
          location,
          description,
          status: "available",
        },
      },
      { upsert: true, runValidators: true },
    );
  console.log("Sample equipment ready. Existing records were preserved.");
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
} finally {
  await mongoose.disconnect();
}
