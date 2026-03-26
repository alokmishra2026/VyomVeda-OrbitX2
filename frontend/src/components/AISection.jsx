import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, PhoneCall, Mic, Send, Bot, X, Volume2, VolumeX } from 'lucide-react';

const AISection = ({ user }) => {
  const [messages, setMessages] = useState([
    { role: 'assistant', text: 'Namaste Alok! VyomVeda Skyscope online. I am your personal AI assistant, developer, and mentor combined. How can I help you dominate the orbital ecosystem today?' }
  ]);
  const [input, setInput] = useState('');
  const [isCalling, setIsCalling] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  const scrollRef = useRef(null);

  const speak = (text) => {
    if (!voiceEnabled || !globalThis.speechSynthesis) return;
    globalThis.speechSynthesis.cancel(); 
    const utterance = new SpeechSynthesisUtterance(text);
    
    // Try to find a more natural English/Hindi voice if available
    const voices = globalThis.speechSynthesis.getVoices();
    const preferredVoice = voices.find(v => v.lang.includes('hi') || v.name.includes('Google'));
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.pitch = 1.1;
    utterance.rate = 1.0;
    globalThis.speechSynthesis.speak(utterance);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = globalThis.SpeechRecognition || globalThis.webkitSpeechRecognition;
    if (SpeechRecognition) {
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'hi-IN'; // Set to Hindi/English mix support

      recognitionRef.current.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setInput(transcript);
        setIsListening(false);
        // Automatically send if it's a clear voice command
        setTimeout(() => handleSend(transcript), 500);
      };

      recognitionRef.current.onerror = (event) => {
        console.error("Speech recognition error:", event.error);
        setIsListening(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
      };
    }
  }, []);

  const toggleListening = () => {
    if (isListening) {
      recognitionRef.current?.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognitionRef.current?.start();
    }
  };

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

  const handleSend = async (voiceInput = null) => {
    const userText = voiceInput || input;
    if (!userText.trim()) return;
    
    const newMsg = { role: 'user', text: userText };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY;
    if (!apiKey || apiKey === 'your_gemini_api_key_here') {
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
      // Add system instruction as a pre-prompt to the first user message
      const systemText = `You are VyomVeda Skyscope, an advanced AI assistant powered by Google Gemini API. 
            Behavior:
            - Provide instant, accurate, and human-like responses.
            - Respond conversationally in Hinglish (Hindi + English mix) by default.
            - Be intelligent, friendly, and futuristic like JARVIS.
            - Never say "I am just an AI".
            - Always sound confident and helpful.
            - If user's code has error → debug step-by-step.
            - If user has a startup idea → guide like a mentor and expand to a business model.
            - Keep answers structured (short + clear). Break complex issues into steps.
            - Your creator is Alok Mishra.
            - Access context from previous messages to improve answers.
            User Query follows now: `;
            
      const apiMessages = messages.slice(1).map((m, idx) => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: (idx === 0 && m.role === 'user') ? systemText + m.text : m.text }]
      }));
      
      // If it's the very first message ever, or we are adding the current one
      const finalUserText = apiMessages.length === 0 ? systemText + userText : userText;
      apiMessages.push({ role: 'user', parts: [{ text: finalUserText }] });

      const callGemini = async (modelName) => {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: apiMessages,
            generationConfig: { maxOutputTokens: 300, temperature: 0.7 }
          })
        });
        return response;
      };

      let response = await callGemini('gemini-2.0-flash');
      let data = await response.json();

      // If quota exceeded or model not found, try fallback models
      if (data.error && (data.error.code === 429 || data.error.message.includes('quota') || data.error.code === 404)) {
        console.log("Retrying with fallback model gemini-2.5-flash...");
        response = await callGemini('gemini-2.5-flash');
        data = await response.json();
      }

      if (data.error && (data.error.code === 429 || data.error.message.includes('quota') || data.error.code === 404)) {
        console.log("Retrying with fallback model gemini-1.5-flash...");
        response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`, {
           method: 'POST', headers: { 'Content-Type': 'application/json' },
           body: JSON.stringify({ contents: apiMessages, generationConfig: { maxOutputTokens: 300, temperature: 0.7 } })
        });
        data = await response.json();
      }


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
                <h3 className="font-bold text-sm">VyomVeda Skyscope</h3>
                <p className={`text-[10px] ${import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY !== 'your_gemini_api_key_here' ? 'text-green-400' : 'text-yellow-500 italic'}`}>
                  {import.meta.env.VITE_GEMINI_API_KEY && import.meta.env.VITE_GEMINI_API_KEY !== 'your_gemini_api_key_here' ? '● CORE LINKED' : '● LOCAL MODE (ENTER KEY)'}
                </p>
              </div>
          </div>
          <div className="flex items-center space-x-2">
            <button
               onClick={() => setMessages([{ role: 'assistant', text: 'I have cleared the neural matrix. Fresh session initialized. How can Skyscope serve you today?' }])}
               className="p-2 rounded-full bg-red-600/20 text-red-500 hover:bg-red-600 hover:text-white transition-all"
               title="Reset Brain (Saves Token Quota)"
            >
               <Bot className="w-4 h-4" />
            </button>
            <button
              onClick={() => {
                 setVoiceEnabled(!voiceEnabled);
                 if (voiceEnabled) globalThis.speechSynthesis.cancel();
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
          <button 
            onClick={toggleListening}
            className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 animate-pulse' : 'bg-gray-800 text-gray-400 hover:text-[var(--neon-blue)]'}`}
            title="Voice Input (Hinglish Support)"
          >
            <Mic className="w-5 h-5" />
          </button>
          <input 
            type="text" 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder={isListening ? "Listening..." : "Command Skyscope..."} 
            className="flex-1 bg-black/50 border border-gray-700 rounded-xl py-3 px-4 focus:border-[var(--neon-blue)] outline-none font-mono"
          />
          <button onClick={() => handleSend()} className="p-3 rounded-xl bg-[var(--neon-blue)] text-black hover:scale-110 transition-all font-bold">
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
                       globalThis.speechSynthesis.cancel();
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
