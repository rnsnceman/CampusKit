import mongoose from 'mongoose';
export async function connectDB(uri) {
  if (!uri) throw new Error('MONGODB_URI is required. Copy .env.example to .env.');
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 10000 });
  await Promise.all(Object.values(mongoose.models).map(model => model.init()));
}
