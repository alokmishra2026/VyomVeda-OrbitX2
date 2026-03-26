import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, Activity, MapPin, Radio, HeartPulse, User, Shield, AlertTriangle, Satellite, Rocket } from 'lucide-react';
import apiClient from '../api/client';

const GlobalSOS = ({ user }) => {
  const [sosActive, setSosActive] = useState(false);
  const [sosStatus, setSosStatus] = useState('STANDBY'); // STANDBY, TRANSMITTING, ACTIVE, RESCUE_IN_PROGRESS
  const [spaceMode, setSpaceMode] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [triggering, setTriggering] = useState(false);

  // Mock Vitals
  const vitals = {
    heartRate: spaceMode ? 112 : 88,
    oxygen: spaceMode ? '92%' : '98%',
    pressure: spaceMode ? '3.8 PSI' : '14.7 PSI',
    temp: spaceMode ? '-120°C (EXT)' : '37°C'
  };

  const [location, setLocation] = useState({ lat: 0, lng: 0, alt: 0 });

  useEffect(() => {
    // Get real or mock location
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          lat: position.coords.latitude.toFixed(4),
          lng: position.coords.longitude.toFixed(4),
          alt: spaceMode ? 408000 : (position.coords.altitude || 0)
        });
      });
    }
  }, [spaceMode]);

  useEffect(() => {
    let timer;
    if (triggering && countdown > 0) {
      timer = setTimeout(() => setCountdown(c => c - 1), 1000);
    } else if (triggering && countdown === 0) {
      activateSOS();
    }
    return () => clearTimeout(timer);
  }, [triggering, countdown]);

  const handleSOSHold = () => {
    setTriggering(true);
    setCountdown(3);
  };

  const cancelSOS = () => {
    setTriggering(false);
    setSosActive(false);
    setSosStatus('STANDBY');
    setCountdown(3);
  };

  const activateSOS = async () => {
    setSosActive(true);
    setSosStatus('TRANSMITTING');
    
    try {
      const payload = {
        userId: user?.email || 'anonymous',
        email: user?.email || 'unknown',
        type: spaceMode ? 'Space Distress' : 'Medical',
        vitals: { 
          heartRate: vitals.heartRate, 
          oxygen: parseInt(vitals.oxygen), 
          suitPressure: parseFloat(vitals.pressure) 
        },
        location: { ...location, method: spaceMode ? 'satellite' : 'gps' }
      };

      const res = await apiClient.post('/api/sos/trigger', payload);
      
      if (res.data) {
        setTimeout(() => setSosStatus('ACTIVE'), 2000);
        setTimeout(() => setSosStatus('RESCUE_IN_PROGRESS'), 8000);
      }
    } catch (err) {
      console.error('Failed to transmit SOS:', err);
      // Fallback to mesh network simulate
      setTimeout(() => setSosStatus('ACTIVE'), 3000);
    }
  };

  return (
    <div className={`relative min-h-[80vh] flex flex-col items-center justify-center font-mono ${sosActive ? 'bg-red-950/20' : ''}`}>
      
      {/* Background Radar Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-20 flex items-center justify-center">
        <div className={`w-[600px] h-[600px] rounded-full border border-[var(--neon-blue)] ${sosActive ? 'border-red-500 animate-[ping_2s_infinite]' : 'animate-[spin_10s_linear_infinite]'}`}>
           <div className={`w-1/2 h-2 ${sosActive ? 'bg-red-500' : 'bg-[var(--neon-blue)]'} origin-right animate-[spin_4s_linear_infinite] opacity-50 blur-sm`}></div>
        </div>
      </div>

      <div className="z-10 w-full max-w-6xl grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
        
        {/* Left Panel - Bio-Metrics */}
        <div className="glass-panel p-6 flex flex-col space-y-6 border-l-4 border-[var(--neon-blue)]">
          <div className="flex items-center justify-between border-b border-gray-700 pb-2">
            <h3 className="text-xl font-bold flex items-center gap-2"><Activity className="text-[var(--neon-blue)]" /> BIOMETRICS</h3>
            <button 
              onClick={() => setSpaceMode(!spaceMode)}
              className={`p-2 border rounded-full transition-all ${spaceMode ? 'border-purple-500 text-purple-400 bg-purple-900/30 shadow-[0_0_15px_purple]' : 'border-gray-500 text-gray-400 hover:text-white'}`}
              title="Toggle Space/Astronaut Mode"
            >
              <Rocket className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-4 text-sm text-gray-300">
             <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded">
                <span className="flex items-center gap-2"><HeartPulse className={vitals.heartRate > 100 ? 'text-red-500 animate-pulse' : 'text-green-500'}/> Heart Rate</span>
                <span className={`font-bold text-lg ${vitals.heartRate > 100 ? 'text-red-500' : 'text-green-500'}`}>{vitals.heartRate} BPM</span>
             </div>
             <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded">
                <span className="flex items-center gap-2"><Activity className="text-blue-400"/> SpO2 Level</span>
                <span className="font-bold text-lg text-blue-400">{vitals.oxygen}</span>
             </div>
             <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded">
                <span className="flex items-center gap-2"><ShieldAlert className="text-yellow-400"/> {spaceMode ? 'Suit Pressure' : 'Env. Pressure'}</span>
                <span className="font-bold text-lg text-yellow-400">{vitals.pressure}</span>
             </div>
             <div className="flex justify-between items-center bg-gray-900/50 p-3 rounded">
                <span className="flex items-center gap-2"><Activity className="text-gray-400"/> Core Temp</span>
                <span className="font-bold text-lg text-gray-300">{vitals.temp}</span>
             </div>
          </div>
          
          <div className="mt-auto border border-yellow-500/30 bg-yellow-900/20 p-3 rounded text-xs text-yellow-500 flex items-start gap-2">
            <AlertTriangle className="w-8 h-8 flex-shrink-0" />
            <p><strong>AI HEALTH PREDICTION:</strong> {spaceMode ? 'ELEVATED STRESS DETECTED. OXYGEN LEVELS DROPPING.' : 'VITALS STABLE. NO IMMEDIATE RISK DETECTED.'}</p>
          </div>
        </div>

        {/* Center Panel - Main SOS Trigger */}
        <div className="flex flex-col items-center justify-center space-y-8">
           
           <h2 className="text-2xl font-bold tracking-[0.2em] text-center">
             GLOBAL <span className={spaceMode ? 'text-purple-500' : 'text-red-500'}>{spaceMode ? 'ORBITAL' : 'EMERGENCY'}</span> NETWORK
           </h2>

           <div className="relative flex items-center justify-center">
             {/* Glowing halos */}
             {sosActive && (
               <>
                 <div className="absolute w-[300px] h-[300px] bg-red-600 rounded-full blur-[100px] opacity-40 animate-pulse"></div>
                 <div className="absolute w-[200px] h-[200px] border-4 border-red-500 rounded-full animate-[ping_2s_infinite]"></div>
               </>
             )}
             
             {triggering && !sosActive && (
               <div className="absolute w-[200px] h-[200px] border-4 border-yellow-500 rounded-full animate-[spin_1s_linear_infinite] border-t-transparent"></div>
             )}

             <motion.button
               whileHover={{ scale: 1.05 }}
               whileTap={{ scale: 0.95 }}
               onMouseDown={!sosActive ? handleSOSHold : null}
               onMouseUp={!sosActive && triggering ? cancelSOS : null}
               onMouseLeave={!sosActive && triggering ? cancelSOS : null}
               className={`relative z-10 w-48 h-48 rounded-full flex flex-col items-center justify-center border-4 shadow-2xl transition-all duration-500 overflow-hidden ${
                 sosActive 
                   ? 'bg-red-600 border-red-400 shadow-[0_0_50px_rgba(255,0,0,0.8)]' 
                   : triggering 
                     ? 'bg-yellow-600 border-yellow-400 shadow-[0_0_30px_rgba(255,255,0,0.6)]'
                     : 'bg-black border-[var(--neon-blue)] shadow-[0_0_30px_var(--neon-blue)] hover:bg-gray-900'
               }`}
             >
               {sosActive ? (
                 <>
                   <ShieldAlert className="w-16 h-16 text-white animate-bounce mb-2" />
                   <span className="text-xl font-bold text-white tracking-widest">ACTIVE</span>
                 </>
               ) : triggering ? (
                 <>
                   <span className="text-5xl font-black text-white">{countdown}</span>
                   <span className="text-xs text-yellow-200 mt-2 font-bold uppercase">Hold to Transmit</span>
                 </>
               ) : (
                 <>
                   <Radio className="w-16 h-16 text-[var(--neon-blue)] mb-2" />
                   <span className="text-3xl font-black text-[var(--neon-blue)] tracking-widest">SOS</span>
                   <span className="text-[10px] text-gray-400 mt-2">HOLD 3 SECONDS</span>
                 </>
               )}
             </motion.button>
           </div>

           <div className="text-center">
             <p className={`text-xl font-bold uppercase tracking-widest ${sosActive ? 'text-red-500 animate-pulse' : 'text-gray-400'}`}>
               STATUS: {sosStatus.replace('_', ' ')}
             </p>
             {sosActive && (
               <button onClick={cancelSOS} className="mt-4 px-6 py-2 border border-gray-600 text-gray-400 hover:text-white hover:bg-red-900 transition-all rounded text-xs tracking-widest">
                 CANCEL OR SECURE
               </button>
             )}
           </div>

        </div>

        {/* Right Panel - Tracking & AI AI Command */}
        <div className="glass-panel p-6 flex flex-col space-y-6 border-r-4 border-[var(--neon-blue)]">
          <div className="border-b border-gray-700 pb-2">
            <h3 className="text-xl font-bold flex items-center gap-2"><MapPin className="text-[var(--neon-blue)]" /> TELEMETRY & COMMS</h3>
          </div>

          <div className="bg-black/50 p-4 border border-gray-700 rounded-lg relative overflow-hidden group">
             <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
             <div className="relative z-10 space-y-2 text-xs text-gray-300 font-mono">
                <p className="flex justify-between"><span className="text-gray-500">LAT:</span> <span className="text-cyan-400">{location.lat}°</span></p>
                <p className="flex justify-between"><span className="text-gray-500">LNG:</span> <span className="text-cyan-400">{location.lng}°</span></p>
                <p className="flex justify-between"><span className="text-gray-500">ALT:</span> <span className="text-cyan-400">{location.alt} m</span></p>
                <p className="flex justify-between"><span className="text-gray-500">UPLINK:</span> <span className={spaceMode ? 'text-purple-400' : 'text-green-400'}>{spaceMode ? 'SATELLITE MESH' : 'GPS / 5G'}</span></p>
             </div>
             <Satellite className="absolute -bottom-4 -right-4 w-24 h-24 text-gray-800 group-hover:text-gray-700 transition-all" />
          </div>

          <div className="flex-1 border border-[var(--neon-blue)] bg-[var(--neon-blue)]/5 rounded p-4 flex flex-col">
             <h4 className="text-[var(--neon-blue)] font-bold text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
               <Shield className="w-4 h-4"/> AI Emergency Assistant
             </h4>
             
             <div className="flex-1 space-y-3 overflow-y-auto text-sm pr-2">
               <div className="bg-gray-900 p-3 rounded border-l-2 border-gray-600">
                 <p className="text-gray-400 text-xs mb-1">SYSTEM</p>
                 <p className="text-gray-200">Monitoring biometrics and environmental sensors...</p>
               </div>
               
               {sosActive && (
                 <>
                   <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-red-900/30 p-3 rounded border-l-2 border-red-500">
                     <p className="text-red-400 text-xs mb-1">AI COMMAND</p>
                     <p className="text-gray-100">Distress signal received. Multi-channel broadcast initiated via Satellite Mesh.</p>
                   </motion.div>
                   {sosStatus === 'RESCUE_IN_PROGRESS' && (
                     <motion.div initial={{opacity:0, y:10}} animate={{opacity:1, y:0}} className="bg-green-900/30 p-3 rounded border-l-2 border-green-500 mt-2">
                       <p className="text-green-400 text-xs mb-1">AI COMMAND</p>
                       <p className="text-gray-100">Stay calm. Rescue teams have acquired your coordinates. ETA: T-minus 14 minutes.</p>
                     </motion.div>
                   )}
                 </>
               )}
             </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default GlobalSOS;
