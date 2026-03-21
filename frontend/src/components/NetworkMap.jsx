import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Wifi, Zap, Activity } from 'lucide-react';

const NetworkMap = () => {
  const [nodes, setNodes] = useState([]);
  const [connections, setConnections] = useState([]);
  const [selectedNode, setSelectedNode] = useState(null);
  const [networkStats, setNetworkStats] = useState({
    bandwidth: 12.4,
    nodes: 4122,
    security: 'AES-4096Q'
  });

  useEffect(() => {
    // Generate constant random nodes for the "Global Map"
    const initialNodes = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      x: Math.random() * 80 + 10,
      y: Math.random() * 80 + 10,
      active: Math.random() > 0.2,
      type: ['Satellite', 'Ground Station', 'Relay'][Math.floor(Math.random() * 3)],
      load: Math.floor(Math.random() * 100),
      ping: Math.floor(Math.random() * 50) + 5
    }));
    setNodes(initialNodes);

    // Generate random connections
    const initialConnections = [];
    for (let i = 0; i < 20; i++) {
      const start = Math.floor(Math.random() * initialNodes.length);
      const end = Math.floor(Math.random() * initialNodes.length);
      if (start !== end) {
        initialConnections.push({ start, end });
      }
    }
    setConnections(initialConnections);
  }, []);

  return (
    <div className="glass-panel p-6 border-cyan-500/30 overflow-hidden relative min-h-[400px]">
      <div className="flex justify-between items-center mb-6">
         <h3 className="text-xl font-bold flex items-center italic">
            <Globe className="w-5 h-5 mr-3 neon-text-blue" />
            Global SIM Network Topology
         </h3>
         <div className="flex gap-4">
            <div className="flex items-center gap-2">
               <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
               <span className="text-[10px] text-gray-400 uppercase font-bold">Live</span>
            </div>
            <div className="flex items-center gap-2">
               <span className="text-[10px] text-cyan-400 font-mono">LATENCY: 12ms</span>
            </div>
         </div>
      </div>

      <div className="relative w-full h-[300px] border border-white/5 bg-black/40 rounded-xl overflow-hidden">
        {/* Connection Lines */}
        <svg className="absolute inset-0 w-full h-full pointer-events-none">
          {connections.map((conn, i) => {
            const startNode = nodes[conn.start];
            const endNode = nodes[conn.end];
            if (!startNode || !endNode) return null;
            return (
              <motion.line
                key={i}
                x1={`${startNode.x}%`}
                y1={`${startNode.y}%`}
                x2={`${endNode.x}%`}
                y2={`${endNode.y}%`}
                stroke="rgba(0, 243, 255, 0.15)"
                strokeWidth="1"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 2, delay: i * 0.1 }}
              />
            );
          })}
        </svg>

        {/* Nodes */}
        {nodes.map((node) => (
          <motion.div
            key={node.id}
            initial={{ scale: 0 }}
            animate={{ 
              scale: selectedNode?.id === node.id ? 1.5 : 1,
              boxShadow: selectedNode?.id === node.id ? '0 0 15px var(--neon-blue)' : 'none'
            }}
            onClick={() => setSelectedNode(node)}
            className={`absolute w-3 h-3 rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer group z-20`}
            style={{ left: `${node.x}%`, top: `${node.y}%`, backgroundColor: node.active ? 'var(--neon-blue)' : '#444' }}
          >
            <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${node.active ? 'bg-[var(--neon-blue)]' : 'hidden'}`} />
            
            {/* Tooltip on Hover */}
            <div className={`absolute bottom-full left-1/2 -translate-x-1/2 mb-2 ${selectedNode?.id === node.id ? 'block' : 'hidden group-hover:block'} z-50`}>
               <div className="glass-panel p-3 border-cyan-500/50 text-[10px] whitespace-nowrap font-mono">
                  <span className="text-cyan-400 font-bold">NODE_{node.id}</span> [{node.type}]<br/>
                  STATUS: {node.active ? 'ONLINE' : 'OFFLINE'} <br/>
                  TRAFFIC: {node.load} Gb/s <br/>
                  LATENCY: {node.ping}ms
               </div>
            </div>
          </motion.div>
        ))}

        {/* Pulsing Data Packets (Floating Orbs) */}
        <motion.div 
          animate={{ x: [0, 100, 200, 300, 400], y: [0, 50, 0, 80, 20] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute w-1 h-1 bg-white rounded-full shadow-[0_0_10px_white] opacity-50"
        />
      </div>

      <div className="mt-6 grid grid-cols-3 gap-4">
         <div className="p-3 bg-white/5 rounded-lg border border-white/5">
            <p className="text-[8px] text-gray-500 uppercase font-bold mb-1">Total Bandwidth</p>
            <p className="text-sm font-bold font-mono text-cyan-400">12.4 ZB/s</p>
         </div>
         <div className="p-3 bg-white/5 rounded-lg border border-white/5">
            <p className="text-[8px] text-gray-500 uppercase font-bold mb-1">Active Ground Nodes</p>
            <p className="text-sm font-bold font-mono text-green-400">4,122</p>
         </div>
         <div className="p-3 bg-white/5 rounded-lg border border-white/5">
            <p className="text-[8px] text-gray-500 uppercase font-bold mb-1">Encryption Strength</p>
            <p className="text-sm font-bold font-mono text-purple-400">AES-4096Q</p>
         </div>
      </div>
    </div>
  );
};

export default NetworkMap;
