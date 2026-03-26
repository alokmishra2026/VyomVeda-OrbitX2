import React, { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Globe, Wifi, Zap, Activity, Satellite, Bot, Radio, ShieldCheck, RefreshCw, PlusCircle, X, BrainCircuit } from 'lucide-react';
import apiClient from '../api/client';

const MODULE_ICONS = {
  'micro-sats': <Satellite className="w-6 h-6" />,
  'rovers': <Radio className="w-6 h-6" />,
  'ai-brain': <BrainCircuit className="w-6 h-6" />,
  'global-sim': <Globe className="w-6 h-6" />,
  'ground-stations': <ShieldCheck className="w-6 h-6" />,
};

const STATUS_CONFIG = {
  CONNECTED:  { color: 'text-green-400',  border: 'border-green-500/40',  bg: 'bg-green-500/10',  glow: 'shadow-[0_0_15px_rgba(34,197,94,0.3)]',  dot: 'bg-green-500' },
  ACTIVE:     { color: 'text-cyan-400',   border: 'border-cyan-500/40',   bg: 'bg-cyan-500/10',   glow: 'shadow-[0_0_15px_rgba(0,255,255,0.3)]',   dot: 'bg-cyan-400' },
  SYNCING:    { color: 'text-yellow-400', border: 'border-yellow-500/40', bg: 'bg-yellow-500/10', glow: 'shadow-[0_0_15px_rgba(234,179,8,0.3)]',   dot: 'bg-yellow-400' },
  OFFLINE:    { color: 'text-red-400',    border: 'border-red-500/40',    bg: 'bg-red-500/10',    glow: 'shadow-[0_0_15px_rgba(239,68,68,0.3)]',   dot: 'bg-red-500' },
  ERROR:      { color: 'text-red-500',    border: 'border-red-600/60',    bg: 'bg-red-900/20',    glow: 'shadow-[0_0_20px_rgba(239,68,68,0.5)]',   dot: 'bg-red-600' },
};

const Toast = ({ msg, type, onClose }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
    className={`fixed bottom-24 right-6 z-[200] px-5 py-3 rounded-xl border font-mono text-sm shadow-2xl flex items-center gap-3 ${type === 'error' ? 'bg-red-900/90 border-red-500 text-red-200' : 'bg-gray-900/95 border-cyan-500/50 text-cyan-300'}`}
  >
    {type === 'error' ? <Zap className="w-4 h-4 text-red-400" /> : <Activity className="w-4 h-4 text-cyan-400 animate-pulse" />}
    {msg}
    <button onClick={onClose} className="ml-2 text-gray-500 hover:text-white"><X className="w-3 h-3" /></button>
  </motion.div>
);

const ConnectModal = ({ onClose, onConnect, loading }) => {
  const [form, setForm] = useState({ name: '', type: 'Satellite', region: '' });
  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm flex items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}
        onClick={e => e.stopPropagation()}
        className="glass-panel border border-cyan-500/40 p-8 rounded-2xl w-full max-w-md font-mono shadow-[0_0_40px_rgba(0,255,255,0.2)]"
      >
        <h3 className="text-xl font-bold text-cyan-400 tracking-widest uppercase mb-6 flex items-center gap-3">
          <PlusCircle className="w-6 h-6" /> Connect New Node
        </h3>
        <div className="space-y-4">
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Node Name</label>
            <input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              className="w-full bg-black/60 border border-gray-700 rounded px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors" placeholder="e.g. OrbitX Gamma" />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Type</label>
            <select value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}
              className="w-full bg-black/60 border border-gray-700 rounded px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors">
              {['Satellite', 'Ground', 'Compute', 'Network', 'Relay'].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <label className="text-[10px] text-gray-500 uppercase tracking-widest block mb-1">Region</label>
            <input value={form.region} onChange={e => setForm(f => ({ ...f, region: e.target.value }))}
              className="w-full bg-black/60 border border-gray-700 rounded px-4 py-2 text-sm focus:outline-none focus:border-cyan-500 transition-colors" placeholder="e.g. South Asia" />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={() => onConnect(form)}
            disabled={loading || !form.name || !form.region}
            className="flex-1 py-2.5 bg-cyan-600 hover:bg-cyan-500 text-black font-bold rounded uppercase tracking-widest text-xs transition-all disabled:opacity-40">
            {loading ? <RefreshCw className="w-4 h-4 animate-spin mx-auto" /> : 'Connect'}
          </button>
          <button onClick={onClose} className="flex-1 py-2.5 border border-gray-700 text-gray-400 hover:text-white rounded uppercase tracking-widest text-xs transition-all">Cancel</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const NetworkMap = () => {
  const [modules, setModules] = useState([]);
  const [customNodes, setCustomNodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [toast, setToast] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [topologyNodes, setTopologyNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [lastUpdated, setLastUpdated] = useState(null);

  const showToast = (msg, type = 'info') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 4000);
  };

  const fetchStatus = useCallback(async () => {
    try {
      const res = await apiClient.get('/api/system-status');
      setModules(res.data.modules || []);
      setCustomNodes(res.data.customNodes || []);
      setLastUpdated(new Date().toLocaleTimeString());
      setLoading(false);
    } catch (e) {
      console.error('System status fetch failed:', e);
      if (loading) setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStatus();
    const interval = setInterval(fetchStatus, 5000);
    return () => clearInterval(interval);
  }, [fetchStatus]);

  // Generate topology nodes whenever modules change
  useEffect(() => {
    const allMods = [...modules, ...customNodes];
    if (!allMods.length) return;
    const placed = allMods.map((m, i) => ({
      ...m,
      x: 10 + (i % 5) * 18 + Math.random() * 6,
      y: 15 + Math.floor(i / 5) * 40 + Math.random() * 15,
    }));
    setTopologyNodes(placed);
    const conns = [];
    for (let i = 0; i < placed.length - 1; i++) conns.push({ start: i, end: i + 1 });
    for (let i = 0; i < 6; i++) {
      const s = Math.floor(Math.random() * placed.length);
      const e = Math.floor(Math.random() * placed.length);
      if (s !== e) conns.push({ start: s, end: e });
    }
    setConnections(conns);
  }, [modules, customNodes]);

  const handleReset = async () => {
    setActionLoading('reset');
    try {
      await apiClient.post('/api/reset-system');
      showToast('System reset initiated. All nodes syncing...');
      fetchStatus();
    } catch { showToast('Reset failed — network error', 'error'); }
    finally { setActionLoading(null); }
  };

  const handleSyncAI = async () => {
    setActionLoading('ai');
    try {
      await apiClient.post('/api/sync-ai');
      showToast('AI Brain sync initiated. Calibrating neural pathways...');
      fetchStatus();
    } catch { showToast('AI Sync failed', 'error'); }
    finally { setActionLoading(null); }
  };

  const handleConnect = async (form) => {
    setActionLoading('connect');
    try {
      const res = await apiClient.post('/api/connect-node', form);
      showToast(`Node "${form.name}" connected successfully!`);
      setShowModal(false);
      fetchStatus();
    } catch { showToast('Connection failed', 'error'); }
    finally { setActionLoading(null); }
  };

  const allOffline = modules.some(m => m.status === 'OFFLINE' || m.status === 'ERROR');

  if (loading) {
    return (
      <div className="glass-panel p-6 border-cyan-500/30 min-h-[500px] animate-pulse">
        <div className="h-6 w-48 bg-gray-800 rounded mb-8"></div>
        <div className="grid grid-cols-5 gap-4 mb-8">
          {[...Array(5)].map((_, i) => <div key={i} className="h-28 bg-gray-900 rounded-xl"></div>)}
        </div>
        <div className="h-64 bg-gray-900 rounded-xl"></div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
        {showModal && <ConnectModal onClose={() => setShowModal(false)} onConnect={handleConnect} loading={actionLoading === 'connect'} />}
      </AnimatePresence>

      <div className="glass-panel p-6 border-cyan-500/30 space-y-6 font-mono overflow-hidden relative">

        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-3 italic tracking-widest">
              <Globe className="w-5 h-5 text-cyan-400" /> OrbitX System Connectivity
            </h3>
            <p className="text-[10px] text-gray-500 mt-1 uppercase">
              {lastUpdated ? `Last synced: ${lastUpdated} • Auto-refresh 5s` : 'Initializing...'}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {allOffline && (
              <motion.div animate={{ opacity: [1, 0.3] }} transition={{ repeat: Infinity, duration: 1 }}
                className="text-[10px] text-red-400 border border-red-500/50 bg-red-900/20 px-3 py-1.5 rounded-full uppercase font-bold flex items-center gap-2">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-ping inline-block"></span>
                System Alert
              </motion.div>
            )}
            <button onClick={() => setShowModal(true)} 
              className="flex items-center gap-2 px-4 py-2 border border-cyan-500/50 text-cyan-400 hover:bg-cyan-900/40 rounded-lg text-xs transition-all uppercase font-bold tracking-widest">
              <PlusCircle className="w-4 h-4" /> Connect Node
            </button>
            <button onClick={handleSyncAI} disabled={actionLoading === 'ai'}
              className="flex items-center gap-2 px-4 py-2 border border-purple-500/50 text-purple-400 hover:bg-purple-900/30 rounded-lg text-xs transition-all uppercase font-bold tracking-widest disabled:opacity-50">
              {actionLoading === 'ai' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />} AI Sync
            </button>
            <button onClick={handleReset} disabled={actionLoading === 'reset'}
              className="flex items-center gap-2 px-4 py-2 border border-red-500/50 text-red-400 hover:bg-red-900/30 rounded-lg text-xs transition-all uppercase font-bold tracking-widest disabled:opacity-50">
              {actionLoading === 'reset' ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Zap className="w-4 h-4" />} Global Reset
            </button>
          </div>
        </div>

        {/* Module Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {[...modules, ...customNodes].map((mod) => {
            const cfg = STATUS_CONFIG[mod.status] || STATUS_CONFIG.CONNECTED;
            const isSelected = selectedModule?.id === mod.id;
            return (
              <motion.div
                key={mod.id}
                whileHover={{ y: -4, scale: 1.02 }}
                onClick={() => setSelectedModule(isSelected ? null : mod)}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${cfg.border} ${cfg.bg} ${cfg.glow} ${isSelected ? 'ring-2 ring-cyan-400' : ''}`}
              >
                <div className={`${cfg.color} mb-3`}>{MODULE_ICONS[mod.id] || <Wifi className="w-6 h-6" />}</div>
                <h4 className="font-bold text-sm text-white truncate">{mod.name}</h4>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`w-2 h-2 rounded-full ${cfg.dot} ${mod.status === 'SYNCING' ? 'animate-ping' : 'animate-pulse'}`}></span>
                  <span className={`text-[10px] font-bold uppercase ${cfg.color}`}>{mod.status}</span>
                </div>
                <div className="mt-3">
                  <div className="w-full bg-gray-900 rounded-full h-1 overflow-hidden">
                    <motion.div animate={{ width: `${mod.signal}%` }} transition={{ duration: 1 }}
                      className={`h-full rounded-full ${mod.signal > 85 ? 'bg-green-500' : mod.signal > 65 ? 'bg-yellow-400' : 'bg-red-500'}`} />
                  </div>
                  <p className="text-[9px] text-gray-500 mt-1">{mod.signal?.toFixed(0)}% signal · {mod.region}</p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Module Detail Panel */}
        <AnimatePresence>
          {selectedModule && (
            <motion.div
              initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="border border-cyan-500/30 bg-cyan-950/10 rounded-xl p-5 grid grid-cols-2 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Module</p>
                  <p className="font-bold text-white">{selectedModule.name}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Type</p>
                  <p className="text-cyan-400 font-bold">{selectedModule.type}</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Signal</p>
                  <p className="text-green-400 font-bold">{selectedModule.signal?.toFixed(1)}%</p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase tracking-widest">Last Active</p>
                  <p className="text-gray-300 text-sm">{new Date(selectedModule.lastActive).toLocaleTimeString()}</p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Network Topology */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-bold uppercase tracking-widest text-gray-400 flex items-center gap-2">
              <Wifi className="w-4 h-4 text-cyan-400" /> Network Topology View
            </h4>
            <div className="flex items-center gap-3 text-[10px] text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-500 inline-block"></span> Connected</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-400 inline-block"></span> Syncing</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span> Error</span>
              <span className="flex items-center gap-1.5"><span className="w-6 h-px bg-cyan-400 inline-block opacity-50"></span> Link</span>
            </div>
          </div>

          <div className="relative w-full border border-white/5 bg-black/50 rounded-xl overflow-hidden" style={{ height: '260px' }}>
            {/* Grid lines */}
            <div className="absolute inset-0 opacity-5" style={{
              backgroundImage: 'linear-gradient(rgba(0,243,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(0,243,255,0.5) 1px, transparent 1px)',
              backgroundSize: '8% 20%'
            }}></div>

            {/* Radar sweep */}
            <div className="absolute inset-0 opacity-20 pointer-events-none z-0">
              <div className="w-[200%] h-[200%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-[spin_6s_linear_infinite]"
                style={{ background: 'conic-gradient(from 0deg, transparent 0deg, transparent 310deg, rgba(0,243,255,0.3) 360deg)' }}>
              </div>
            </div>

            {/* SVG connection lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
              {connections.map((conn, i) => {
                const s = topologyNodes[conn.start];
                const e = topologyNodes[conn.end];
                if (!s || !e) return null;
                return (
                  <motion.line key={i}
                    x1={`${s.x}%`} y1={`${s.y}%`} x2={`${e.x}%`} y2={`${e.y}%`}
                    stroke="rgba(0,243,255,0.2)" strokeWidth="1"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ duration: 1.5, delay: i * 0.08 }}
                  />
                );
              })}
            </svg>

            {/* Node dots */}
            {topologyNodes.map((node) => {
              const cfg = STATUS_CONFIG[node.status] || STATUS_CONFIG.CONNECTED;
              return (
                <motion.div key={node.id}
                  initial={{ scale: 0 }}
                  animate={{ scale: selectedModule?.id === node.id ? 1.8 : 1 }}
                  onClick={() => setSelectedModule(selectedModule?.id === node.id ? null : node)}
                  className="absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer z-20 group"
                  style={{ left: `${node.x}%`, top: `${node.y}%`, backgroundColor: cfg.dot.replace('bg-', '').replace('-500', '').replace('-400', '') }}
                >
                  <span className={`absolute inset-0 rounded-full ${cfg.dot} opacity-30 animate-ping`}></span>
                  <div className={`absolute inset-0 rounded-full ${cfg.dot}`}></div>
                  {/* Tooltip */}
                  <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 hidden group-hover:block z-50">
                    <div className="glass-panel p-2 border-cyan-500/30 text-[9px] whitespace-nowrap">
                      <span className="text-cyan-400 font-bold">{node.name}</span><br />
                      {node.status} · {node.signal?.toFixed(0)}%<br />
                      {node.region}
                    </div>
                  </div>
                </motion.div>
              );
            })}

            {/* Animated data packet orbs */}
            {[0, 1, 2].map(i => (
              <motion.div key={i}
                animate={{ x: [0, 80 + i * 40, 160 + i * 20, 240], y: [10 * i, 50, 20, 80] }}
                transition={{ duration: 6 + i * 2, repeat: Infinity, ease: 'linear', delay: i * 2 }}
                className="absolute w-1 h-1 bg-cyan-300 rounded-full shadow-[0_0_8px_cyan] opacity-70 pointer-events-none z-30"
              />
            ))}
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-3 gap-4">
          <div className="p-3 bg-white/5 rounded-lg border border-white/5">
            <p className="text-[8px] text-gray-500 uppercase font-bold mb-1">Total Bandwidth</p>
            <p className="text-sm font-bold font-mono text-cyan-400">12.4 ZB/s</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/5">
            <p className="text-[8px] text-gray-500 uppercase font-bold mb-1">Active Nodes ({[...modules, ...customNodes].length})</p>
            <p className="text-sm font-bold font-mono text-green-400">{[...modules, ...customNodes].filter(m => m.status !== 'OFFLINE').length} Online</p>
          </div>
          <div className="p-3 bg-white/5 rounded-lg border border-white/5">
            <p className="text-[8px] text-gray-500 uppercase font-bold mb-1">Encryption</p>
            <p className="text-sm font-bold font-mono text-purple-400">AES-4096Q</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default NetworkMap;
