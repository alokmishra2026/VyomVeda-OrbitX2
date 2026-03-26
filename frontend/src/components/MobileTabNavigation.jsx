import React from 'react';
import { motion } from 'framer-motion';
import { Home, LayoutDashboard, Cpu, Rocket, ShieldAlert, Bot } from 'lucide-react';

const MobileTabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', icon: Home, label: 'Home' },
    { id: 'dashboard', icon: LayoutDashboard, label: 'Orbit' },
    { id: 'ai', icon: Bot, label: 'Assistant' },
    { id: 'future', icon: Rocket, label: 'Future' },
    { id: 'sos', icon: ShieldAlert, label: 'SOS', color: 'text-red-500' },
  ];

  return (
    <motion.div 
      initial={{ y: 100 }}
      animate={{ y: 0 }}
      className="fixed bottom-0 left-0 right-0 z-[60] md:hidden bg-black/80 backdrop-blur-xl border-t border-blue-500/20 px-2 pt-3"
      style={{ paddingBottom: 'calc(1.5rem + env(safe-area-inset-bottom))' }}
    >
      <div className="flex justify-around items-center">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center justify-center space-y-1 relative px-3"
            >
              {isActive && (
                <motion.div 
                  layoutId="activeTab"
                  className="absolute -top-1 w-8 h-1 bg-blue-500 rounded-full"
                />
              )}
              <Icon className={`w-6 h-6 transition-all ${isActive ? 'text-blue-400 scale-110' : tab.color || 'text-gray-500'}`} />
              <span className={`text-[10px] font-bold uppercase tracking-wider ${isActive ? 'text-blue-400' : 'text-gray-600'}`}>
                {tab.label}
              </span>
            </button>
          )
        })}
      </div>
    </motion.div>
  );
};

export default MobileTabNavigation;
