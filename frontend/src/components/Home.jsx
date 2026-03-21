import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Satellite, Cpu, Globe, LayoutDashboard, BrainCircuit, Activity, Plane, BookOpen, Bot, ShieldAlert } from 'lucide-react';
import AdminPanel from './AdminPanel';

const Home = ({ setActiveTab }) => {
  const [showAdmin, setShowAdmin] = useState(false);
  const portals = [
    {
       title: "Orbital Dashboard",
       desc: "3D Space Network Map & Global SIM tracking.",
       icon: <LayoutDashboard className="w-8 h-8 text-[var(--neon-blue)]" />,
       action: () => setActiveTab('dashboard'),
       color: "neon-border-blue"
    },
    {
       title: "Future Simulation Hub",
       desc: "Disaster Mgmt, Mind-Link Rovers, VR & SOS.",
       icon: <BrainCircuit className="w-8 h-8 text-purple-400" />,
       action: () => setActiveTab('future'),
       color: "border-purple-500/30 hover:border-purple-500"
    },
    {
       title: "Live Telemetry APIs",
       desc: "Real-time NASA APOD & ISS Data Feeds.",
       icon: <Activity className="w-8 h-8 text-green-400" />,
       action: () => setActiveTab('apidata'),
       color: "border-green-500/30 hover:border-green-500"
    },
    {
       title: "VyomBot Voice AI",
       desc: "Speak directly with the orbital AI brain.",
       icon: <Bot className="w-8 h-8 text-pink-400" />,
       action: () => setActiveTab('ai'),
       color: "border-pink-500/30 hover:border-pink-500"
    },
    {
       title: "OrbitX Academy",
       desc: "YouTube API intelligence and Deep Space Education.",
       icon: <BookOpen className="w-8 h-8 text-red-500" />,
       action: () => setActiveTab('academy'),
    },
    {
       title: "Admin Command Center",
       desc: "Global oversight, sys-admin logs, & live MongoDB traffic.",
       icon: <ShieldAlert className="w-8 h-8 text-red-500" />,
       action: () => setShowAdmin(true),
       color: "border-red-500/50 hover:border-red-500 bg-red-950/20"
    },
    {
       title: "VyomVeda Nano-Sat Forge",
       desc: "Build custom orbital nodes in beautiful 3D WebXR.",
       icon: <Satellite className="w-8 h-8 text-[var(--neon-blue)]" />,
       action: () => setActiveTab('satbuilder'),
       color: "border-[var(--neon-blue)]/50 hover:border-[var(--neon-blue)] bg-[var(--neon-blue)]/10"
    }
  ];

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-16 pb-20"
    >
      {/* Hero Section */}
      <section className="flex flex-col md:flex-row items-center gap-12 mt-12">
        <div className="flex-1 space-y-6 text-center md:text-left">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="inline-block px-4 py-1 rounded-full glass-panel neon-border-blue text-xs font-bold neon-text-blue uppercase tracking-widest"
          >
            System Online: All Modules Operational
          </motion.div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-tight">
            VyomVeda <br />
            <span className="neon-text-blue">OrbitX</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-lg leading-relaxed mx-auto md:mx-0">
            Welcome to the Command Center. Select a subsystem below to access the 11 integrated orbital modules.
          </p>
        </div>

        <div className="relative mx-auto md:mr-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 100 }}
            className="w-64 h-64 md:w-80 md:h-80 rounded-full overflow-hidden neon-border-blue shadow-[0_0_50px_rgba(0,243,255,0.4)] relative z-20"
          >
             <div className="absolute inset-0 bg-black/40 z-10"></div>
             <img 
              src="/assets/profile.jpg" 
              alt="Alok Mishra" 
              className="w-full h-full object-cover relative z-0"
              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1472&h=1472&fit=crop'; }}
            />
            <div className="absolute bottom-4 left-0 right-0 text-center z-20">
               <h3 className="text-2xl font-bold text-white drop-shadow-md">Alok Mishra</h3>
               <p className="text-xs neon-text-blue font-bold tracking-widest uppercase bg-black/50 inline-block px-2 rounded">Supreme Commander</p>
            </div>
          </motion.div>
          {/* Decorative Rings */}
          <div className="absolute inset-0 border-2 border-[var(--neon-blue)] rounded-full animate-[spin_10s_linear_infinite] opacity-40 scale-110 border-t-transparent" />
          <div className="absolute inset-0 border-2 border-purple-500 rounded-full animate-[spin_15s_linear_infinite_reverse] opacity-20 scale-125 border-b-transparent" />
        </div>
      </section>

      {/* Main Portals */}
      <section className="pt-10 border-t border-white/10">
        <h2 className="text-sm font-bold uppercase tracking-widest text-[var(--neon-blue)] mb-8 flex items-center gap-2">
          <Rocket className="w-5 h-5" /> Active Orbital Subsystems
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
           {portals.map((portal, i) => (
             <motion.div 
               key={i}
               whileHover={{ y: -5, scale: 1.02 }}
               onClick={portal.action}
               className={`glass-panel p-8 border ${portal.color} cursor-pointer transition-all group relative overflow-hidden`}
             >
                <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-all scale-150">
                  {portal.icon}
                </div>
                <div className="mb-4 bg-black/50 p-4 inline-block rounded-xl border border-white/5 group-hover:bg-white/10 transition-all">
                  {portal.icon}
                </div>
                <h3 className="text-xl font-bold mb-2 group-hover:text-white text-gray-200">{portal.title}</h3>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors uppercase tracking-widest text-[10px]">{portal.desc}</p>
             </motion.div>
           ))}
        </div>
      </section>
      
      {/* Background World Logo */}
      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.02] pointer-events-none z-[-1]">
         <Globe className="w-[800px] h-[800px]" />
      </div>

      <AnimatePresence>
        {showAdmin && <AdminPanel onExit={() => setShowAdmin(false)} />}
      </AnimatePresence>
    </motion.div>
  );
};

export default Home;
