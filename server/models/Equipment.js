import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  category: { type: String, required: true, enum: ['Audio', 'Cameras', 'Computing', 'Accessories'] },
  assetTag: { type: String, required: true, trim: true, uppercase: true, unique: true, maxlength: 30 },
  description: { type: String, trim: true, maxlength: 1200, default: '' },
  location: { type: String, required: true, trim: true, maxlength: 100 },
  status: { type: String, enum: ['available', 'on-loan', 'maintenance'], default: 'available' },
  activeRequest: { type: mongoose.Schema.Types.ObjectId, ref: 'BorrowRequest', default: null }
}, { timestamps: true });
export default mongoose.model('Equipment', schema);
