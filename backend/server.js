import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import http from 'http';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import User from './models/User.js';
import SystemLog from './models/SystemLog.js';

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

// Auth Routes
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ error: 'Database not ready. Please try again later.' });
    }

    let user = await User.findOne({ email: email.toLowerCase() });
    if (user) return res.status(400).json({ error: 'User already exists' });

    user = new User({ email: email.toLowerCase(), password });
    await user.save();
    
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
    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ error: 'Invalid credentials' });

    try { await new SystemLog({ action: 'Login', details: email }).save(); } catch(e){}

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, user: { email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
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
