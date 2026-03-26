import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, Map, Navigation, ShieldAlert, Radio, Activity, CheckCircle, RefreshCw, Cpu } from 'lucide-react';

// Map real lat/lng to a percentage-based position on the radar canvas
const latLngToPercent = (lat, lng) => {
  const x = ((lng + 180) / 360) * 100;
  const y = ((90 - lat) / 180) * 100;
  return { x, y };
};

const getMagnitudeProps = (mag) => {
  if (mag >= 6.0) return { color: 'bg-red-500', glow: 'red', severity: 'CRITICAL', label: 'bg-red-500' };
  if (mag >= 5.0) return { color: 'bg-orange-500', glow: 'orange', severity: 'HIGH', label: 'bg-orange-500' };
  return { color: 'bg-yellow-400', glow: 'yellow', severity: 'ELEVATED', label: 'bg-yellow-400' };
};

const AI_MESSAGES = [
  "Seismic activity elevated across Pacific ring of fire. Monitoring propagation vectors.",
  "USGS feed synchronized. 30-second refresh cycle active. All nodes nominal.",
  "Thermal anomaly detected. Cross-referencing satellite telemetry with FIRMS database.",
  "Critical magnitude event flagged. Recommend coastal evacuation advisory within 80km radius.",
  "Storm cluster forming over Bay of Bengal. Wind shear analysis in progress.",
  "AI prediction model active. Next-2h risk zones computed and overlaid on radar.",
];

const DisasterMgmtSim = ({ onExit }) => {
  const [liveThreats, setLiveThreats] = useState([]);
  const [staticThreats] = useState([
    { id: 's1', type: 'WILDFIRE', location: 'Sector A-91 (North America)', severity: 'CRITICAL', status: 'UNCONTAINED', color: 'bg-red-500', glow: 'red', x: 18, y: 32 },
    { id: 's2', type: 'CATEGORY 5 CYCLONE', location: 'Sector P-14 (Pacific Ocean)', severity: 'HIGH', status: 'MONITORING', color: 'bg-orange-500', glow: 'orange', x: 35, y: 48 },
    { id: 's3', type: 'SEISMIC ANOMALY', location: 'Sector T-05 (Asian Tectonic)', severity: 'ELEVATED', status: 'PREDICTIVE', color: 'bg-yellow-400', glow: 'yellow', x: 70, y: 40 },
  ]);
  const [resolvedIds, setResolvedIds] = useState(new Set());
  const [selected, setSelected] = useState(null);
  const [logs, setLogs] = useState([]);
  const [deploying, setDeploying] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [aiMessage, setAiMessage] = useState(AI_MESSAGES[0]);
  const aiMsgIdx = useRef(0);

  const addLog = (msg) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 8));
  };

  const fetchEarthquakes = async () => {
    try {
      const res = await fetch('https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_day.geojson');
      const data = await res.json();
      const mapped = data.features
        .slice(0, 30) // limit to 30 most recent
        .map((f, i) => {
          const [lng, lat, depth] = f.geometry.coordinates;
          const mag = f.properties.mag;
          const props = getMagnitudeProps(mag);
          const pos = latLngToPercent(lat, lng);
          return {
            id: f.id,
            type: `M${mag.toFixed(1)} EARTHQUAKE`,
            location: f.properties.place || 'Unknown Location',
            severity: props.severity,
            status: 'MONITORING',
            color: props.color,
            glow: props.glow,
            x: pos.x,
            y: pos.y,
            mag,
            depth,
            time: new Date(f.properties.time).toLocaleTimeString(),
            isLive: true,
          };
        });
      setLiveThreats(mapped);
      setLastUpdated(new Date().toLocaleTimeString());
      addLog(`USGS FEED SYNCED: ${mapped.length} seismic events loaded.`);
    } catch (e) {
      addLog(`USGS API ERROR: ${e.message}. Using cached data.`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarthquakes();
    const interval = setInterval(fetchEarthquakes, 30000);
    const aiInterval = setInterval(() => {
      aiMsgIdx.current = (aiMsgIdx.current + 1) % AI_MESSAGES.length;
      setAiMessage(AI_MESSAGES[aiMsgIdx.current]);
    }, 6000);
    return () => { clearInterval(interval); clearInterval(aiInterval); };
  }, []);

  const allThreats = [...staticThreats.filter(t => !resolvedIds.has(t.id)), ...liveThreats];

  const stats = {
    total: allThreats.length,
    critical: allThreats.filter(t => t.severity === 'CRITICAL').length,
    high: allThreats.filter(t => t.severity === 'HIGH').length,
    elevated: allThreats.filter(t => t.severity === 'ELEVATED').length,
  };

  const handleAction = (action, threat) => {
    setDeploying(threat.id);
    addLog(`INITIATING: ${action} → ${threat.type} [${threat.location}]`);
    setTimeout(() => {
      setDeploying(null);
      addLog(`SUCCESS: ${action} COMPLETED.`);
      setResolvedIds(prev => new Set([...prev, threat.id]));
      if (selected?.id === threat.id) setSelected({ ...threat, status: 'RESOLVED', color: 'bg-green-500' });
    }, 2500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-4 max-w-7xl mx-auto font-mono"
    >
      {/* Header */}
      <div className="flex justify-between items-center bg-red-900/20 border border-red-500/50 p-6 rounded-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent animate-pulse" />
        <div>
          <h2 className="text-3xl font-bold text-red-400 italic flex items-center gap-3 tracking-widest">
            <ShieldAlert className="w-8 h-8 animate-pulse" />
            GLOBAL DISASTER OVERSEER
          </h2>
          <p className="text-xs text-red-300/70 uppercase tracking-widest mt-2 border-l-2 border-red-500 pl-2">
            Live USGS + AI-Powered Threat Mitigation Array
          </p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <div className="flex items-center gap-2 text-[10px] text-gray-500 border border-gray-800 px-3 py-2 rounded">
              <RefreshCw className="w-3 h-3 animate-spin" />
              Synced: {lastUpdated}
            </div>
          )}
          <button
            onClick={onExit}
            className="glass-panel px-6 py-2 border-red-500/50 text-red-400 hover:bg-red-500 hover:text-white transition-all text-xs font-bold tracking-widest uppercase"
          >
            Deactivate Overseer
          </button>
        </div>
      </div>

      {/* Analytics Strip */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: 'Total Active', val: stats.total, color: 'text-white' },
          { label: 'Critical', val: stats.critical, color: 'text-red-500' },
          { label: 'High', val: stats.high, color: 'text-orange-400' },
          { label: 'Elevated', val: stats.elevated, color: 'text-yellow-400' },
        ].map(s => (
          <div key={s.label} className="glass-panel p-4 border border-gray-800 text-center">
            <p className={`text-3xl font-black ${s.color}`}>{s.val}</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Radar Map */}
        <div className="lg:col-span-2 glass-panel border-red-500/20 overflow-hidden relative" style={{ minHeight: '480px' }}>

          {/* Dark radar background */}
          <div className="absolute inset-0 bg-black/40 z-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-red-900/10 via-black to-black"></div>

          {/* Grid lines for map feel */}
          <div className="absolute inset-0 z-0 opacity-10" style={{
            backgroundImage: 'linear-gradient(rgba(239,68,68,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(239,68,68,0.3) 1px, transparent 1px)',
            backgroundSize: '10% 10%',
          }}></div>

          {/* Radar sweep */}
          <div className="absolute inset-0 z-10 opacity-30 pointer-events-none">
            <div className="w-[200%] h-[200%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full border border-red-500/10 animate-[spin_4s_linear_infinite]"
              style={{ background: 'conic-gradient(from 0deg, transparent 0deg, transparent 270deg, rgba(239, 68, 68, 0.4) 360deg)' }}>
            </div>
          </div>

          {/* World map outline overlay */}
          <Map className="absolute w-full h-full text-red-500/5 opacity-10 p-8 z-1" />

          {/* Continent labels */}
          {[
            { label: 'N.AMERICA', x: '20%', y: '28%' },
            { label: 'S.AMERICA', x: '25%', y: '64%' },
            { label: 'EUROPE', x: '48%', y: '22%' },
            { label: 'AFRICA', x: '50%', y: '55%' },
            { label: 'ASIA', x: '68%', y: '28%' },
            { label: 'OCEANIA', x: '75%', y: '70%' },
          ].map(c => (
            <span key={c.label} className="absolute text-[9px] text-gray-600 font-bold uppercase pointer-events-none z-10" style={{ left: c.x, top: c.y }}>
              {c.label}
            </span>
          ))}

          {/* Live Threat Dots */}
          <div className="absolute inset-0 z-20">
            {loading ? (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-red-400 text-xs animate-pulse">SYNCHRONIZING USGS SATELLITE FEED...</div>
              </div>
            ) : (
              allThreats.map((threat) => {
                if (resolvedIds.has(threat.id)) return null;
                const isSelected = selected?.id === threat.id;
                return (
                  <motion.div
                    key={threat.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute cursor-pointer"
                    style={{ left: `${threat.x}%`, top: `${threat.y}%`, transform: 'translate(-50%, -50%)' }}
                    onClick={() => setSelected(isSelected ? null : threat)}
                  >
                    {/* Pulse ring for critical */}
                    {threat.severity === 'CRITICAL' && (
                      <span className={`absolute inset-0 rounded-full ${threat.color} animate-ping opacity-50`}></span>
                    )}
                    <div className={`relative w-5 h-5 rounded-full ${threat.color} flex items-center justify-center shadow-lg transition-transform hover:scale-150 ${isSelected ? 'scale-150 ring-2 ring-white' : ''}`}
                      style={{ boxShadow: `0 0 12px ${threat.glow}` }}>
                      <AlertTriangle className="w-2.5 h-2.5 text-black" />
                    </div>

                    {/* Hover Tooltip */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="absolute z-30 bg-black/95 border border-red-500/50 p-3 rounded-lg text-[10px] w-52 -top-28 left-6 shadow-[0_0_20px_rgba(255,0,0,0.3)]"
                        onClick={e => e.stopPropagation()}
                      >
                        <p className="font-bold text-white text-xs mb-1">{threat.type}</p>
                        <p className="text-gray-400">{threat.location}</p>
                        {threat.mag && <p className="text-red-400 mt-1">Magnitude: {threat.mag.toFixed(1)}</p>}
                        {threat.depth && <p className="text-gray-500">Depth: {threat.depth.toFixed(1)} km</p>}
                        {threat.time && <p className="text-gray-500">Detected: {threat.time}</p>}
                        <span className={`inline-block mt-2 px-2 py-0.5 rounded text-black text-[9px] font-bold ${threat.color}`}>{threat.severity}</span>
                      </motion.div>
                    )}
                  </motion.div>
                );
              })
            )}
          </div>

          {/* Bottom status bar */}
          <div className="absolute bottom-0 inset-x-0 border-t border-red-900/40 bg-black/60 px-4 py-2 z-20 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <Radio className="w-3 h-3 text-red-400 animate-pulse" />
              <span className="text-[10px] text-red-500 font-mono">SCANNING ORBITAL THERMAL FREQUENCIES...</span>
            </div>
            <span className="text-[10px] text-gray-600">Live: USGS M2.5+ Day Feed</span>
          </div>
        </div>

        {/* Right Control Panel */}
        <div className="space-y-4 flex flex-col">

          {/* Threat Cards */}
          <div className="glass-panel p-4 border-white/10 flex-1 flex flex-col min-h-0">
            <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2 border-b border-gray-800 pb-2">
              <Activity className="w-4 h-4 text-red-500 animate-pulse" /> ACTIVE ANOMALIES
              <span className="ml-auto text-[10px] text-gray-500 font-normal">{allThreats.length} events</span>
            </h3>

            <div className="space-y-3 overflow-y-auto pr-1 custom-scrollbar flex-1">
              {/* Static scenario threats */}
              {staticThreats.filter(t => !resolvedIds.has(t.id)).map(threat => (
                <div key={threat.id} className="p-3 rounded-xl border bg-black/40 border-red-500/30">
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${threat.color} text-black`}>{threat.severity}</span>
                    <span className="text-[9px] text-gray-600">SIM</span>
                  </div>
                  <h4 className="font-bold text-xs text-white">{threat.type}</h4>
                  <p className="text-[10px] text-gray-400 mb-3">{threat.location}</p>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      disabled={deploying !== null}
                      onClick={() => handleAction(threat.type.includes('WILDFIRE') ? 'DEPLOY THERMAL SHIELD' : 'BROADCAST SOS', threat)}
                      className="py-1.5 bg-blue-500/20 hover:bg-blue-500 text-blue-400 hover:text-black border border-blue-500/50 rounded text-[9px] font-bold transition-all uppercase disabled:opacity-50"
                    >
                      {deploying === threat.id ? 'UPLINKING...' : (threat.type.includes('WILDFIRE') ? 'AUTO-CONTAIN' : 'EMERGENCY SOS')}
                    </button>
                    <button
                      disabled={deploying !== null}
                      onClick={() => handleAction('REROUTE SATELLITE COMMS', threat)}
                      className="py-1.5 bg-white/5 hover:bg-white text-gray-300 hover:text-black border border-white/20 rounded text-[9px] font-bold transition-all uppercase disabled:opacity-50"
                    >
                      REROUTE COMMS
                    </button>
                  </div>
                </div>
              ))}

              {/* Top 5 live USGS events */}
              {liveThreats.slice(0, 5).map(threat => (
                <div key={threat.id}
                  onClick={() => setSelected(selected?.id === threat.id ? null : threat)}
                  className={`p-3 rounded-xl border bg-black/40 cursor-pointer transition-all hover:border-red-500/60 ${selected?.id === threat.id ? 'border-red-500/70 bg-red-950/20' : 'border-gray-800'}`}>
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${threat.color} text-black`}>{threat.severity}</span>
                    <span className="text-[9px] text-cyan-500">LIVE</span>
                  </div>
                  <h4 className="font-bold text-xs text-white">{threat.type}</h4>
                  <p className="text-[10px] text-gray-400 mb-1">{threat.location}</p>
                  {threat.depth && <p className="text-[9px] text-gray-600">Depth: {threat.depth.toFixed(0)}km • {threat.time}</p>}
                </div>
              ))}
            </div>
          </div>

          {/* AI Assistant */}
          <div className="glass-panel p-4 border border-cyan-500/20 bg-cyan-900/5">
            <h3 className="text-[10px] font-bold text-cyan-500 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Cpu className="w-3 h-3 animate-pulse" /> AI SITUATIONAL ANALYSIS
            </h3>
            <AnimatePresence mode="wait">
              <motion.p
                key={aiMessage}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.4 }}
                className="text-[11px] text-gray-300 leading-relaxed"
              >
                {aiMessage}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Command Log */}
          <div className="glass-panel p-4 border-white/10 h-36 overflow-hidden flex flex-col">
            <h3 className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">SATELLITE COMMAND LOG</h3>
            <div className="flex-1 overflow-y-auto space-y-1 font-mono text-[10px] custom-scrollbar">
              {logs.length === 0 ? (
                <p className="text-gray-600">No recent actions.</p>
              ) : (
                logs.map((log, i) => (
                  <p key={i} className={i === 0 ? 'text-cyan-400' : 'text-blue-400/60'}>{log}</p>
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
