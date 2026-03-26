import React from 'react';
import { 
  Glasses, 
  ShieldAlert, 
  CloudLightning, 
  BrainCircuit, 
  Gem, 
  Navigation,
  ExternalLink,
  Zap,
  ArrowLeft,
  Play
} from 'lucide-react';
import { motion } from 'framer-motion';
import MindLinkSim from './MindLinkSim';
import DisasterMgmtSim from './DisasterMgmtSim';
import SatBuilder from './SatBuilder';
import SpaceAcademyLive from './SpaceAcademyLive';
import EmergencySOS from './EmergencySOS';
import VRSpaceExplore from './VRSpaceExplore';

const FutureHub = () => {
  const [activeSim, setActiveSim] = React.useState(null);

  if (activeSim === 'mindlink') {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setActiveSim(null)}
          className="flex items-center gap-2 text-gray-400 hover:neon-text-blue transition-all uppercase text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </button>
        <MindLinkSim />
      </div>
    );
  }

  if (activeSim === 'disaster') {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setActiveSim(null)}
          className="flex items-center gap-2 text-gray-400 hover:neon-text-blue transition-all uppercase text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </button>
        <DisasterMgmtSim onExit={() => setActiveSim(null)} />
      </div>
    );
  }

  if (activeSim === 'satbuilder') {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setActiveSim(null)}
          className="flex items-center gap-2 text-gray-400 hover:neon-text-blue transition-all uppercase text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </button>
        <SatBuilder onExit={() => setActiveSim(null)} />
      </div>
    );
  }

  if (activeSim === 'academy') {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setActiveSim(null)}
          className="flex items-center gap-2 text-gray-400 hover:neon-text-blue transition-all uppercase text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </button>
        <SpaceAcademyLive onExit={() => setActiveSim(null)} />
      </div>
    );
  }

  if (activeSim === 'sos') {
    return (
      <div className="space-y-6">
        <button 
          onClick={() => setActiveSim(null)}
          className="flex items-center gap-2 text-gray-400 hover:neon-text-blue transition-all uppercase text-xs font-bold"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </button>
        <EmergencySOS onExit={() => setActiveSim(null)} />
      </div>
    );
  }

  if (activeSim === 'vr') {
    return <VRSpaceExplore onExit={() => setActiveSim(null)} />;
  }

  const futureTech = [
    { 
      id: 'satbuilder',
      title: "Personal Satellite Ownership", 
      icon: <Gem className="text-blue-400" />, 
      desc: "Own and control your private micro-satellite in Low Earth Orbit.",
      status: "Configure Orbit",
      color: "border-blue-500/30",
      isInteractive: true
    },
    { 
      id: 'vr',
      title: "VR/AR Space Exploration", 
      icon: <Glasses className="text-purple-400" />, 
      desc: "Immersive 1:1 scale Earth and Deep Space visualization (WebXR).",
      status: "Connect Headset",
      color: "border-purple-500/30",
      isInteractive: true
    },
    { 
      id: 'sos',
      title: "Global Emergency SOS", 
      icon: <ShieldAlert className="text-red-400" />, 
      desc: "Satellite-based emergency beacon for remote areas zero-lag rescue.",
      status: "System Ready",
      color: "border-red-500/30",
      isInteractive: true
    },
    { 
      id: 'mindlink',
      title: "Mind-Link Robotics", 
      icon: <BrainCircuit className="text-green-400" />, 
      desc: "Direct brain-computer interface to control rovers using thoughts.",
      status: "R&D Phase",
      color: "border-green-500/30",
      isInteractive: true
    },
    { 
      id: 'disaster',
      title: "Disaster Management", 
      icon: <CloudLightning className="text-yellow-400" />, 
      desc: "Predictive AI for floods, quakes, and wildfires using infra-red sats.",
      status: "Initialize Overseer",
      color: "border-yellow-500/30",
      isInteractive: true
    },
    { 
      id: 'academy',
      title: "Space Education Live", 
      icon: <Navigation className="text-cyan-400" />, 
      desc: "Direct live stream classes from the ISS and OrbitX satellites.",
      status: "Join Classroom",
      color: "border-cyan-500/30",
      isInteractive: true
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="space-y-12"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold italic tracking-tighter">
          VYOMVEDA <span className="neon-text-blue">FUTURE HUB</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto uppercase tracking-widest text-xs font-bold">
          Pushing the boundaries of orbital technology and human connection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {futureTech.map((tech, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => tech.isInteractive && setActiveSim(tech.id)}
            className={`glass-panel p-8 border ${tech.color} flex flex-col justify-between h-[300px] relative overflow-hidden group ${tech.isInteractive ? 'cursor-pointer neon-border-green' : ''}`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-all">
               {React.cloneElement(tech.icon, { size: 120 })}
            </div>
            
            <div className="relative z-10">
              <div className="mb-6 bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center border border-white/10">
                {tech.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{tech.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{tech.desc}</p>
            </div>

            <div className="relative z-10 mt-6 flex justify-between items-center">
               <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{tech.status}</span>
               <button className="p-2 rounded-full glass-panel hover:bg-[var(--neon-blue)] hover:text-black transition-all">
                  {tech.isInteractive ? <Play className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
               </button>
            </div>
          </motion.div>
        ))}
      </div>


      {/* Featured Large Section: VR Demo Mock */}
      <section className="glass-panel p-8 md:p-16 neon-border-blue relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
               <h2 className="text-4xl font-bold flex items-center">
                  <Zap className="w-8 h-8 mr-4 neon-text-blue" />
                  Experience OrbitX VR
               </h2>
               <p className="text-lg text-gray-400">
                  Feel the weightlessness of orbit. Our upcoming VR platform allows you to walk through the VyomVeda Space Station and control satellites in a 1:1 immersive environment.
               </p>
               <button 
                  onClick={() => setActiveSim('vr')}
                  className="px-10 py-4 glass-panel neon-border-blue font-bold hover:bg-[var(--neon-blue)] hover:text-black transition-all uppercase tracking-widest"
               >
                  Connect VR Headset
               </button>
            </div>
            <div 
               onClick={() => setActiveSim('vr')}
               className="w-full md:w-96 aspect-video bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-800 group cursor-pointer overflow-hidden relative"
            >
               <Glasses className="w-24 h-24 text-gray-800 group-hover:text-[var(--neon-blue)] transition-all animate-pulse" />
               <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
               <p className="absolute bottom-4 text-xs font-bold uppercase tracking-widest text-gray-500">Live Simulation: READY</p>
            </div>
         </div>
      </section>
    </motion.div>
  );
};

export default FutureHub;
