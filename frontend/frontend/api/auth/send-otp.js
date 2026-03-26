import { connectToDatabase } from '../_utils/db.js';
import { OTP } from '../_utils/models.js';
import nodemailer from 'nodemailer';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method Not Allowed' });

  await connectToDatabase();

  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });

  const otpCode = Math.floor(100000 + Math.random() * 900000).toString();

  // Save to DB
  await OTP.findOneAndDelete({ email: email.toLowerCase() }); // Clear old OTPs
  await OTP.create({ email: email.toLowerCase(), otp: otpCode });

  try {
    const account = await nodemailer.createTestAccount();
    const transporter = nodemailer.createTransport({
      host: account.smtp.host,
      port: account.smtp.port,
      secure: account.smtp.secure,
      auth: { user: account.user, pass: account.pass }
    });

    let info = await transporter.sendMail({
      from: '"VyomVeda OrbitX" <auth@vyomveda.com>',
      to: email,
      subject: "Your OrbitX Security Code",
      text: `Your one-time security code is: ${otpCode}`,
      html: `<div style="font-family: monospace; background: #000; color: #00f3ff; padding: 20px; border: 1px solid #00f3ff; border-radius: 8px;">
               <h2 style="color: white; margin-bottom: 5px;">VyomVeda OrbitX</h2>
               <p style="color: #666; font-size: 12px; margin-top: 0;">GLOBAL SATELLITE NETWORK</p>
               <br/>
               <p>Identity Verification Code:</p>
               <h1 style="color: #00f3ff; letter-spacing: 5px; font-size: 32px;">${otpCode}</h1>
               <p style="color: #444; font-size: 11px;">Valid for 10 minutes.</p>
             </div>`
    });

    console.log("✉️ Vercel Serverless OTP Email sent! View it here:", nodemailer.getTestMessageUrl(info));
    res.status(200).json({ message: 'OTP sent successfully', preview: nodemailer.getTestMessageUrl(info) });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
}
