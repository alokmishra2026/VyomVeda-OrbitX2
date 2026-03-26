import { connectToDatabase } from '../_utils/db.js';
import { User } from '../_utils/models.js';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'skyscope_super_secret_key_2026';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  // Extract Token
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Unauthorized' });

  let decoded;
  try {
    decoded = jwt.verify(token, JWT_SECRET);
  } catch (err) {
    return res.status(401).json({ error: 'Invalid Token' });
  }

  const { profilePicture } = req.body;
  
  // Basic Validation
  if (!profilePicture || !profilePicture.startsWith('data:image/')) {
      return res.status(400).json({ error: 'Invalid image format. Must be Base64 data URI.' });
  }

  if (profilePicture.length > 500 * 1024) { // 500 KB limit for safety
      return res.status(400).json({ error: 'Image too large. Please compress before uploading.' });
  }

  await connectToDatabase();

  try {
    const updatedUser = await User.findByIdAndUpdate(
      decoded.userId, 
      { profilePicture },
      { new: true }
    );

    if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
    }

    res.status(200).json({ 
        message: 'Profile picture updated successfully',
        user: { 
            email: updatedUser.email, 
            role: updatedUser.role,
            profilePicture: updatedUser.profilePicture 
        }
    });
  } catch (error) {
    console.error("Profile Upload Error:", error);
    res.status(500).json({ error: 'Failed to update profile picture' });
  }
}
