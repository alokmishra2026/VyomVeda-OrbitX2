import { connectToDatabase } from '../_utils/db.js';
import { User, OTP, SystemLog } from '../_utils/models.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'skyscope_super_secret_key_2026';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  await connectToDatabase();
  
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });

  try {
    const validOtp = await OTP.findOneAndDelete({ email: email.toLowerCase(), otp: otp });
    if (!validOtp) return res.status(400).json({ error: 'Invalid or expired OTP' });

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) return res.status(400).json({ error: 'Account not found. Please register.' });

    try { await SystemLog.create({ action: 'Login', details: email }); } catch(e){}

    const token = jwt.sign({ userId: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ token, user: { email: user.email, role: user.role } });
  } catch (error) {
    res.status(500).json({ error: 'Server error during login' });
  }
}
