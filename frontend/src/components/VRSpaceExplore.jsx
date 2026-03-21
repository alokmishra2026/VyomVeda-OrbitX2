import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Glasses, Power, Focus, Loader, ShieldCheck, Orbit, Activity } from 'lucide-react';

const VRSpaceExplore = ({ onExit }) => {
  const [stage, setStage] = useState('CALIBRATING'); // CALIBRATING, SYNCING, ACTIVE
  const containerRef = useRef(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // Calibration Sequence
    setTimeout(() => setStage('SYNCING'), 3000);
    setTimeout(() => setStage('ACTIVE'), 6000);

    const handleMouseMove = (e) => {
      if (containerRef.current) {
        const { clientWidth, clientHeight } = containerRef.current;
        const x = (e.clientX / clientWidth - 0.5) * 20; // limits rotation angle
        const y = (e.clientY / clientHeight - 0.5) * 20;
        setMousePos({ x, y });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  if (stage !== 'ACTIVE') {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-black flex flex-col items-center justify-center font-mono text-cyan-500 space-y-8"
      >
         <Glasses className="w-32 h-32 animate-pulse text-[var(--neon-blue)]" />
         <div className="text-center space-y-4">
           <h2 className="text-2xl font-bold uppercase tracking-widest text-white">
             {stage === 'CALIBRATING' ? 'Calibrating Optical Sensors' : 'Synchronizing Neural Link'}
           </h2>
           <p className="text-sm tracking-widest animate-pulse">
             {stage === 'CALIBRATING' ? 'Please keep your headset stationary.' : 'Establishing geospatial orbit lock...'}
           </p>
         </div>
         <Loader className="w-12 h-12 animate-[spin_1.5s_linear_infinite]" />
      </motion.div>
    );
  }

  return (
    <motion.div 
      ref={containerRef}
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 bg-black overflow-hidden flex items-center justify-center perspective-1000"
    >
       {/* Deep Space Background Simulation */}
       <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-900/20 via-black to-black z-0"></div>
       <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-[pulse_10s_linear_infinite]"></div>
       
       {/* Pseudo 3D HUD wrapping */}
       <motion.div 
         animate={{ 
           rotateX: -mousePos.y, 
           rotateY: mousePos.x,
           z: 50
         }}
         transition={{ type: 'spring', stiffness: 50, damping: 20 }}
         className="relative z-10 w-full h-full flex items-center justify-center transform-style-3d"
       >
          {/* Central Targeting Reticle */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
             <div className="w-64 h-64 border border-cyan-500 rounded-full flex items-center justify-center animate-[spin_20s_linear_infinite]">
                <div className="w-60 h-60 border-t-2 border-b-2 border-cyan-400 rounded-full animate-[spin_10s_linear_infinite_reverse]"></div>
             </div>
             <Focus className="absolute w-8 h-8 text-cyan-400" />
          </div>

          {/* Left HUD Panel */}
          <div className="absolute left-10 text-cyan-400 font-mono text-[10px] space-y-6 transform-origin-left" style={{ transform: 'rotateY(20deg) translateZ(100px)' }}>
             <div className="border-l-2 border-cyan-500 pl-4 py-2 bg-gradient-to-r from-cyan-900/30 to-transparent">
                 <h3 className="text-white font-bold text-xs uppercase mb-2 flex items-center gap-2"><Activity className="w-4 h-4"/> Vital Signs</h3>
                 <p>O2 SATURATION: 99.4%</p>
                 <p>HEART RATE: 72 BPM</p>
                 <p>SUIT PRESSURE: 4.3 PSI</p>
             </div>
             <div className="border-l-2 border-[var(--neon-blue)] pl-4 py-2 bg-gradient-to-r from-blue-900/30 to-transparent">
                 <h3 className="text-white font-bold text-xs uppercase mb-2 flex items-center gap-2"><Orbit className="w-4 h-4"/> Orbital Sync</h3>
                 <p>ALTITUDE: 408 KM</p>
                 <p>VELOCITY: 7.66 KM/S</p>
                 <p>PITCH/YAW: STABLE</p>
             </div>
          </div>

          {/* Right HUD Panel */}
          <div className="absolute right-10 text-cyan-400 font-mono text-[10px] space-y-6 text-right transform-origin-right" style={{ transform: 'rotateY(-20deg) translateZ(100px)' }}>
             <div className="border-r-2 border-cyan-500 pr-4 py-2 bg-gradient-to-l from-cyan-900/30 to-transparent">
                 <h3 className="text-white font-bold text-xs uppercase mb-2 flex items-center justify-end gap-2 text-right"><ShieldCheck className="w-4 h-4"/> Integrity</h3>
                 <p>HULL ARMOR: 100%</p>
                 <p>RADIATION SHIELD: ACTIVE</p>
                 <p>LIFE SUPPORT: OPTIMAL</p>
             </div>
             <button 
               onClick={onExit}
               className="border border-red-500 text-red-500 px-6 py-3 rounded uppercase font-bold text-xs hover:bg-red-500 hover:text-white transition-all shadow-[0_0_20px_rgba(255,0,0,0.4)]"
               style={{ pointerEvents: 'auto' }}
             >
                <Power className="w-4 h-4 inline mr-2" /> Disconnect VR
             </button>
          </div>

          {/* Bottom Data Scroll */}
          <div className="absolute bottom-10 inset-x-0 mx-auto w-1/2 border-b border-cyan-500/50 pb-2 text-center pointer-events-none" style={{ transform: 'rotateX(20deg) translateZ(50px)' }}>
             <p className="text-[10px] font-mono text-cyan-300 uppercase tracking-[0.3em] truncate">
               TRANSMISSION INCOMING // SECTOR 7 CLEAR // AWAITING COMMAND PROTOCOL
             </p>
          </div>
       </motion.div>
    </motion.div>
  );
};

export default VRSpaceExplore;
