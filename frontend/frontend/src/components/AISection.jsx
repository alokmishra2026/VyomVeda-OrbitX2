import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, PhoneCall, Mic, Send, Bot, X, Volume2, VolumeX } from 'lucide-react';

const AISection = ({ user }) => {
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

  // Local Fallback AI Knowledge Base
  const generateFallbackResponse = (query) => {
    const q = query.toLowerCase();
    if (q.includes("hello") || q.includes("hi") || q.includes("namaste")) return "Greetings Commander. VyomVeda AI systems are online and monitoring orbital status.";
    if (q.includes("isro")) return "ISRO's latest Gaganyaan telemetry is stable. Geosynchronous satellites are operating at 99.8% optimal efficiency.";
    if (q.includes("nasa")) return "Connecting to NASA public JPL feeds... Artemis mission data synced. No anomalies detected in the lunar gateway sector.";
    if (q.includes("status") || q.includes("report")) return "System Report: Orbital mechanics nominal. Space weather is calm. AI Cognitive Status is at 94% neural sync.";
    if (q.includes("satellite") || q.includes("satBuilder")) return "The Nano-Sat Forge (SatBuilder) currently has 4 open orbital slots. You can configure power cores and laser comms from the Future Hub.";
    if (q.includes("sos") || q.includes("emergency")) return "Global SOS system is standing by. We have 14 military satellites ready to relay distress signals continuously.";
    if (q.includes("weather") || q.includes("flare")) return "Warning: Minor solar flare activity detected in Sector-4. Recommendation is to shield micro-satellites for the next 14 minutes.";
    if (q.includes("who are you") || q.includes("your name")) return "I am the VyomVeda AI Brain, an advanced cognitive system created to manage the OrbitX space ecosystem. I was developed by Alok Mishra.";
    if (q.includes("alok") || q.includes("mishra")) return "Alok Mishra is the Chief Architect and Creator of the VyomVeda OrbitX ecosystem. All core AI directives point to his engineering.";
    
    // Default generic response
    const defaults = [
      "Command received. Analyzing telemetry data... Result nominal.",
      "Acknowledged. Processing your request through the neural matrix.",
      "That query requires deeper clearance. For now, I can confirm all orbital modules are green.",
      "I am currently operating in Local Database Mode. Connect the central API for deeper cognitive answers."
    ];
    return defaults[Math.floor(Math.random() * defaults.length)];
  };

  const handleSend = async () => {
    if (!input.trim()) return;
    const userText = input;
    const newMsg = { role: 'user', text: userText };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here' || apiKey.startsWith('AIzaSyD_')) {
       // FALLBACK LOCAL AI
       setTimeout(() => {
          setMessages(prev => [...prev, { role: 'assistant', text: '...' }]);
          setTimeout(() => {
            const fallbackText = generateFallbackResponse(userText);
            setMessages(prev => {
                const newMsgs = [...prev];
                newMsgs[newMsgs.length - 1] = { role: 'assistant', text: fallbackText };
                return newMsgs;
            });
            speak(fallbackText);
          }, 600);
       }, 300);
       return;
    }

    try {
      // Add a loading indicator message
      setMessages(prev => [...prev, { role: 'assistant', text: '...' }]);
      
      // Gemini expects alternating user/model roles, starting with user.
      // We slice(1) to skip the initial assistant greeting to avoid 400 Bad Request.
      const apiMessages = messages.slice(1).map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.text }]
      }));
      apiMessages.push({ role: 'user', parts: [{ text: userText }] });

      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          systemInstruction: {
            parts: [{ text: 'You are VyomVeda AI Brain, an advanced futuristic AI assistant integrated into the OrbitX space operations platform. Your creator is Alok Mishra. Respond in a highly professional, high-tech, slightly sci-fi tone. Keep answers concise, factual, and helpful. Do not mention that you are an AI model created by Google unless explicitly asked.' }]
          },
          contents: apiMessages,
          generationConfig: {
            maxOutputTokens: 300,
            temperature: 0.7
          }
        })
      });

      const data = await response.json();
      
      if (data.error) {
         throw new Error(data.error.message);
      }

      const aiText = data.candidates[0].content.parts[0].text;
      
      setMessages(prev => {
         const newMsgs = [...prev];
         newMsgs[newMsgs.length - 1] = { role: 'assistant', text: aiText };
         return newMsgs;
      });
      
      speak(aiText);

    } catch (error) {
       console.error("Gemini API Error:", error);
       const errorMsg = "COMMUNICATIONS FAILURE: Unable to reach the central AI core. " + error.message;
       setMessages(prev => {
         const newMsgs = [...prev];
         newMsgs[newMsgs.length - 1] = { role: 'assistant', text: errorMsg };
         return newMsgs;
       });
       speak("Communication failure. Core offline.");
    }
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
                      <img src={user?.profilePicture || "/assets/profile.jpg"} alt="User" className="w-full h-full object-cover" />
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
