import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import User from './models/User.js';
import SystemLog from './models/SystemLog.js';
import sosRoutes from './routes/sosRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/vyomveda';
const JWT_SECRET = process.env.JWT_SECRET || 'skyscope_super_secret_key_2026';

// Database Connection with retry logic
mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ Connected to MongoDB'))
  .catch((err) => {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.log('Ensure MongoDB is running (mongod)');
  });

app.use(cors());
app.use(express.json());
app.use('/api/sos', sosRoutes);

// API Status with DB Check
app.get('/api/status', (req, res) => {
  res.json({
    status: 'VyomVeda OrbitX System Online',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date()
  });
});

// Admin Middleware
const adminAuth = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Access denied' });
  try {
    const verified = jwt.verify(token, JWT_SECRET);
    if (verified.role !== 'admin') return res.status(403).json({ error: 'Admin only access' });
    req.user = verified;
    next();
  } catch (err) {
    res.status(400).json({ error: 'Invalid token' });
  }
};

// OTP Store (In-Memory for simplicity)
const otpStore = new Map(); // email -> { otp, expiresAt }

// Nodemailer setup
let transporter;
nodemailer.createTestAccount().then((account) => {
  transporter = nodemailer.createTransport({
    host: account.smtp.host,
    port: account.smtp.port,
    secure: account.smtp.secure,
    auth: { user: account.user, pass: account.pass }
  });
  console.log("📧 Ethereal Email Ready for OTPs");
}).catch(console.error);

app.post('/api/auth/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  otpStore.set(email.toLowerCase(), {
    otp,
    expiresAt: Date.now() + 10 * 60 * 1000 // 10 mins
  });

  try {
    if (transporter) {
      let info = await transporter.sendMail({
        from: '"VyomVeda OrbitX" <auth@vyomveda.com>',
        to: email,
        subject: "Your OrbitX Security Code",
        text: `Your one-time security code is: ${otp}. It expires in 10 minutes.`,
        html: `<div style="font-family: monospace; background: #000; color: #00f3ff; padding: 20px; border: 1px solid #00f3ff; border-radius: 8px;">
                 <h2 style="color: white; margin-bottom: 5px;">VyomVeda OrbitX</h2>
                 <p style="color: #666; font-size: 12px; margin-top: 0;">GLOBAL SATELLITE NETWORK</p>
                 <br/>
                 <p>Identity Verification Code:</p>
                 <h1 style="color: #00f3ff; letter-spacing: 5px; font-size: 32px;">${otp}</h1>
                 <p style="color: #444; font-size: 11px;">Valid for 10 minutes.</p>
               </div>`
      });
      console.log("✉️ OTP Email sent! View it here: ", nodemailer.getTestMessageUrl(info));
    }
    res.json({ message: 'OTP sent successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
});

app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, otp } = req.body;
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not ready.' });
    }

    const storedData = otpStore.get(email.toLowerCase());
    if (!storedData || storedData.otp !== otp || storedData.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) return res.status(400).json({ error: 'User already exists' });

    user = new User({ email: email.toLowerCase(), password: 'otp-login-only' });
    await user.save();
    otpStore.delete(email.toLowerCase()); // consume OTP
    
    try { await new SystemLog({ action: 'Registration', details: email }).save(); } catch(e){}

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ token, user: { email: user.email, role: user.role } });
  } catch (error) {
    console.error('Reg Error:', error);
    res.status(500).json({ error: 'Server error during registration' });
  }
});

app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, otp } = req.body;
    
    const storedData = otpStore.get(email.toLowerCase());
    if (!storedData || storedData.otp !== otp || storedData.expiresAt < Date.now()) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: 'Account not found. Please register.' });

    otpStore.delete(email.toLowerCase()); // consume OTP

    try { await new SystemLog({ action: 'Login', details: email }).save(); } catch(e){}

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { email: user.email, role: user.role, profilePicture: user.profilePicture } });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
});

app.post('/api/user/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Unauthorized' });

    const decoded = jwt.verify(token, JWT_SECRET);
    const { profilePicture } = req.body;

    if (!profilePicture || !profilePicture.startsWith('data:image/')) {
        return res.status(400).json({ error: 'Invalid image format. Must be Base64.' });
    }

    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId, 
      { profilePicture },
      { new: true }
    );

    res.status(200).json({ 
        message: 'Profile picture updated successfully',
        user: { 
            email: updatedUser.email, 
            role: updatedUser.role,
            profilePicture: updatedUser.profilePicture 
        }
    });
  } catch (error) {
    console.error("Local Profile Upload Error:", error);
    res.status(500).json({ error: 'Failed to update profile picture' });
  }
});

// Placeholder for Satellite Data
app.get('/api/satellite-data', (req, res) => {
  res.json({
    satellites: [
      { id: 'S-101', name: 'OrbitX Alpha', lat: 28.6139, lng: 77.2090, alt: 400 },
      { id: 'S-102', name: 'OrbitX Beta', lat: 19.0760, lng: 72.8777, alt: 420 }
    ]
  });
});

// =============================================
// OrbitX System Connectivity APIs
// =============================================

// In-memory module state store
const systemModules = {
  'micro-sats': { id: 'micro-sats', name: 'Micro-Sats', type: 'Satellite', region: 'LEO', status: 'CONNECTED', signal: 97, lastActive: new Date() },
  'rovers': { id: 'rovers', name: 'Rovers', type: 'Ground', region: 'Mars/Moon', status: 'CONNECTED', signal: 84, lastActive: new Date() },
  'ai-brain': { id: 'ai-brain', name: 'AI Brain', type: 'Compute', region: 'Cloud', status: 'ACTIVE', signal: 100, lastActive: new Date() },
  'global-sim': { id: 'global-sim', name: 'Global SIM', type: 'Network', region: 'Worldwide', status: 'CONNECTED', signal: 92, lastActive: new Date() },
  'ground-stations': { id: 'ground-stations', name: 'Ground Stations', type: 'Ground', region: 'Global', status: 'CONNECTED', signal: 88, lastActive: new Date() },
};
const customNodes = [];

// GET /api/system-status — returns live module states with randomized signal drift
app.get('/api/system-status', (req, res) => {
  // Randomly drift signals each call to simulate live telemetry
  Object.values(systemModules).forEach(m => {
    m.signal = Math.max(60, Math.min(100, m.signal + (Math.random() * 6 - 3)));
    m.lastActive = new Date();
    // Very rarely flip to syncing (2% chance) then reset
    if (Math.random() < 0.02 && m.status === 'CONNECTED') m.status = 'SYNCING';
    else if (m.status === 'SYNCING') m.status = 'CONNECTED';
  });
  res.json({ modules: Object.values(systemModules), customNodes });
});

// POST /api/connect-node — add a new custom node
app.post('/api/connect-node', (req, res) => {
  const { name, type, region } = req.body;
  if (!name || !type || !region) return res.status(400).json({ error: 'name, type, region required' });
  const node = { id: `node-${Date.now()}`, name, type, region, status: 'CONNECTED', signal: Math.floor(Math.random() * 30 + 70), lastActive: new Date() };
  customNodes.push(node);
  console.log(`🛰️ New node connected: ${name}`);
  res.status(201).json({ message: 'Node connected successfully', node });
});

// POST /api/reset-system — reset all modules to SYNCING → CONNECTED
app.post('/api/reset-system', (req, res) => {
  Object.values(systemModules).forEach(m => { m.status = 'SYNCING'; m.signal = 100; });
  setTimeout(() => {
    Object.values(systemModules).forEach(m => { m.status = 'CONNECTED'; });
  }, 3000);
  console.log('🔄 System reset initiated');
  res.json({ message: 'System reset initiated. All modules syncing...' });
});

// POST /api/sync-ai — trigger AI Brain sync
app.post('/api/sync-ai', (req, res) => {
  systemModules['ai-brain'].status = 'SYNCING';
  setTimeout(() => { systemModules['ai-brain'].status = 'ACTIVE'; }, 4000);
  console.log('🧠 AI Brain sync triggered');
  res.json({ message: 'AI Brain sync initiated. Calibrating neural pathways...' });
});


// Socket logic
io.on('connection', (socket) => {
  const telemetryInterval = setInterval(() => {
    const rawData = { altitude: 400 + Math.random()*20, speed: 7.6 + Math.random()*0.2, battery: 90 + Math.random()*10 };
    
    const req = http.request('http://127.0.0.1:8000/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
    }, (res) => {
        let body = '';
        res.on('data', chunk => body += chunk);
        res.on('end', () => {
            let mlData = null;
            try { mlData = JSON.parse(body); } catch(e){}
            socket.emit('telemetry_update', {
                timestamp: new Date(),
                data: rawData,
                mlDiagnostics: mlData
            });
        });
    });
    
    req.on('error', (err) => {
       console.log('ML Service Unreachable:', err.message);
       socket.emit('telemetry_update', { timestamp: new Date(), data: rawData, mlDiagnostics: null });
    });
    
    req.write(JSON.stringify(rawData));
    req.end();
  }, 3000);

  socket.on('disconnect', () => clearInterval(telemetryInterval));
});

const PORT = process.env.PORT || 5001;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 OrbitX Backend live on port ${PORT}`);
});
