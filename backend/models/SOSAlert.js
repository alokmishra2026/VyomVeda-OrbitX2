import mongoose from 'mongoose';

const SOSAlertSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true },
  type: { type: String, enum: ['Medical', 'Fire', 'Accident', 'Space Distress', 'Natural Disaster'], default: 'Medical' },
  status: { type: String, enum: ['PENDING', 'ACTIVE', 'RESCUE_IN_PROGRESS', 'SAFE'], default: 'ACTIVE' },
  vitals: {
    heartRate: { type: Number },
    oxygen: { type: Number },
    stressLevel: { type: String },
    suitPressure: { type: Number }
  },
  location: {
    lat: { type: Number },
    lng: { type: Number },
    altitude: { type: Number },
    method: { type: String, default: 'gps' }
  },
  timestamp: { type: Date, default: Date.now },
  resolvedAt: { type: Date }
});

export default mongoose.model('SOSAlert', SOSAlertSchema);
