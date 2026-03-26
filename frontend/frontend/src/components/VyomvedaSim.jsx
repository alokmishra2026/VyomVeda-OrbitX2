import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Wifi, Activity, ShieldCheck, X, Zap, Cpu, Globe } from 'lucide-react';

const VyomvedaSim = ({ onClose }) => {
  const [dataUsage, setDataUsage] = useState(14.2);

  useEffect(() => {
    // Simulate real-time satellite data usage increment
    const interval = setInterval(() => {
      setDataUsage(prev => prev + parseFloat((Math.random() * 0.05).toFixed(3)));
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
    >
      <div className="max-w-4xl w-full glass-panel p-8 relative overflow-hidden border-[var(--neon-blue)] shadow-[0_0_50px_rgba(0,243,255,0.2)]">
        
        {/* Background Gradients */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[var(--neon-blue)]/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex justify-between items-start mb-8 relative z-10">
          <div>
            <h2 className="text-3xl font-bold flex items-center tracking-widest uppercase">
              <Globe className="w-8 h-8 mr-3 text-[var(--neon-blue)] animate-pulse" />
              VyomVeda <span className="text-[var(--neon-blue)] ml-2">Global SIM</span>
            </h2>
            <p className="text-gray-400 text-sm mt-1 uppercase tracking-widest text-xs font-bold">Orbital Network Manager</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-red-500/20 text-red-500 rounded transition-all">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
          
          {/* Virtual SIM Card Visual */}
          <div className="flex flex-col items-center justify-center">
            <motion.div 
              animate={{ 
                rotateY: [0, 10, -10, 0],
                rotateX: [0, 5, -5, 0]
              }}
              transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
              className="w-64 h-96 rounded-3xl bg-gradient-to-b from-gray-900 to-black border-2 border-[var(--neon-blue)] shadow-[0_0_30px_rgba(0,243,255,0.3)] relative overflow-hidden flex flex-col justify-between p-6 perspective-1000"
            >
               {/* Chip Design */}
               <div className="w-16 h-20 border-2 border-yellow-600 rounded bg-yellow-500/20 absolute top-12 left-6 grid grid-cols-2 gap-1 p-1">
                  <div className="bg-yellow-600/40 rounded-sm"></div><div className="bg-yellow-600/40 rounded-sm"></div>
                  <div className="bg-yellow-600/40 rounded-sm"></div><div className="bg-yellow-600/40 rounded-sm"></div>
                  <div className="bg-yellow-600/40 rounded-sm"></div><div className="bg-yellow-600/40 rounded-sm"></div>
               </div>

               <div className="text-right">
                  <h3 className="font-bold text-xl italic tracking-widest text-white/90">OrbitX</h3>
                  <p className="text-[8px] text-[var(--neon-blue)] font-bold uppercase tracking-[0.3em]">Universal Access</p>
               </div>

               <div className="mt-auto">
                 <div className="flex items-center gap-2 mb-4">
                   <Wifi className="w-6 h-6 text-green-400 animate-pulse" />
                   <span className="text-xs font-bold text-green-400 tracking-widest uppercase">Leo-Sync Active</span>
                 </div>
                 <p className="font-mono text-sm tracking-widest text-gray-300">8901 4103 2111 5022 19</p>
                 <p className="text-[10px] text-gray-500 mt-1 uppercase">Valid Thru: LIFETIME</p>
               </div>
               
               <div className="absolute inset-0 bg-gradient-to-tr from-[var(--neon-blue)]/5 to-transparent pointer-events-none"></div>
            </motion.div>
          </div>

          {/* SIM Stats & Telemetry */}
          <div className="space-y-6">
             <div className="glass-panel p-6 border-white/10">
               <h3 className="text-sm font-bold uppercase tracking-widest text-gray-400 border-b border-white/10 pb-2 mb-4">Network Status</h3>
               <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-300 flex items-center gap-2"><Activity className="w-4 h-4 text-[var(--neon-blue)]" /> Downlink Speed</span>
                    <span className="text-sm font-mono text-white">1,240 Mbps</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-300 flex items-center gap-2"><Zap className="w-4 h-4 text-purple-400" /> Uplink Speed</span>
                    <span className="text-sm font-mono text-white">850 Mbps</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-gray-300 flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-green-400" /> Latency (LEO)</span>
                    <span className="text-sm font-mono text-white">12 ms</span>
                  </div>
               </div>
             </div>

             <div className="glass-panel p-6 border-[var(--neon-blue)]/30 bg-[var(--neon-blue)]/5">
                <h3 className="text-xl font-bold text-white mb-2 flex justify-between items-end">
                   <span>Orbital Data Usage</span>
                   <span className="text-2xl font-mono text-[var(--neon-blue)]">{dataUsage.toFixed(2)} TB</span>
                </h3>
                <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden mb-2">
                   <div className="h-full bg-[var(--neon-blue)] w-full rounded-full relative">
                      <div className="absolute inset-0 bg-white/20 animate-pulse"></div>
                   </div>
                </div>
                <div className="flex justify-between text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                   <span>Limit: Uncapped</span>
                   <span className="text-green-400">Military-Grade Encrypted</span>
                </div>
             </div>

             <div className="grid grid-cols-2 gap-4">
                <button className="py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-xs font-bold uppercase tracking-widest rounded transition-all">
                  Reroute Satellites
                </button>
                <button className="py-3 bg-[var(--neon-blue)]/20 hover:bg-[var(--neon-blue)] text-[var(--neon-blue)] hover:text-black border border-[var(--neon-blue)]/50 text-xs font-bold uppercase tracking-widest rounded transition-all">
                  Run Diagnostics
                </button>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default VyomvedaSim;
