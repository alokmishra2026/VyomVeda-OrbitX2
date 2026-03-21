import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Satellite, 
  MapPin, 
  Wifi, 
  Radio, 
  Activity, 
  Cpu, 
  Youtube,
  Zap,
  Globe,
  ShieldAlert,
  ShieldCheck,
  Link
} from 'lucide-react';
import io from 'socket.io-client';
import ThreeScene from './ThreeScene';
import NetworkMap from './NetworkMap';
import VyomvedaSim from './VyomvedaSim';

const socket = io('http://localhost:5001');

const Dashboard = () => {
  const [telemetry, setTelemetry] = useState({
    altitude: 408,
    speed: 7.66,
    temp: -45,
    battery: 98
  });
  const [mlData, setMlData] = useState(null);
  const [isLive, setIsLive] = useState(false);
  const [showSimManager, setShowSimManager] = useState(false);

  const [logs, setLogs] = useState([
    "Satellite S-102 initialized...",
    "Global SIM handshake successful.",
    "Connecting to Rover R-Beta...",
    "AI Brain analyzing orbital debris..."
  ]);

  useEffect(() => {
    socket.on('connect', () => {
      setIsLive(true);
      setLogs(prev => ["CONNECTED TO ORBITX BACKEND", ...prev]);
    });

    socket.on('telemetry_update', (update) => {
      setTelemetry(update.data);
      if (update.mlDiagnostics) {
         setMlData(update.mlDiagnostics);
         setLogs(prev => [`[ML] Python Anomaly Risk: ${update.mlDiagnostics.ml_anomaly_score}%`, ...prev]);
      }
      setIsLive(true);
      setTimeout(() => setIsLive(false), 500); // Pulse effect
    });

    socket.on('disconnect', () => {
      setIsLive(false);
      setLogs(prev => ["DISCONNECTED FROM BACKEND", ...prev]);
    });

    return () => {
      socket.off('connect');
      socket.off('telemetry_update');
      socket.off('disconnect');
    };
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-6"
    >
      {/* 3D Visualizer Mocked Area */}
      <div className="md:col-span-8 glass-panel h-[500px] relative overflow-hidden neon-border-blue">
        <div className="absolute top-4 left-4 z-20 space-y-2">
          <div className="bg-black/80 px-4 py-2 rounded text-xs font-mono border-l-2 border-[var(--neon-blue)] flex items-center gap-2">
            VIEW: ORBITAL_LIVE_FEED
            {isLive && <span className="w-2 h-2 rounded-full bg-red-600 animate-ping" />}
          </div>
          <div className="bg-black/80 px-4 py-2 rounded text-xs font-mono border-l-2 border-green-500 flex items-center gap-2">
            SAT: S-122 [ACTIVE]
            <span className="text-[8px] text-green-500">SYNCED</span>
          </div>
        </div>

        {/* Real Three.js Earth Model */}
        <div className="absolute inset-0">
           <ThreeScene />
        </div>
        
        {/* Overlay for Three.js */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />


        <div className="absolute bottom-4 right-4 z-20 grid grid-cols-2 gap-4">
           {Object.entries(telemetry).map(([key, val]) => (
             <div key={key} className="glass-panel p-3 min-w-[120px]">
               <p className="text-[10px] text-gray-500 uppercase">{key}</p>
               <p className="text-lg font-bold font-mono neon-text-blue">{val.toFixed(2)}</p>
             </div>
           ))}
        </div>
      </div>

      {/* Control Panel / Telemetry */}
      <div className="md:col-span-4 space-y-6">
        <div className="glass-panel p-6 neon-border-blue">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Activity className="w-5 h-5 mr-2 neon-text-blue" />
            Live System Log
          </h3>
          <div className="h-[250px] overflow-y-auto space-y-2 font-mono text-xs text-gray-400 pr-2">
            {logs.map((log, i) => (
              <div key={i} className="flex space-x-2 border-b border-gray-800 pb-1">
                <span className="text-[var(--neon-blue)]">[{new Date().toLocaleTimeString()}]</span>
                <span>{log}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-panel p-6 neon-border-blue">
          <h3 className="text-xl font-bold mb-4 flex items-center">
            <Youtube className="w-5 h-5 mr-2 text-red-500" />
            OrbitX Academy
          </h3>
          <div className="relative">
            <input 
              type="text" 
              placeholder="Search Space Knowledge..." 
              className="w-full bg-black/50 border border-gray-700 rounded-lg py-2 px-4 focus:border-[var(--neon-blue)] outline-none"
            />
          </div>
          <div className="mt-4 space-y-3">
             <div className="flex items-center space-x-3 cursor-pointer hover:bg-white/5 p-2 rounded transition-all">
               <div className="w-16 h-10 bg-gray-800 rounded" />
               <p className="text-xs">Quantum Communication in Deep Space</p>
             </div>
             <div className="flex items-center space-x-3 cursor-pointer hover:bg-white/5 p-2 rounded transition-all">
               <div className="w-16 h-10 bg-gray-800 rounded" />
               <p className="text-xs">Advanced Rover Navigation Algorithms</p>
             </div>
          </div>
        </div>
        <div className="glass-panel p-6 border-purple-500/30">
          <h3 className="text-xl font-bold mb-4 flex items-center text-purple-400">
             <Zap className="w-5 h-5 mr-2" />
             Python ML Analytics
          </h3>
          <div className="space-y-4">
             {mlData ? (
               <>
                 <div className={`p-3 rounded-lg border flex flex-col gap-1 ${mlData.status === 'NOMINAL' ? 'bg-green-500/10 border-green-500/20' : mlData.status === 'CRITICAL' ? 'bg-red-500/10 border-red-500/20 animate-pulse' : 'bg-yellow-500/10 border-yellow-500/20'}`}>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{color: mlData.status === 'NOMINAL' ? '#4ade80' : mlData.status === 'CRITICAL' ? '#ef4444' : '#eab308'}}>
                      System Status: {mlData.status}
                    </p>
                    <p className="text-xs text-gray-300">Anomaly Risk Factor: <span className="font-mono text-white">{mlData.ml_anomaly_score.toFixed(1)}%</span></p>
                 </div>
                 <div className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-1">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Environmental Threats</p>
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>Solar Flares:</span> <span className="font-mono text-purple-400">{mlData.solar_flare_probability.toFixed(1)}%</span>
                    </div>
                    <div className="flex justify-between text-xs text-gray-300">
                      <span>Orbital Debris:</span> <span className="font-mono text-orange-400">{mlData.debris_collision_risk.toFixed(1)}%</span>
                    </div>
                 </div>
                 <div className="pt-2">
                   <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--neon-blue)]">» AI Recommendation</p>
                   <p className="text-xs text-gray-300 italic opacity-80">{mlData.ai_recommendation}</p>
                 </div>
               </>
             ) : (
               <div className="p-4 border border-dashed border-gray-600 rounded bg-black/20 flex flex-col items-center justify-center text-center">
                 <Activity className="w-6 h-6 text-purple-500 animate-pulse mb-2" />
                 <p className="text-xs text-gray-500 uppercase tracking-widest animate-pulse">Awaiting Python Model Uplink...</p>
                 <p className="text-[10px] text-gray-600 mt-1">Connecting to FastAPI (port 8000)</p>
               </div>
             )}
          </div>
        </div>
      </div>

      {/* Connectivity & Linking Grid */}
      <div className="md:col-span-12 glass-panel p-8 neon-border-blue min-h-[300px]">
         <div className="flex justify-between items-center mb-8">
            <h3 className="text-2xl font-bold flex items-center italic">
               <Link className="w-6 h-6 mr-3 neon-text-blue" />
               OrbitX System Connectivity
            </h3>
            <span className="text-xs font-mono text-green-400 animate-pulse">ALL SYSTEMS LINKED: 100%</span>
         </div>
         
         <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
            {[
               { name: 'Micro-Sats', status: 'Linked', icon: <Satellite /> },
               { name: 'Rovers', status: 'Active', icon: <Activity /> },
               { name: 'AI Brain', status: 'Sync', icon: <Cpu /> },
               { name: 'Global SIM', status: 'Secure', icon: <Wifi /> },
               { name: 'Ground St.', status: 'Online', icon: <Globe /> }
            ].map((sys, i) => (
               <div key={i} className="flex flex-col items-center p-6 glass-panel border-white/5 hover:neon-border-blue transition-all group cursor-pointer">
                  <div className="w-12 h-12 rounded-full flex items-center justify-center bg-white/5 mb-4 group-hover:scale-110 transition-all neon-text-blue">
                     {sys.icon}
                  </div>
                  <p className="text-sm font-bold mb-1">{sys.name}</p>
                  <p className="text-[10px] text-gray-500 font-bold uppercase">{sys.status}</p>
               </div>
            ))}
         </div>
         
         <div className="mt-8 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
            <p className="text-xs text-gray-500 max-w-md">
               The OrbitX ecosystem ensures military-grade encryption across all nodes. Use the Connectivity Hub to manually bridge or isolate satellite clusters.
            </p>
            <div className="flex gap-4">
               <button className="px-6 py-2 glass-panel border-gray-700 text-xs font-bold hover:neon-border-blue">GLOBAL RESET</button>
               <button className="px-6 py-2 glass-panel neon-border-blue text-xs font-bold hover:bg-[var(--neon-blue)] hover:text-black">CONNECT NEW NODE</button>
            </div>
         </div>

         {/* Detailed Network Map */}
         <div className="mt-8">
            <NetworkMap />
         </div>
      </div>


      {/* Bottom Grid: Networking & SIM */}
      <div className="md:col-span-12 grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="glass-panel p-6 neon-border-blue flex items-center justify-between">
          <div>
            <h4 className="font-bold flex items-center mb-1">
               <Wifi className="w-4 h-4 mr-2 text-green-400" /> Global OrbitX SIM
            </h4>
            <p className="text-xs text-gray-400">Status: ENCRYPTED & ACTIVE</p>
          </div>
          <button 
            onClick={() => setShowSimManager(true)}
            className="bg-green-500/10 text-green-400 border border-green-500/50 px-4 py-1 rounded text-xs hover:bg-green-500 hover:text-white transition-all"
          >
            MANAGE
          </button>
        </div>

        <div className="glass-panel p-6 neon-border-blue flex items-center justify-between">
          <div>
            <h4 className="font-bold flex items-center mb-1">
               <Cpu className="w-4 h-4 mr-2 text-orange-400" /> Robot Link-Alpha
            </h4>
            <p className="text-xs text-gray-400">Last Telemetry: 0.2s ago</p>
          </div>
          <button className="bg-orange-500/10 text-orange-400 border border-orange-500/50 px-4 py-1 rounded text-xs hover:bg-orange-500 hover:text-white transition-all">
            CONTROL
          </button>
        </div>

        <div className="glass-panel p-6 neon-border-blue flex items-center justify-between">
          <div>
            <h4 className="font-bold flex items-center mb-1">
               <ShieldCheck className="w-4 h-4 mr-2 neon-text-blue" /> Blockchain Security
            </h4>
            <p className="text-xs text-gray-400">Nodes Verified: 4.2k</p>
          </div>
          <button className="bg-blue-500/10 text-blue-400 border border-blue-500/50 px-4 py-1 rounded text-xs hover:bg-blue-500 hover:text-white transition-all">
            LOGS
          </button>
        </div>
      </div>

      {showSimManager && <VyomvedaSim onClose={() => setShowSimManager(false)} />}
    </motion.div>
  );
};

export default Dashboard;
