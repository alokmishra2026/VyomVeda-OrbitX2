import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, PhoneCall, Mic, Send, Bot, X, Volume2, VolumeX } from 'lucide-react';

const AISection = () => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Namaste Alok! VyomVeda AI Brain at your service. How can I assist you with the orbital ecosystem today?' }
  ]);
  const [input, setInput] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const scrollRef = useRef(null);

  const speak = (text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop current speech
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.pitch = 1.2;
    utterance.rate = 1.05;
    window.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    const newMsg = { role: 'user', text: input };
    setMessages([...messages, newMsg]);
    setInput('');

    // Mock AI Response
    setTimeout(() => {
      const responseText = `Analysis complete. Predictive analytics suggest optimal satellite alignment for ${input.substring(0, 10)}... in sector-G.`;
      setMessages(prev => [...prev, { 
        role: 'assistant', 
        text: responseText 
      }]);
      speak(responseText);
    }, 1000);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="grid grid-cols-1 md:grid-cols-12 gap-8 h-[600px]"
    >
      {/* AI Assistant Chat */}
      <div className="md:col-span-8 glass-panel flex flex-col neon-border-blue overflow-hidden">
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-white/5">
          <div className="flex items-center space-x-3">
             <div className="w-10 h-10 rounded-full border border-[var(--neon-blue)] overflow-hidden">
                <img src="/assets/profile.jpg" alt="AI Agent" className="w-full h-full object-cover" />
             </div>
             <div>
                <h3 className="font-bold text-sm">Mishra AI Assistant</h3>
                <p className="text-[10px] text-green-400">● SPACE-ENABLED LIVE</p>
             </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                 setVoiceEnabled(!voiceEnabled);
                 if (voiceEnabled) window.speechSynthesis.cancel();
              }}
              className={`p-2 rounded-full ${voiceEnabled ? 'bg-[var(--neon-blue)]/20 text-[var(--neon-blue)]' : 'bg-gray-800 text-gray-400'} hover:bg-[var(--neon-blue)] hover:text-black transition-all`}
              title="Toggle AI Voice"
            >
              {voiceEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>
            <button 
              onClick={() => {
                setIsCalling(true);
                speak("Satellite Voice Chat Linked. Awaiting encrypted voice transmission.");
              }}
              className="p-2 rounded-full bg-[var(--neon-blue)]/20 text-[var(--neon-blue)] hover:bg-[var(--neon-blue)] hover:text-black transition-all"
              title="Commence Voice Call"
            >
              <PhoneCall className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-4 font-sans scroll-smooth">
          {messages.map((msg, i) => (
            <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-[var(--neon-blue)] text-black' : 'glass-panel border-gray-700'}`}>
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-white/5 border-t border-gray-800 flex items-center space-x-4">
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Command the AI Brain..." 
            className="flex-1 bg-black/50 border border-gray-700 rounded-xl py-3 px-4 focus:border-[var(--neon-blue)] outline-none"
          />
          <button onClick={handleSend} className="p-3 rounded-xl bg-[var(--neon-blue)] text-black hover:scale-110 transition-all">
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Voice Call Overlay Mock */}
      <AnimatePresence>
        {isCalling && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-center justify-center"
          >
             <div className="text-center space-y-8">
                <div className="relative">
                   <div className="w-48 h-48 rounded-full border-4 border-[var(--neon-blue)] overflow-hidden mx-auto shadow-[0_0_50px_rgba(0,243,255,0.3)]">
                      <img src="/assets/profile.jpg" alt="Alok" className="w-full h-full object-cover" />
                   </div>
                   <div className="absolute inset-0 rounded-full border-2 border-white/20 animate-ping" />
                </div>
                <div className="space-y-2">
                   <h2 className="text-3xl font-bold">Connecting...</h2>
                   <p className="text-[var(--neon-blue)] animate-pulse">Satellite Voice Chat Link Up</p>
                </div>
                <div className="flex justify-center space-x-8">
                   <button className="p-6 rounded-full bg-gray-800 hover:bg-[var(--neon-blue)] hover:text-black transition-all">
                      <Mic className="w-8 h-8" />
                   </button>
                   <button 
                     onClick={() => {
                       setIsCalling(false);
                       window.speechSynthesis.cancel();
                     }}
                     className="p-6 rounded-full bg-red-600 hover:bg-red-700 transition-all text-white"
                   >
                      <X className="w-8 h-8" />
                   </button>
                </div>
             </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Secondary Metrics */}
      <div className="md:col-span-4 space-y-6">
        <div className="glass-panel p-6 neon-border-blue">
          <h4 className="font-bold flex items-center mb-4">
             <Bot className="w-5 h-5 mr-2" /> AI Cognitive Status
          </h4>
          <div className="space-y-4">
             {[
               { label: 'Neural Sync', value: 94 },
               { label: 'Predictive Logic', value: 87 },
               { label: 'Response Latency', value: '12ms' }
             ].map((stat, i) => (
               <div key={i}>
                 <div className="flex justify-between text-xs mb-1">
                   <span>{stat.label}</span>
                   <span className="neon-text-blue">{stat.value}%</span>
                 </div>
                 <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${stat.value}%` }}
                      className="h-full bg-[var(--neon-blue)]"
                    />
                 </div>
               </div>
             ))}
          </div>
        </div>

        <div className="glass-panel p-6 border-yellow-500/50">
          <h4 className="font-bold text-yellow-400 flex items-center mb-2 italic">
             ⚠️ PREDICTIVE ALERT
          </h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            Minor solar flare activity detected in Sector-4. Recommendation: Shield micro-satellites S-44 through S-50 for next 14 minutes.
          </p>
          <button className="w-full mt-4 py-2 bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded text-xs hover:bg-yellow-500 hover:text-black transition-all">
            EXECUTE SHIELDING
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default AISection;
