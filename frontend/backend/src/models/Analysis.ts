import mongoose from 'mongoose';

const AnalysisSchema = new mongoose.Schema({
  address: { type: String, required: true },
  score: { type: Number, required: true },
  signals: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

export const Analysis = mongoose.model('Analysis', AnalysisSchema);