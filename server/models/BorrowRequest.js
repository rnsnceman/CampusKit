import mongoose from 'mongoose';
const schema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  equipment: { type: mongoose.Schema.Types.ObjectId, ref: 'Equipment', required: true },
  equipmentName: { type: String, required: true }, assetTag: { type: String, required: true },
  requesterName: { type: String, required: true },
  dueDate: { type: Date, required: true },
  purpose: { type: String, required: true, trim: true, maxlength: 500 },
  status: { type: String, enum: ['pending', 'approved', 'rejected', 'cancelled', 'returned'], default: 'pending' },
  decisionNote: { type: String, trim: true, maxlength: 500, default: '' }
}, { timestamps: true });
// One pending or active request per student per individual asset.
schema.index({ user: 1, equipment: 1 }, { unique: true, partialFilterExpression: { status: { $in: ['pending', 'approved'] } } });
export default mongoose.model('BorrowRequest', schema);
