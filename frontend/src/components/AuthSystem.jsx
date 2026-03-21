import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, Lock, Mail, X, Orbit } from 'lucide-react';

const AuthSystem = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      const response = await fetch('/api/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to send OTP');
      
      setOtpSent(true);
      setSuccessMsg('Security code dispatched to your comms channel.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? '/api/auth/login' : '/api/auth/register';
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp })
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      localStorage.setItem('orbitx_token', data.token);
      localStorage.setItem('orbitx_user', JSON.stringify(data.user));
      onLogin(data.user);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      >
        <motion.div 
          initial={{ scale: 0.9, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          className="glass-panel w-full max-w-md p-8 relative neon-border-blue bg-black/40"
        >
          <button 
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-400 hover:text-white transition-all"
          >
            <X className="w-6 h-6" />
          </button>

          <div className="text-center mb-8">
            <Orbit className="w-12 h-12 mx-auto text-blue-500 mb-4 animate-[spin_10s_linear_infinite]" />
            <h2 className="text-2xl font-bold italic tracking-wider text-white">
              {isLogin ? 'SYSTEM LOGIN' : 'CREATE ID'}
            </h2>
            <p className="text-xs text-gray-400 uppercase mt-2 tracking-widest">
              {isLogin ? 'Authenticate to access OrbitX' : 'Register for global network access'}
            </p>
          </div>

          {error && (
            <div className="bg-red-500/10 border border-red-500/50 text-red-400 p-3 rounded mb-6 text-sm text-center">
              {error}
            </div>
          )}

          {successMsg && (
            <div className="bg-green-500/10 border border-green-500/50 text-green-400 p-3 rounded mb-6 text-sm text-center">
              {successMsg}
            </div>
          )}

          {!otpSent ? (
            <form onSubmit={handleRequestOTP} className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono"
                    placeholder="agent@vyomveda.com"
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={loading}
                className="w-full py-4 glass-panel neon-border-blue font-bold text-blue-400 hover:bg-[var(--neon-blue)] hover:text-black transition-all tracking-widest uppercase text-sm disabled:opacity-50"
              >
                {loading ? 'Transmitting...' : 'Request Secure Link (OTP)'}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerify} className="space-y-6">
              <div className="space-y-2 text-left">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Awaiting 6-Digit Verification Code</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input 
                    type="text" 
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    maxLength={6}
                    className="w-full bg-black/40 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all font-mono text-center tracking-[1em] text-xl"
                    placeholder="------"
                  />
                </div>
              </div>
              <button 
                type="submit"
                disabled={loading || otp.length < 6}
                className="w-full py-4 glass-panel neon-border-blue font-bold text-blue-400 hover:bg-[var(--neon-blue)] hover:text-black transition-all tracking-widest uppercase text-sm disabled:opacity-50"
              >
                {loading ? 'Verifying...' : isLogin ? 'Initialize System Access' : 'Register Identity Credentials'}
              </button>
              <button 
                type="button"
                onClick={() => setOtpSent(false)}
                className="w-full py-2 text-xs text-gray-400 hover:text-white transition-all underline decoration-gray-600 underline-offset-4"
              >
                Use a different email address?
              </button>
            </form>
          )}

          <div className="mt-6 text-center">
            <button 
              onClick={() => setIsLogin(!isLogin)}
              className="text-xs text-gray-400 hover:text-white transition-all underline decoration-gray-600 underline-offset-4"
            >
              {isLogin ? "Need an OrbitX ID? Create one." : "Already have an ID? Login."}
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default AuthSystem;
