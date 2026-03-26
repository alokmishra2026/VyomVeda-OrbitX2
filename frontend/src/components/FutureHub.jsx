import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BrainCircuit, Rocket, Cpu, Satellite, Glasses, 
  Wrench, Users, GraduationCap, Fingerprint, BarChart2, 
  AlertTriangle, Gamepad2, ChevronRight, Zap, Play, Code,
  ShieldAlert, CloudLightning, Gem, Navigation, ExternalLink, ArrowLeft, Globe
} from 'lucide-react';

import MindLinkSim from './MindLinkSim';
import DisasterMgmtSim from './DisasterMgmtSim';
import SatBuilder from './SatBuilder';
import SpaceAcademyLive from './SpaceAcademyLive';
import EmergencySOS from './EmergencySOS';
import VRSpaceExplore from './VRSpaceExplore';

const sectionData = [
  { id: 'overview', icon: <Globe/>, title: 'Ecosystem Overview', color: 'text-white' },
  { id: 'command-center', icon: <BrainCircuit/>, title: 'AI Command Center', color: 'text-cyan-400' },
  { id: 'space-edu', icon: <Rocket/>, title: 'Space Education Live', color: 'text-purple-400' },
  { id: 'ai-lab', icon: <Cpu/>, title: 'AI/ML Lab', color: 'text-emerald-400' },
  { id: 'sat-hub', icon: <Satellite/>, title: 'Satellite & Data Hub', color: 'text-blue-400' },
  { id: 'metaverse', icon: <Glasses/>, title: 'Metaverse & VR Zone', color: 'text-pink-400' },
  { id: 'innovation', icon: <Wrench/>, title: 'Innovation Builder', color: 'text-orange-400' },
  { id: 'global-net', icon: <Users/>, title: 'Global Connectivity', color: 'text-teal-400' },
  { id: 'career', icon: <GraduationCap/>, title: 'Career & Skills', color: 'text-yellow-400' },
  { id: 'security', icon: <Fingerprint/>, title: 'Connect ID Security', color: 'text-red-400' },
  { id: 'analytics', icon: <BarChart2/>, title: 'Future Analytics', color: 'text-indigo-400' },
  { id: 'alerts', icon: <AlertTriangle/>, title: 'Real-Time Alerts', color: 'text-rose-400' },
  { id: 'gamified', icon: <Gamepad2/>, title: 'Gamified Missions', color: 'text-fuchsia-400' },
];

const FutureHub = () => {
  const [activeSegment, setActiveSegment] = useState('overview');
  const [activeSim, setActiveSim] = useState(null);

  // If a full-screen sim is active, render it!
  if (activeSim === 'mindlink') {
    return (
      <div className="space-y-6 pt-10 px-6 max-w-7xl mx-auto">
        <button onClick={() => setActiveSim(null)} className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-all uppercase text-xs font-bold border border-gray-700 px-4 py-2 rounded">
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </button>
        <MindLinkSim />
      </div>
    );
  }

  if (activeSim === 'disaster') {
    return (
      <div className="space-y-6 pt-10 px-6 max-w-7xl mx-auto">
        <button onClick={() => setActiveSim(null)} className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-all uppercase text-xs font-bold border border-gray-700 px-4 py-2 rounded">
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </button>
        <DisasterMgmtSim onExit={() => setActiveSim(null)} />
      </div>
    );
  }

  if (activeSim === 'satbuilder') {
    return (
      <div className="space-y-6 pt-10 px-6 max-w-7xl mx-auto">
        <button onClick={() => setActiveSim(null)} className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-all uppercase text-xs font-bold border border-gray-700 px-4 py-2 rounded">
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </button>
        <SatBuilder onExit={() => setActiveSim(null)} />
      </div>
    );
  }

  if (activeSim === 'academy') {
    return (
      <div className="space-y-6 pt-10 px-6 max-w-7xl mx-auto">
        <button onClick={() => setActiveSim(null)} className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-all uppercase text-xs font-bold border border-gray-700 px-4 py-2 rounded">
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </button>
        <SpaceAcademyLive onExit={() => setActiveSim(null)} />
      </div>
    );
  }

  if (activeSim === 'sos') {
    return (
      <div className="space-y-6 pt-10 px-6 max-w-7xl mx-auto">
        <button onClick={() => setActiveSim(null)} className="flex items-center gap-2 text-gray-400 hover:text-cyan-400 transition-all uppercase text-xs font-bold border border-gray-700 px-4 py-2 rounded">
          <ArrowLeft className="w-4 h-4" /> Back to Hub
        </button>
        <EmergencySOS onExit={() => setActiveSim(null)} />
      </div>
    );
  }

  if (activeSim === 'vr') {
    return <VRSpaceExplore onExit={() => setActiveSim(null)} />;
  }

  return (
    <div className="min-h-[85vh] flex font-mono text-white relative">
      {/* Background FX */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/4 w-96 h-96 bg-purple-900/20 blur-[120px] rounded-full"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-900/20 blur-[120px] rounded-full"></div>
      </div>

      {/* Sidebar Navigation */}
      <div className="w-80 glass-panel border-r border-gray-800 z-10 flex flex-col h-[85vh] overflow-y-auto custom-scrollbar">
        <div className="p-6 border-b border-gray-800">
          <h2 className="text-2xl font-black bg-clip-text text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 tracking-widest">
            FUTURE HUB
          </h2>
          <p className="text-[10px] text-gray-500 mt-2 uppercase">Nexus Ecosystem v3.0</p>
        </div>
        
        <nav className="flex-1 py-4">
          {sectionData.map((sec) => (
            <button
              key={sec.id}
              onClick={() => setActiveSegment(sec.id)}
              className={`w-full flex items-center gap-4 px-6 py-4 transition-all duration-300 ${
                activeSegment === sec.id 
                  ? 'bg-gradient-to-r from-gray-800/80 to-transparent border-l-4 border-cyan-400' 
                  : 'hover:bg-gray-900/50 border-l-4 border-transparent text-gray-400 hover:text-white'
              }`}
            >
              <div className={`${activeSegment === sec.id ? sec.color : 'text-gray-500'} transition-colors`}>
                {sec.icon}
              </div>
              <span className="text-xs uppercase tracking-wider font-bold text-left">{sec.title}</span>
              {activeSegment === sec.id && <ChevronRight className="w-4 h-4 ml-auto text-cyan-400" />}
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 p-8 z-10 relative overflow-y-auto h-[85vh] custom-scrollbar">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeSegment}
            initial={{ opacity: 0, scale: 0.98, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: -10 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full"
          >
            {renderContent(activeSegment, setActiveSim)}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

// Routing Logic for Tabs
const renderContent = (id, setActiveSim) => {
  switch(id) {
    case 'overview': return <OldHubOverview setActiveSim={setActiveSim} />;
    case 'command-center': return <AICommandCenter setActiveSim={setActiveSim} />;
    case 'ai-lab': return <AILab />;
    case 'sat-hub': return <SatHub setActiveSim={setActiveSim} />;
    case 'metaverse': return <MetaverseZone setActiveSim={setActiveSim} />;
    case 'space-edu': return <SpaceEdu setActiveSim={setActiveSim} />;
    case 'alerts': return <RealTimeAlerts setActiveSim={setActiveSim} />;
    default: return <ComingSoon segment={id} />;
  }
};

/* --- INDIVIDUAL PANELS --- */

// 1. The original Grid UI mapped to the 'Overview' tab
const OldHubOverview = ({ setActiveSim }) => {
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
    <div className="space-y-12">
      <div className="text-center space-y-4 pt-4">
        <h1 className="text-4xl md:text-5xl font-bold italic tracking-tighter">
          VYOMVEDA <span className="text-[var(--neon-blue)] drop-shadow-[0_0_10px_var(--neon-blue)]">FUTURE HUB</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto uppercase tracking-widest text-xs font-bold">
          Pushing the boundaries of orbital technology and human connection.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {futureTech.map((tech, i) => (
          <motion.div 
            key={i}
            whileHover={{ y: -10, scale: 1.02 }}
            onClick={() => tech.isInteractive && setActiveSim(tech.id)}
            className={`glass-panel p-8 border ${tech.color} flex flex-col justify-between h-[300px] relative overflow-hidden group ${tech.isInteractive ? 'cursor-pointer hover:border-cyan-400 shadow-xl' : ''}`}
          >
            <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-all">
               {React.cloneElement(tech.icon, { size: 120 })}
            </div>
            
            <div className="relative z-10">
              <div className="mb-6 bg-white/5 w-12 h-12 rounded-xl flex items-center justify-center border border-white/10">
                {tech.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{tech.title}</h3>
              <p className="text-sm text-gray-400 leading-relaxed">{tech.desc}</p>
            </div>

            <div className="relative z-10 mt-6 flex justify-between items-center">
               <span className="text-[10px] font-bold uppercase tracking-widest text-gray-500">{tech.status}</span>
               <button className="p-2 rounded-full border border-gray-700 hover:bg-cyan-900 hover:text-cyan-400 transition-all">
                  {tech.isInteractive ? <Play className="w-4 h-4" /> : <ExternalLink className="w-4 h-4" />}
               </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Featured Large Section: VR Demo Mock */}
      <section className="glass-panel p-8 md:p-12 border border-cyan-500/30 relative overflow-hidden">
         <div className="relative z-10 flex flex-col md:flex-row items-center gap-12">
            <div className="flex-1 space-y-6">
               <h2 className="text-3xl font-bold flex items-center text-white">
                  <Zap className="w-8 h-8 mr-4 text-cyan-400" />
                  Experience OrbitX VR
               </h2>
               <p className="text-md text-gray-400 leading-relaxed">
                  Feel the weightlessness of orbit. Our XR platform allows you to walk through the VyomVeda Space Station and control satellites in a 1:1 immersive WebXR environment.
               </p>
               <button 
                  onClick={() => setActiveSim('vr')}
                  className="px-8 py-3 bg-cyan-900/40 border border-cyan-500 text-cyan-400 font-bold hover:bg-cyan-500 hover:text-black transition-all uppercase tracking-widest shadow-[0_0_20px_rgba(0,255,255,0.3)]"
               >
                  Connect VR Headset
               </button>
            </div>
            <div 
               onClick={() => setActiveSim('vr')}
               className="w-full md:w-80 aspect-video bg-gray-900 rounded-2xl flex items-center justify-center border border-gray-800 group cursor-pointer overflow-hidden relative shadow-2xl"
            >
               <Glasses className="w-20 h-20 text-gray-800 group-hover:text-cyan-400 transition-all animate-pulse" />
               <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60" />
               <p className="absolute bottom-4 text-xs font-bold uppercase tracking-widest text-gray-500">Live Simulation: READY</p>
            </div>
         </div>
      </section>
    </div>
  );
};

const AICommandCenter = ({ setActiveSim }) => (
  <div className="h-full flex flex-col space-y-6">
    <div className="glass-panel p-8 border border-cyan-500/30 flex items-center justify-between">
      <div>
        <h3 className="text-3xl font-bold text-cyan-400 flex items-center gap-3">
          <BrainCircuit className="w-10 h-10 animate-pulse"/> ORACLE A.I.
        </h3>
        <p className="text-gray-400 mt-2 text-sm uppercase max-w-lg leading-relaxed">
          Your personal predictive intelligence matrix. Ask anything regarding Earth telemetry, Orbital mechanics, or Neural Networks.
        </p>
      </div>
      <div className="w-32 h-32 rounded-full border border-cyan-900 flex items-center justify-center relative">
         <div className="absolute inset-2 border-t-2 border-b-2 border-cyan-400 rounded-full animate-[spin_4s_linear_infinite]"></div>
         <div className="absolute inset-4 border-l-2 border-r-2 border-purple-500 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
         <Zap className="text-cyan-400 animate-pulse" />
      </div>
    </div>
    
    <div className="flex-1 grid grid-cols-2 gap-6">
       <div className="glass-panel p-6 border border-gray-800 flex flex-col">
         <h4 className="text-purple-400 font-bold mb-4 uppercase tracking-widest text-xs border-b border-gray-800 pb-2">Neural Link Chat</h4>
         <div className="flex-1 space-y-4 text-xs">
           <div className="bg-gray-900 p-3 rounded text-gray-300">
             <span className="text-cyan-500 font-bold uppercase block mb-1">Oracle:</span>
             I detect elevated focus levels. Would you like me to load the advanced Mind-Link Robotics module today?
           </div>
         </div>
         <div className="mt-4 flex gap-2">
           <input type="text" placeholder="Access terminal..." className="flex-1 bg-black/50 border border-gray-700 rounded px-4 py-2 text-xs focus:outline-none focus:border-cyan-500 transition-colors" />
           <button className="bg-cyan-900/50 hover:bg-cyan-800 text-cyan-400 px-6 py-2 rounded text-xs tracking-widest uppercase border border-cyan-500/50 transition-all shadow-[0_0_10px_rgba(0,255,255,0.2)]">Engage</button>
         </div>
       </div>

       <div className="space-y-6">
         <div className="glass-panel p-6 border border-gray-800">
           <h4 className="text-blue-400 font-bold mb-2 uppercase tracking-widest text-xs">Emotion Context</h4>
           <div className="w-full bg-gray-900 rounded-full h-2 mt-4 relative overflow-hidden">
             <div className="bg-gradient-to-r from-green-500 to-cyan-500 w-[85%] h-full rounded-full"></div>
             <div className="absolute top-0 bottom-0 left-0 right-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-30 animate-[slide_2s_linear_infinite]"></div>
           </div>
           <div className="flex justify-between text-[10px] mt-2 text-gray-500 font-bold">
             <span>STRESS: LOW</span>
             <span>ENGAGEMENT: OPTIMAL</span>
           </div>
         </div>
         <div className="glass-panel p-6 border border-gray-800 flex-1 flex items-center justify-center flex-col text-center">
             <BrainCircuit className="w-12 h-12 text-green-500 mb-4 animate-pulse" />
             <p className="text-gray-400 text-xs mb-4">Mind-Link Robotics Simulation Available.</p>
             <button onClick={() => setActiveSim('mindlink')} className="px-6 py-2 border border-green-500 text-green-400 hover:bg-green-900 hover:text-white transition-all text-xs font-bold uppercase tracking-widest rounded">
                Execute Mind-Link Protocol
             </button>
         </div>
       </div>
    </div>
  </div>
);

const SpaceEdu = ({ setActiveSim }) => (
  <div className="h-full flex flex-col space-y-6">
    <div className="glass-panel p-8 border border-purple-500/30 flex items-center gap-6">
       <Rocket className="w-12 h-12 text-purple-400" />
       <div>
         <h3 className="text-3xl font-bold text-white uppercase tracking-widest">Space Education Live</h3>
         <p className="text-gray-400 text-sm">Direct feeds from NASA, ISRO, and Simulated ISS Classrooms.</p>
       </div>
    </div>
    
    <div className="grid grid-cols-3 gap-6">
       {[
         { id: 'academy', title: "Space Academy Classroom", org: "OrbitX Native", status: "INTERACTIVE", views: "Live", img: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=600&auto=format&fit=crop" },
         { id: 'sim_isro', title: "ISRO Gaganyaan SIM", org: "ISRO FEED", status: "RECORDED", views: "45K", img: "https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?q=80&w=600&auto=format&fit=crop" },
         { id: 'vr', title: "VR Exoplanet Tour", org: "OrbitX XR", status: "INTERACTIVE", views: "∞", img: "https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=600&auto=format&fit=crop" }
       ].map((feed, i) => (
         <div key={i} onClick={() => setActiveSim(feed.id)} className="glass-panel border border-gray-800 group overflow-hidden cursor-pointer relative hover:border-purple-500/50 transition-all">
            <div className="h-40 bg-gray-900 border-b border-gray-800 relative">
               <img src={feed.img} alt={feed.title} className="w-full h-full object-cover opacity-50 group-hover:opacity-80 transition-opacity duration-500 mix-blend-screen" />
               <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-purple-500/80 p-3 rounded-full shadow-[0_0_30px_purple] backdrop-blur"><Play className="w-6 h-6 text-white ml-1"/></div>
               </div>
            </div>
            <div className="p-4">
               <div className="flex justify-between items-center mb-2">
                 <span className={`text-[9px] font-bold px-2 py-1 rounded bg-gray-900 border ${feed.status==='INTERACTIVE'?'border-cyan-500 text-cyan-400': 'border-purple-500 text-purple-400'}`}>{feed.status}</span>
                 <span className="text-[10px] text-gray-500">{feed.views} AUDITS</span>
               </div>
               <h4 className="font-bold text-sm text-gray-200">{feed.title}</h4>
               <p className="text-[10px] text-gray-500 mt-1">{feed.org}</p>
            </div>
         </div>
       ))}
    </div>
  </div>
);

const AILab = () => (
  <div className="h-full flex flex-col space-y-6">
    <div className="glass-panel p-8 border border-emerald-500/30">
      <h3 className="text-3xl font-bold text-emerald-400 tracking-widest uppercase">Machine Learning Lab</h3>
      <p className="text-gray-400 mt-2 text-sm uppercase">Train models on pre-configured space datasets or run real-time YOLOv8 object detection.</p>
    </div>

    <div className="grid grid-cols-2 gap-6 flex-1">
      <div className="glass-panel border border-gray-800 p-6 flex flex-col items-center justify-center text-center space-y-6 hover:border-emerald-500/50 transition-colors shadow-2xl">
         <div className="w-24 h-24 rounded border border-dashed border-gray-600 flex items-center justify-center bg-gray-900/50 relative overflow-hidden group">
            <div className="absolute inset-0 bg-emerald-500/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
            <Cpu className="text-emerald-500/50 w-8 h-8 group-hover:text-emerald-400 transition-colors relative z-10" />
         </div>
         <div>
           <h4 className="text-white font-bold tracking-widest">DRAG & DROP DATASET</h4>
           <p className="text-xs text-gray-500 mt-2 max-w-xs mx-auto">Upload JSON or Image packs to commence training sequence via secure OrbitX isolated inference nodes.</p>
         </div>
         <button className="border border-emerald-500 text-emerald-400 px-6 py-2 rounded text-xs hover:bg-emerald-900/30 transition-all uppercase font-bold tracking-widest shadow-[0_0_15px_rgba(16,185,129,0.2)]">INITIATE TRAINING</button>
      </div>

      <div className="glass-panel border border-gray-800 p-6 flex flex-col">
          <h4 className="text-emerald-400 font-bold text-xs uppercase tracking-widest border-b border-gray-800 pb-2 mb-4">Prebuilt Architectures</h4>
          <div className="space-y-4">
            {[
              { name: "YOLOv8 Space Detector", acc: "98.4%", active: true },
              { name: "Kepler Exoplanet Miner", acc: "94.2%", active: false },
              { name: "Solar Flare LSTM Prophet", acc: "89.1%", active: false },
            ].map(m => (
              <div key={m.name} className={`flex items-center justify-between p-3 rounded border ${m.active ? 'bg-emerald-900/20 border-emerald-500/50' : 'bg-gray-900 border-gray-800'} transition-all`}>
                <span className="text-xs font-bold text-gray-300">{m.name}</span>
                <div className="flex gap-4 items-center">
                  <span className="text-[10px] text-gray-500">ACC: {m.acc}</span>
                  <button className={`w-3 h-3 rounded-full ${m.active ? 'bg-emerald-500 shadow-[0_0_10px_green]' : 'bg-gray-700'}`}></button>
                </div>
              </div>
            ))}
          </div>
      </div>
    </div>
  </div>
);

const SatHub = ({ setActiveSim }) => (
  <div className="h-full flex items-center justify-center flex-col text-center space-y-6">
    <div className="w-48 h-48 border border-blue-500 rounded-full flex items-center justify-center relative shadow-[0_0_50px_rgba(59,130,246,0.3)]">
       <div className="absolute inset-0 border-t-2 border-b-2 border-blue-400 rounded-full animate-[spin_6s_linear_infinite]"></div>
       <Satellite className="w-16 h-16 text-blue-400 animate-pulse" />
    </div>
    <h3 className="text-2xl font-bold tracking-[0.2em] text-blue-400 uppercase">Personal Satellite Builder</h3>
    <p className="text-gray-400 max-w-md text-sm mx-auto">Earth observation data, weather intelligence, and orbital trajectory analysis linking live ISRO Bhuvan/NASA datasets.</p>
    <button onClick={() => setActiveSim('satbuilder')} className="bg-blue-600/20 border border-blue-500 text-blue-400 px-8 py-3 rounded hover:bg-blue-600 hover:text-white transition-all text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(59,130,246,0.5)] flex items-center gap-2">
       <Gem className="w-4 h-4" /> Enter SatBuilder Studio
    </button>
  </div>
);

const RealTimeAlerts = ({ setActiveSim }) => (
  <div className="h-full flex items-center justify-center flex-col text-center space-y-6">
    <div className="w-48 h-48 border border-yellow-500 rounded-full flex items-center justify-center relative shadow-[0_0_50px_rgba(234,179,8,0.3)]">
       <div className="absolute inset-0 border-t-2 border-b-2 border-yellow-400 rounded-full animate-[spin_3s_linear_infinite_reverse]"></div>
       <CloudLightning className="w-16 h-16 text-yellow-400 animate-pulse" />
    </div>
    <h3 className="text-2xl font-bold tracking-[0.2em] text-yellow-400 uppercase">Disaster Management Overseer</h3>
    <p className="text-gray-400 max-w-md text-sm mx-auto">Predictive AI for floods, quakes, and wildfires using infra-red satellite tracking algorithms.</p>
    <button onClick={() => setActiveSim('disaster')} className="bg-yellow-600/20 border border-yellow-500 text-yellow-400 px-8 py-3 rounded hover:bg-yellow-500 hover:text-black transition-all text-xs font-bold uppercase tracking-widest shadow-[0_0_20px_rgba(234,179,8,0.5)]">
       Launch Overseer System
    </button>
  </div>
);

const MetaverseZone = ({ setActiveSim }) => (
  <div className="h-full bg-[url('https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=1200&auto=format&fit=crop')] bg-cover bg-center rounded-xl overflow-hidden relative border border-pink-500/30">
    <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/80 to-transparent"></div>
    <div className="absolute bottom-10 left-10 z-10 space-y-4">
      <h3 className="text-4xl font-black text-pink-400 uppercase tracking-widest drop-shadow-[0_0_10px_rgba(236,72,153,0.8)]">Metaverse Zone</h3>
      <p className="text-gray-200 max-w-lg text-sm border-l-2 border-pink-500 pl-4">
        Connect your WebXR device. Enter real-scale multiplayer space stations and interact with global astronauts in zero gravity.
      </p>
      <div className="flex gap-4 pt-4">
        <button onClick={() => setActiveSim('vr')} className="bg-pink-600 text-white px-8 py-3 rounded text-xs font-bold uppercase tracking-widest hover:bg-pink-500 shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-all flex items-center gap-2">
           <Glasses className="w-4 h-4" /> Enter XR Hub
        </button>
      </div>
    </div>
  </div>
);

const ComingSoon = ({ segment }) => (
  <div className="h-full flex items-center justify-center flex-col text-center space-y-6 opacity-50">
     <div className="w-32 h-32 border border-gray-600 border-dashed rounded-full flex items-center justify-center animate-[spin_10s_linear_infinite]">
       <AlertTriangle className="text-gray-500" />
     </div>
     <h3 className="text-xl font-bold tracking-widest text-gray-400 uppercase">Module Locked</h3>
     <p className="text-xs text-gray-500 uppercase tracking-widest block max-w-sm">"{segment}" infrastructure is currently compiling... Awaiting deployment orders.</p>
  </div>
);

export default FutureHub;
