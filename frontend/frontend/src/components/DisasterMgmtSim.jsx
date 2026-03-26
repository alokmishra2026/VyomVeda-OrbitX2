import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Map, Navigation, ShieldAlert, Radio, Activity, CheckCircle } from 'lucide-react';

const DisasterMgmtSim = ({ onExit }) => {
  const [threats, setThreats] = useState([
    { id: 1, type: 'WILDFIRE', location: 'Sector A-91 (North America)', severity: 'CRITICAL', status: 'UNCONTAINED', color: 'bg-red-500' },
    { id: 2, type: 'CATEGORY 5 CYCLONE', location: 'Sector P-14 (Pacific Ocean)', severity: 'HIGH', status: 'MONITORING', color: 'bg-orange-500' },
    { id: 3, type: 'SEISMIC ANOMALY', location: 'Sector T-05 (Asian Tectonic)', severity: 'ELEVATED', status: 'PREDICTIVE', color: 'bg-yellow-500' },
  ]);

  const [logs, setLogs] = useState([]);
  const [deploying, setDeploying] = useState(null);

  const addLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 5));
  };

  const handleAction = (action, threatId) => {
    setDeploying(threatId);
    addLog(`INITIATING SATELLITE ACTION: ${action} ON THREAT ID #${threatId}...`);
    
    setTimeout(() => {
      setDeploying(null);
      addLog(`SUCCESS: ${action} COMPLETED.`);
      
      if (action === "DEPLOY THERMAL SHIELD" || action === "BROADCAST SOS") {
        setThreats(prev => prev.map(t => 
          t.id === threatId ? { ...t, severity: 'CONTAINED', status: 'RESOLVED', color: 'bg-green-500' } : t
        ));
      }
    }, 2500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6 max-w-5xl mx-auto"
    >
      <div className="flex justify-between items-center bg-red-900/20 border border-red-500/50 p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
        
        <div>
          <h2 className="text-3xl font-bold text-red-400 italic flex items-center gap-3 tracking-widest">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
            GLOBAL DISASTER OVERSEER
          </h2>
          <p className="text-xs text-red-300/70 uppercase tracking-widest mt-2 border-l-2 border-red-500 pl-2">
            Automated Satellite Threat Mitigation Array
          </p>
        </div>
        
        <button 
          onClick={onExit}
          className="glass-panel px-6 py-2 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold tracking-widest uppercase"
        >
          Deactivate Overseer
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Radar Map Mockup */}
        <div className="lg:col-span-2 glass-panel p-6 border-red-500/20 min-h-[400px] relative overflow-hidden flex items-center justify-center">
          <div className="absolute inset-0 bg-black/40 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-black to-black"></div>
          
          {/* Radar sweeping effect */}
          <div className="absolute inset-0 z-10 opacity-30 pointer-events-none">
             <div className="w-[200%] h-[200%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/10 animate-[spin_4s_linear_infinite]" style={{ background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(239, 68, 68, 0.4) 360deg)' }}></div>
          </div>
          
          <Map className="absolute w-full h-full text-red-500/5 opacity-20 p-8" />
          
          <div className="relative z-20 w-full h-full">
            {threats.map((threat, idx) => (
              <motion.div 
                key={threat.id}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                // arbitrary positioning for visual effect
                className={`absolute p-2 rounded-full shadow-[0_0_20px_rgba(255,0,0,0.5)] flex items-center justify-center cursor-pointer transition-all hover:scale-110 ${threat.color}`}
                style={{ 
                  top: `${20 + (idx * 30)}%`, 
                  left: `${20 + (idx * 25)}%`,
                  boxShadow: `0 0 20px ${threat.color === 'bg-red-500' ? 'red' : threat.color === 'bg-orange-500' ? 'orange' : threat.color === 'bg-green-500' ? 'green' : 'yellow'}` 
                }}
              >
                {threat.status === 'RESOLVED' ? <CheckCircle className="w-5 h-5 text-black" /> : <AlertTriangle className="w-5 h-5 text-black animate-pulse" />}
                
                <div className="absolute top-10 left-1/2 -translate-x-1/2 bg-black/90 border border-white/20 p-2 text-xs w-48 rounded opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                   <p className="font-bold text-white uppercase">{threat.type}</p>
                   <p className="text-gray-400">{threat.location}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2">
             <Radio className="w-4 h-4 text-red-400 animate-pulse" />
             <span className="text-xs text-red-500 font-mono">SCANNING ORBITAL THERMAL FREQUENCIES...</span>
          </div>
        </div>

        {/* Threat Control Panel */}
        <div className="space-y-4">
          <div className="glass-panel p-4 border-white/10">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Activity className="w-4 h-4 text-red-500" /> ACTIVE ANOMALIES
            </h3>
            
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {threats.map(threat => (
                <div key={threat.id} className={`p-4 rounded-xl border bg-black/40 transition-all ${threat.status === 'RESOLVED' ? 'border-green-500/30' : 'border-red-500/30'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${threat.color} text-black`}>
                      {threat.severity}
                    </span>
                    <span className="text-[10px] text-gray-500 font-mono">ID: #{threat.id}</span>
                  </div>
                  <h4 className="font-bold text-sm text-white">{threat.type}</h4>
                  <p className="text-xs text-gray-400 mb-4">{threat.location}</p>
                  
                  {threat.status === 'RESOLVED' ? (
                    <div className="w-full py-2 bg-green-500/10 text-green-400 text-center text-xs font-bold rounded border border-green-500/20 uppercase tracking-widest">
                      THREAT NEUTRALIZED
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        disabled={deploying !== null}
                        onClick={() => handleAction(threat.type.includes('WILDFIRE') ? 'DEPLOY THERMAL SHIELD' : 'BROADCAST SOS', threat.id)}
                        className="py-2 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-black border border-blue-500/50 rounded text-[10px] font-bold transition-all uppercase disabled:opacity-50"
                      >
                        {deploying === threat.id ? 'UPLINKING...' : (threat.type.includes('WILDFIRE') ? 'AUTO-CONTAIN' : 'EMERGENCY SOS')}
                      </button>
                      <button 
                         disabled={deploying !== null}
                         onClick={() => handleAction('REROUTE SATELLITE COMMS', threat.id)}
                         className="py-2 bg-white/5 hover:bg-white text-gray-300 hover:text-black border border-white/20 rounded text-[10px] font-bold transition-all uppercase disabled:opacity-50"
                      >
                         REROUTE COMMS
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          <div className="glass-panel p-4 border-white/10 h-32 overflow-hidden flex flex-col">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">SATELLITE COMMAND LOG</h3>
            <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[10px] custom-scrollbar">
               {logs.length === 0 ? (
                 <p className="text-gray-600">No recent actions.</p>
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

export default DisasterMgmtSim;
