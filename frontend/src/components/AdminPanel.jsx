import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, Users, Activity, Database, ServerCrash, Terminal, ArrowLeft, RefreshCw } from 'lucide-react';
import axios from 'axios';

const AdminPanel = ({ onExit }) => {
  const [stats, setStats] = useState({ users: 0, logs: [] });
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [passcode, setPasscode] = useState('');

  const handleAuth = (e) => {
    e.preventDefault();
    if (passcode === 'vyom-admin-2026') {
      setAuthorized(true);
      fetchStats();
    }
  };

  const fetchStats = async () => {
    setLoading(true);
    try {
      // In a real scenario, this would pass the admin JWT.
      // For this interactive demo, we'll mock the response based on the backend schema.
      setTimeout(() => {
        setStats({
          users: Math.floor(Math.random() * 500) + 1200,
          logs: [
            { _id: '1', action: 'User Registration', details: 'commander@vyomveda.com', timestamp: new Date(Date.now() - 5000) },
            { _id: '2', action: 'Satellite Uplink', details: 'S-102 Online', timestamp: new Date(Date.now() - 15000) },
            { _id: '3', action: 'VyomBot Request', details: 'Query: Robotics', timestamp: new Date(Date.now() - 45000) },
            { _id: '4', action: 'Emergency SOS', details: 'Triggered in Sector 7', timestamp: new Date(Date.now() - 120000) },
            { _id: '5', action: 'Websocket Connect', details: 'Client ID: 8xf...', timestamp: new Date(Date.now() - 180000) },
          ]
        });
        setLoading(false);
      }, 800);
    } catch (e) {
      setLoading(false);
    }
  };

  if (!authorized) {
    return (
      <motion.div 
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="absolute inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-xl"
      >
        <div className="bg-red-950/20 border border-red-500/50 p-8 rounded-2xl w-full max-w-sm relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-orange-500"></div>
          
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/50">
              <ShieldCheck className="w-8 h-8 text-red-500" />
            </div>
          </div>
          
          <h2 className="text-2xl font-bold font-orbitron text-white text-center mb-2 tracking-wider">RESTRICTED</h2>
          <p className="text-red-400 text-center text-xs mb-8">VYOMVEDA ADMIN OVERSIGHT</p>
          
          <form onSubmit={handleAuth}>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              placeholder="ENTER OVERRIDE CODE"
              className="w-full bg-black/50 border border-red-500/30 rounded p-3 text-center text-white font-orbitron focus:outline-none focus:border-red-500 tracking-[0.2em] mb-4"
              autoFocus
            />
            <button
              type="submit"
              className="w-full bg-red-600/20 hover:bg-red-600 text-red-100 border border-red-500/50 py-3 rounded font-bold tracking-wider transition-all"
            >
              ACCESS COMMAND CENTER
            </button>
          </form>

          <button onClick={onExit} className="w-full mt-4 text-gray-500 text-xs hover:text-white pb-1 border-b border-transparent hover:border-white w-max mx-auto block transition-all">
            ABORT
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
      className="absolute inset-0 z-50 bg-[#0a0f1d] overflow-y-auto"
    >
      <div className="max-w-7xl mx-auto p-6 min-h-screen">
        <div className="flex justify-between items-end mb-8 border-b border-red-500/30 pb-4">
          <div>
            <button onClick={onExit} className="flex items-center text-red-400 hover:text-white transition-colors mb-4 text-sm">
              <ArrowLeft className="w-4 h-4 mr-2" /> EXIT ADMIN OVERSIGHT
            </button>
            <h1 className="text-4xl font-black font-orbitron text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400 tracking-wider">
              GLOBAL COMMAND
            </h1>
            <p className="text-red-500/70 tracking-[0.2em] text-sm mt-1">VYOMVEDA SYS-ADMIN REALTIME LOGS</p>
          </div>
          
          <button 
            onClick={fetchStats}
            className="flex items-center bg-red-500/10 text-red-400 px-4 py-2 border border-red-500/50 hover:bg-red-500 hover:text-white transition-all rounded"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            SYNC DATA
          </button>
        </div>

        {loading ? (
          <div className="h-64 flex flex-col items-center justify-center">
            <div className="w-16 h-16 border-4 border-red-500/20 border-t-red-500 rounded-full animate-spin"></div>
            <p className="text-red-400 mt-4 animate-pulse uppercase tracking-[0.3em]">Querying Global Database...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="bg-black/40 border border-red-500/20 p-6 rounded-xl flex items-center backdrop-blur-md">
              <div className="p-4 bg-red-500/10 rounded-lg mr-4">
                <Users className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <p className="text-gray-400 text-xs tracking-wider mb-1">TOTAL USERS</p>
                <h3 className="text-3xl font-bold text-white font-orbitron">{stats.users.toLocaleString()}</h3>
              </div>
            </div>
            
            <div className="bg-black/40 border border-orange-500/20 p-6 rounded-xl flex items-center backdrop-blur-md">
              <div className="p-4 bg-orange-500/10 rounded-lg mr-4">
                <Activity className="w-8 h-8 text-orange-500" />
              </div>
              <div>
                <p className="text-gray-400 text-xs tracking-wider mb-1">NETWORK LOAD</p>
                <h3 className="text-3xl font-bold text-white font-orbitron">84%</h3>
              </div>
            </div>

            <div className="bg-black/40 border border-green-500/20 p-6 rounded-xl flex items-center backdrop-blur-md">
              <div className="p-4 bg-green-500/10 rounded-lg mr-4">
                <Database className="w-8 h-8 text-green-500" />
              </div>
              <div>
                <p className="text-gray-400 text-xs tracking-wider mb-1">DB INSTANCES</p>
                <h3 className="text-3xl font-bold text-white font-orbitron">4 SHARDS</h3>
              </div>
            </div>

            <div className="bg-black/40 border border-red-800/30 p-6 rounded-xl flex items-center backdrop-blur-md">
              <div className="p-4 bg-red-900/40 rounded-lg mr-4">
                <ServerCrash className="w-8 h-8 text-red-500" />
              </div>
              <div>
                <p className="text-gray-400 text-xs tracking-wider mb-1">ERROR RATE</p>
                <h3 className="text-3xl font-bold text-white font-orbitron">0.01%</h3>
              </div>
            </div>

            <div className="md:col-span-4 bg-[#050810] border border-gray-800 rounded-xl overflow-hidden mt-6">
              <div className="bg-gray-900/80 px-4 py-3 border-b border-gray-800 flex items-center">
                <Terminal className="w-4 h-4 text-red-400 mr-2" />
                <h3 className="text-gray-300 font-bold uppercase text-xs tracking-wider">LIVE SYSTEM LOGS (MONGODB)</h3>
              </div>
              <div className="p-4 font-mono text-sm">
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-gray-500 border-b border-gray-800">
                      <th className="pb-2 font-normal">TIMESTAMP</th>
                      <th className="pb-2 font-normal">EVENT</th>
                      <th className="pb-2 font-normal">DETAILS</th>
                      <th className="pb-2 font-normal text-right">STATUS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.logs.map((log) => (
                      <tr key={log._id} className="border-b border-gray-900/50 hover:bg-gray-800/20">
                        <td className="py-3 text-blue-400">{new Date(log.timestamp).toLocaleTimeString()}</td>
                        <td className="py-3 text-gray-300">{log.action}</td>
                        <td className="py-3 text-cyan-500">{log.details}</td>
                        <td className="py-3 text-right text-green-500 text-xs tracking-wider">200 OK</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default AdminPanel;
