import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
  action: { type: String, required: true },
  details: { type: String },
  timestamp: { type: Date, default: Date.now },
  severity: { type: String, enum: ['info', 'warning', 'critical'], default: 'info' }
});

const SystemLog = mongoose.model('SystemLog', logSchema);
export default SystemLog;
