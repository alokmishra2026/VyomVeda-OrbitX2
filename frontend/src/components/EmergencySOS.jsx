import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldAlert, MapPin, Radio, HeartPulse, CheckCircle, ArrowLeft, Loader } from 'lucide-react';

const EmergencySOS = ({ onExit }) => {
  const [sosStatus, setSosStatus] = useState('IDLE'); // IDLE, SCANNING, TRANSMITTING, CONFIRMED
  const [logs, setLogs] = useState([]);

  const addLog = (msg) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`]);
  };

  const initiateSOS = () => {
    setSosStatus('SCANNING');
    addLog('WARNING: Emergency SOS protocol initiated.');
    addLog('Acquiring orbital lock with VyomVeda SOS Constellation...');
    
    setTimeout(() => {
       setSosStatus('TRANSMITTING');
       addLog('Orbital lock secured. 3 micro-satellites aligned.');
       addLog('Transmitting distress signal and vital telemetry...');
       addLog('Bypassing terrestrial networks. Upline: Secure.');
       
       setTimeout(() => {
          setSosStatus('CONFIRMED');
          addLog('Global Rescue Command has received the signal.');
          addLog('Evacuation unit dispatched to your exact GPS coordinates.');
       }, 4000);
    }, 3000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-4xl mx-auto space-y-6 pb-20"
    >
      <div className="flex justify-between items-center border-b border-red-500/30 pb-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 tracking-widest uppercase text-red-500">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
            GLOBAL SOS PROTOCOL
          </h2>
          <p className="text-xs text-red-400 uppercase tracking-widest mt-1">Satellite-based zero-lag emergency beacon.</p>
        </div>
        <button onClick={onExit} className="glass-panel px-4 py-2 hover:bg-white/10 transition-all text-xs font-bold uppercase text-red-400 hover:text-red-300 border-red-500/30">
          Abort System
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-[500px]">
        
        {/* BIG RED BUTTON PANEL */}
        <div className="glass-panel border-red-500/30 p-8 flex flex-col items-center justify-center relative overflow-hidden">
           <div className={`absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-red-900/40 via-black to-black transition-all duration-1000 ${sosStatus !== 'IDLE' ? 'opacity-100' : 'opacity-0'}`}></div>
           
           <h3 className="text-xl font-bold uppercase tracking-widest text-center mb-8 relative z-10 text-white">
             Zero-Lag Distress Beacon
           </h3>

           <AnimatePresence mode="wait">
             {sosStatus === 'IDLE' && (
               <motion.button 
                 key="idle"
                 initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }}
                 onClick={initiateSOS}
                 className="w-48 h-48 rounded-full bg-red-600 border-4 border-red-900 shadow-[0_0_50px_rgba(255,0,0,0.6)] flex items-center justify-center hover:bg-red-500 hover:scale-105 transition-all text-white font-bold text-2xl uppercase tracking-widest relative z-10"
               >
                 SOS
               </motion.button>
             )}
             
             {sosStatus === 'SCANNING' && (
               <motion.div key="scanning" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center relative z-10">
                 <Loader className="w-24 h-24 text-red-500 animate-[spin_2s_linear_infinite] mb-4" />
                 <p className="font-mono text-red-400 uppercase font-bold text-sm blink">Acquiring Satellites...</p>
               </motion.div>
             )}

             {sosStatus === 'TRANSMITTING' && (
               <motion.div key="transmitting" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col items-center relative z-10">
                 <Radio className="w-24 h-24 text-yellow-500 animate-ping mb-4" />
                 <p className="font-mono text-yellow-400 uppercase font-bold text-sm blink">Broadcasting Distress Upline...</p>
               </motion.div>
             )}

             {sosStatus === 'CONFIRMED' && (
               <motion.div key="confirmed" initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center relative z-10">
                 <CheckCircle className="w-24 h-24 text-green-500 mb-4" />
                 <p className="font-mono text-green-400 uppercase font-bold text-lg text-center drop-shadow-[0_0_10px_rgba(0,255,0,0.8)]">SIGNAL CONFIRMED<br/>RESCUE INBOUND</p>
               </motion.div>
             )}
           </AnimatePresence>

           <p className="text-[10px] text-gray-500 text-center mt-12 max-w-xs relative z-10">
             WARNING: Misuse of the VyomVeda Orbital distress network is a federal offense under United Nations Space Treaties.
           </p>
        </div>

        {/* TELEMETRY & LOG PANEL */}
        <div className="flex flex-col gap-4">
           <div className="glass-panel p-6 border-white/10 flex-1">
              <h3 className="text-xs font-bold uppercase tracking-widest text-red-400 mb-4 flex items-center gap-2 border-b border-red-500/20 pb-2">
                 <MapPin className="w-4 h-4" /> User Telemetry Packet
              </h3>
              <div className="space-y-3 font-mono text-xs text-gray-400">
                 <div className="flex justify-between">
                    <span>GPS LATITUDE:</span> <span className="text-white">34.0522° N</span>
                 </div>
                 <div className="flex justify-between">
                    <span>GPS LONGITUDE:</span> <span className="text-white">118.2437° W</span>
                 </div>
                 <div className="flex justify-between">
                    <span>ELEVATION:</span> <span className="text-white">71m (MSL)</span>
                 </div>
                 <div className="flex justify-between">
                    <span>TERRESTRIAL COMMS:</span> <span className="text-red-500">OFFLINE</span>
                 </div>
                 <div className="flex justify-between border-t border-white/10 pt-2 mt-2">
                    <span className="flex items-center gap-2"><HeartPulse className="w-3 h-3 text-red-500" /> BIO-METRICS:</span> 
                    <span className="text-yellow-400">HR: 110 | O2: 98%</span>
                 </div>
              </div>
           </div>

           <div className="glass-panel p-6 border-white/10 flex-1 flex flex-col overflow-hidden relative">
             <div className="absolute top-0 right-0 p-2">
               <div className={`w-3 h-3 rounded-full ${sosStatus === 'IDLE' ? 'bg-gray-600' : sosStatus === 'CONFIRMED' ? 'bg-green-500 shadow-[0_0_10px_rgba(0,255,0,0.8)]' : 'bg-red-500 animate-pulse shadow-[0_0_10px_rgba(255,0,0,0.8)]'}`}></div>
             </div>
             <h3 className="text-xs font-bold uppercase tracking-widest text-gray-500 mb-4">Command Link Console</h3>
             <div className="flex-1 overflow-y-auto space-y-2 font-mono text-[10px] custom-scrollbar">
               {logs.length === 0 ? (
                 <p className="text-gray-600">Awaiting user input...</p>
               ) : (
                 logs.map((log, i) => (
                   <p key={i} className="text-blue-400">{log}</p>
                 ))
               )}
             </div>
           </div>
        </div>

      </div>
    </motion.div>
  );
};

export default EmergencySOS;
