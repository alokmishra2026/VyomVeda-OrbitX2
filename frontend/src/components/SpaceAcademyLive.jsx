import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Users, Radio, Send, Camera, Brain, ArrowLeft } from 'lucide-react';

const SpaceAcademyLive = ({ onExit }) => {
  const [chatMessage, setChatMessage] = useState('');
  const [messages, setMessages] = useState([
    { user: 'OrbitX_Admin', text: 'Welcome to the Live ISS Telemetry Classroom.', isSystem: true },
    { user: 'Student_7A', text: 'What is the current orbital velocity?', isSystem: false },
    { user: 'Prof_Nova', text: 'It should be roughly 27,600 km/h right now.', isSystem: false },
  ]);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;
    setMessages([...messages, { user: 'You (Guest)', text: chatMessage, isSystem: false }]);
    setChatMessage('');
    
    // Auto-reply mock
    setTimeout(() => {
       setMessages(prev => [...prev, { user: 'VyomBot', text: 'Analyzing your query...', isSystem: true }]);
    }, 1500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="max-w-7xl mx-auto space-y-6 pb-20"
    >
      <div className="flex justify-between items-center border-b border-cyan-500/30 pb-4">
        <div>
          <h2 className="text-3xl font-bold flex items-center gap-3 tracking-widest uppercase text-white">
            <BookOpen className="w-8 h-8 text-cyan-400 animate-pulse" />
            SPACE EDUCATION <span className="text-cyan-400">LIVE</span>
          </h2>
          <p className="text-xs text-cyan-400/70 uppercase tracking-widest mt-1 flex items-center gap-2">
             <Radio className="w-3 h-3 text-red-500 animate-pulse" /> Live transmission from International Space Station
          </p>
        </div>
        <button onClick={onExit} className="glass-panel px-4 py-2 hover:bg-white/10 transition-all text-xs font-bold uppercase text-gray-400 hover:text-white border-cyan-500/30">
          Leave Classroom
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 h-[600px]">
        {/* Main Video Stream */}
        <div className="lg:col-span-3 glass-panel p-2 flex flex-col border-cyan-500/30 overflow-hidden relative">
          <div className="flex justify-between items-center px-4 py-2 border-b border-white/10 mb-2 bg-black/40 rounded-t">
            <div className="flex items-center gap-2 text-xs font-bold text-gray-400 tracking-widest uppercase">
              <Camera className="w-4 h-4 text-cyan-400" /> Cam 01: External Earth View
            </div>
            <div className="flex items-center gap-2 text-xs font-bold text-red-400 tracking-widest uppercase animate-pulse">
               LIVE RECORDING
            </div>
          </div>
          
          <div className="flex-1 rounded-lg overflow-hidden relative bg-black border border-white/5">
            {/* Animated fallback underneath in case embed is blocked */}
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-gray-950 via-blue-950/40 to-black z-0">
              <div className="w-48 h-48 rounded-full border border-blue-500/30 absolute animate-[spin_20s_linear_infinite] opacity-20"></div>
              <div className="w-32 h-32 rounded-full border border-cyan-500/30 absolute animate-[spin_12s_linear_infinite_reverse] opacity-30"></div>
              <div className="text-center z-10 space-y-3">
                <div className="w-4 h-4 bg-blue-400 rounded-full mx-auto animate-pulse shadow-[0_0_20px_cyan]"></div>
                <p className="text-cyan-400 text-xs font-bold uppercase tracking-widest">Live ISS Camera Feed</p>
                <p className="text-gray-500 text-[10px]">Stream loading... or open directly on NASA</p>
                <a 
                  href="https://www.youtube.com/watch?v=21X5lGlDOfg" 
                  target="_blank" 
                  rel="noreferrer"
                  className="inline-block mt-2 px-4 py-1.5 border border-cyan-500 text-cyan-400 text-[10px] font-bold uppercase rounded hover:bg-cyan-900/50 transition-all"
                >
                  Open NASA Live Stream ↗
                </a>
              </div>
            </div>

            {/* NASA ISS 24/7 Live Stream — official NASA HD Earth Viewing */}
            <iframe 
              className="absolute inset-0 w-full h-full pointer-events-auto z-10" 
              src="https://www.youtube.com/embed/21X5lGlDOfg?autoplay=1&mute=1&controls=1&modestbranding=1&rel=0" 
              title="NASA ISS Live Earth View"
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen 
            />

            {/* HUD Overlay */}
            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/80 to-transparent flex justify-between items-end pointer-events-none z-20">
               <div className="font-mono text-cyan-400 text-xs space-y-1 drop-shadow-md">
                 <p>ALTITUDE: 418.2 KM</p>
                 <p>INCLINATION: 51.6 DEG</p>
                 <p>VELOCITY: 7.66 KM/S</p>
               </div>
               <div className="w-32 h-16 border border-cyan-500/30 rounded-xl bg-black/60 flex items-center justify-center p-2 text-center shadow-[0_0_15px_rgba(0,255,255,0.2)]">
                  <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Target Area: Pacific</span>
               </div>
            </div>
          </div>
        </div>


        {/* Live Chat & Quiz Panel */}
        <div className="lg:col-span-1 space-y-4 flex flex-col h-full">
           <div className="bg-cyan-900/20 border border-cyan-500/30 p-4 rounded-xl flex items-center gap-3">
              <Users className="w-6 h-6 text-cyan-400" />
              <div>
                 <p className="text-xs font-bold uppercase tracking-widest text-cyan-400">Global Classroom</p>
                 <p className="text-[10px] text-gray-400">14,024 Students Online</p>
              </div>
           </div>

           <div className="glass-panel border-white/10 flex-1 flex flex-col overflow-hidden">
             <div className="flex-1 overflow-y-auto p-4 space-y-3 test-xs custom-scrollbar">
               {messages.map((msg, idx) => (
                 <div key={idx} className={`${msg.isSystem ? 'text-cyan-300' : 'text-gray-300'}`}>
                   <span className={`font-bold text-[10px] uppercase tracking-widest block mb-0.5 ${msg.isSystem ? 'text-cyan-500' : 'text-gray-500'}`}>
                     {msg.user}
                   </span>
                   <span className="text-sm bg-black/40 p-2 rounded border border-white/5 block break-words">
                     {msg.text}
                   </span>
                 </div>
               ))}
               <div ref={chatEndRef} />
             </div>
             <form onSubmit={handleSend} className="p-3 bg-black/60 border-t border-white/10 flex gap-2">
                <input 
                  type="text" 
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  placeholder="Ask a question..." 
                  className="flex-1 bg-transparent border border-gray-700 rounded px-3 py-2 text-sm focus:border-cyan-500 outline-none transition-all placeholder-gray-600 font-sans"
                />
                <button type="submit" className="bg-cyan-500/20 text-cyan-400 p-2 rounded hover:bg-cyan-500 hover:text-black transition-all">
                   <Send className="w-4 h-4" />
                </button>
             </form>
           </div>
           
           {/* Interactive Exercise Mock */}
           <div className="glass-panel p-4 border border-yellow-500/30">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-yellow-400 flex items-center gap-2 mb-2">
                 <Brain className="w-3 h-3" /> Live Pop Quiz
              </h4>
              <p className="text-[11px] text-gray-300 mb-3">Based on the telemetry overlay, what orbital plane is the ISS currently passing?</p>
              <div className="grid grid-cols-2 gap-2">
                 <button className="py-2 px-1 text-center border border-white/10 text-[9px] font-bold uppercase tracking-widest rounded hover:bg-white/10 transition-all text-gray-400">Equatorial</button>
                 <button className="py-2 px-1 text-center border border-cyan-500/50 text-[9px] font-bold uppercase tracking-widest rounded bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500 hover:text-black transition-all">51.6° Inclined</button>
                 <button className="py-2 px-1 text-center border border-white/10 text-[9px] font-bold uppercase tracking-widest rounded hover:bg-white/10 transition-all text-gray-400">Polar</button>
                 <button className="py-2 px-1 text-center border border-white/10 text-[9px] font-bold uppercase tracking-widest rounded hover:bg-white/10 transition-all text-gray-400">Geostationary</button>
              </div>
           </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SpaceAcademyLive;
