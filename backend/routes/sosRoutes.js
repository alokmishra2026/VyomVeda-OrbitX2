import express from 'express';
import SOSAlert from '../models/SOSAlert.js';

const router = express.Router();

// Trigger a new SOS
router.post('/trigger', async (req, res) => {
  try {
    const { userId, email, type, vitals, location } = req.body;
    
    const newAlert = new SOSAlert({
      userId: userId || 'anonymous',
      email: email || 'unknown',
      type: type || 'Medical',
      vitals: vitals || {},
      location: location || {},
      status: 'ACTIVE'
    });

    await newAlert.save();

    res.status(201).json({ message: 'SOS Triggered Successfully', alert: newAlert });
  } catch (error) {
    console.error('SOS Trigger Error:', error);
    res.status(500).json({ error: 'Failed to trigger SOS' });
  }
});

// Update SOS Status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const alert = await SOSAlert.findByIdAndUpdate(
      req.params.id, 
      { status, resolvedAt: status === 'SAFE' ? Date.now() : undefined }, 
      { new: true }
    );
    if (!alert) return res.status(404).json({ error: 'Alert not found' });
    res.json({ message: 'Status updated', alert });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update status' });
  }
});

// Get active SOS alerts
router.get('/active', async (req, res) => {
  try {
    const alerts = await SOSAlert.find({ status: { $ne: 'SAFE' } }).sort({ timestamp: -1 });
    res.json(alerts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
});

export default router;
