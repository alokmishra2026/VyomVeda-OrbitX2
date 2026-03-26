import React, { useState, useEffect, Suspense, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Rocket, 
  Satellite, 
  Cpu, 
  Globe, 
  MessageSquare, 
  Menu, 
  X,
  Zap,
  Bot,
  User,
  LogOut,
  Volume2,
  VolumeX,
  ShieldAlert
} from 'lucide-react';
import apiClient from './api/client'; // NEW: Centralized API
import MobileTabNavigation from './components/MobileTabNavigation'; // NEW: Mobile UI

// Use React.lazy so any failing component is caught by ErrorBoundary
const Home = React.lazy(() => import('./components/Home'));
const Dashboard = React.lazy(() => import('./components/Dashboard'));
const AISection = React.lazy(() => import('./components/AISection'));
const YouTubeSection = React.lazy(() => import('./components/YouTubeSection'));
const FutureHub = React.lazy(() => import('./components/FutureHub'));
const AuthSystem = React.lazy(() => import('./components/AuthSystem'));
const APIHub = React.lazy(() => import('./components/APIHub'));
const AdminPanel = React.lazy(() => import('./components/AdminPanel'));
const SatBuilder = React.lazy(() => import('./components/SatBuilder'));
const GlobalSOS = React.lazy(() => import('./components/GlobalSOS'));

const LoadingFallback = () => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', color: '#00f3ff', fontFamily: 'monospace' }}>
    Loading module...
  </div>
);

function App() {
  const [activeTab, setActiveTab] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [themeColor, setThemeColor] = useState('#00f3ff');
  const [user, setUser] = useState(null);
  const [showAuth, setShowAuth] = useState(false);
  const fileInputRef = useRef(null);
  const [uploadingDP, setUploadingDP] = useState(false);
  
  // Audio State
  const [isMuted, setIsMuted] = useState(true);
  const [hasEngaged, setHasEngaged] = useState(false);
  const audioRef = React.useRef(null);

  const handleDPUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingDP(true);
    const renderCanvas = document.createElement("canvas");
    const ctx = renderCanvas.getContext("2d");
    const reader = new FileReader();
    
    reader.onload = (event) => {
      const img = new Image();
      img.onload = async () => {
        renderCanvas.width = 150;
        renderCanvas.height = 150;
        ctx.drawImage(img, 0, 0, 150, 150);
        const base64Data = renderCanvas.toDataURL("image/jpeg", 0.7);
        
        try {
          const res = await apiClient.post('/api/user/profile', { profilePicture: base64Data }); // Changed to apiClient
          setUser(res.data.user);
          localStorage.setItem('orbitx_user', JSON.stringify(res.data.user));
        } catch (err) {
          console.error('Failed to upload DP:', err);
        } finally {
          setUploadingDP(false);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  const engageSystem = () => {
    setHasEngaged(true);
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().then(() => setIsMuted(false)).catch((err) => console.log("Audio play blocked", err));
    }
  };

  const toggleAudio = (e) => {
    e.stopPropagation();
    if (!audioRef.current) return;
    if (isMuted) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().then(() => setIsMuted(false)).catch(() => {});
    } else {
      audioRef.current.pause();
      setIsMuted(true);
    }
  };

  useEffect(() => {
    const savedUser = localStorage.getItem('orbitx_user');
    if (savedUser) {
      try { setUser(JSON.parse(savedUser)); } catch (e) {}
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('orbitx_token');
    localStorage.removeItem('orbitx_user');
    setUser(null);
  };

  const colors = ['#00f3ff', '#9d00ff', '#ff00c8', '#00ff41'];
  useEffect(() => {
    const interval = setInterval(() => {
      const randomColor = colors[Math.floor(Math.random() * colors.length)];
      setThemeColor(randomColor);
      document.documentElement.style.setProperty('--neon-blue', randomColor);
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative min-h-screen text-white overflow-hidden bg-black">
      {/* Background Space Cinematic Music */}
      <audio ref={audioRef} loop preload="auto">
         <source src="https://cdn.pixabay.com/audio/2022/02/10/audio_fc8626f21c.mp3" type="audio/mpeg" />
      </audio>

      {/* Entry Overlay for Autoplay & Cinematic Effect */}
      <AnimatePresence>
        {!hasEngaged && (
          <motion.div 
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            transition={{ duration: 1 }}
            className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center space-y-8"
          >
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1, delay: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 blur-3xl bg-[var(--neon-blue)] opacity-20 animate-pulse rounded-full" />
              <Rocket className="w-24 h-24 neon-text-blue relative z-10" />
            </motion.div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center space-y-2"
            >
              <h1 className="text-4xl font-bold tracking-[0.2em]">VYOMVEDA <span className="neon-text-blue">ORBITX</span></h1>
              <p className="text-gray-500 uppercase tracking-widest text-xs">A Global Space-Tech & AI Ecosystem</p>
            </motion.div>

            <motion.button
              whileHover={{ scale: 1.05, boxShadow: "0 0 30px var(--neon-blue)" }}
              whileTap={{ scale: 0.95 }}
              onClick={engageSystem}
              className="px-8 py-3 bg-[var(--neon-blue)] text-black font-bold rounded-lg transition-all"
            >
              ENGAGE ORBITAL SYSTEMS
            </motion.button>
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              transition={{ delay: 1.5 }}
              className="text-[10px] uppercase tracking-[0.5em] text-gray-400"
            >
              (Audio Recommended)
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20 hidden md:block">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="absolute blur-3xl rounded-full" 
               style={{ 
                 top: `${(i * 20) + 5}%`, 
                 left: `${(i * 20) + 5}%`, 
                 width: '300px', 
                 height: '300px', 
                 background: themeColor 
               }} 
          />
        ))}
      </div>

      {/* Navigation - Desktop only */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center glass-panel px-6 py-3 neon-border-blue">
          <div className="flex items-center space-x-2">
            <Rocket className="w-8 h-8 neon-text-blue" />
            <span className="text-xl font-bold tracking-tighter">VyomVeda <span className="neon-text-blue">OrbitX</span></span>
          </div>

          <div className="flex space-x-8 items-center">
            {['home', 'dashboard', 'apidata', 'academy', 'ai', 'future', ...(user?.role === 'admin' ? ['admin'] : [])].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`capitalize transition-all hover:neon-text-blue ${activeTab === tab ? 'neon-text-blue font-bold' : 'text-gray-400'}`}
              >
                {tab === 'academy' ? 'OrbitX Academy' : tab === 'future' ? 'Future Hub' : tab === 'apidata' ? 'API Hub' : tab === 'admin' ? 'Admin Panel' : tab}
              </button>
            ))}
            
            <button 
              onClick={() => setActiveTab('sos')}
              className={`capitalize transition-all font-bold flex items-center gap-1 ml-4 ${activeTab === 'sos' ? 'text-red-500 shadow-[0_0_15px_red] bg-red-900/20 px-3 py-1 rounded' : 'text-red-400 hover:text-red-300 border border-red-500/50 px-3 py-1 rounded'}`}
            >
              <ShieldAlert className="w-4 h-4" /> SOS
            </button>
            
            {user ? (
              <div className="flex items-center gap-4 border-l border-white/20 pl-6">
                <input type="file" ref={fileInputRef} onChange={handleDPUpload} accept="image/*" className="hidden" />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  className={`relative w-8 h-8 rounded-full border border-[var(--neon-blue)] overflow-hidden hover:scale-110 transition-all ${uploadingDP ? 'opacity-50 animate-pulse' : ''}`}
                >
                  <img src={user.profilePicture || '/assets/profile.jpg'} alt="DP" className="w-full h-full object-cover" />
                </button>
                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition-all">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button onClick={() => setShowAuth(true)} className="flex items-center gap-2 px-4 py-2 border border-blue-500/50 rounded-lg text-blue-400 hover:bg-blue-500 hover:text-black transition-all text-xs font-bold uppercase tracking-widest ml-4">
                <User className="w-4 h-4" /> Connect ID
              </button>
            )}

            <button onClick={toggleAudio} className="p-2 ml-4 rounded-full border border-gray-600 text-gray-400 hover:text-[var(--neon-blue)] hover:border-[var(--neon-blue)]">
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Top Header */}
      <header className="md:hidden fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-md px-6 py-4 flex justify-between items-center border-b border-blue-500/20">
        <div className="flex items-center space-x-2">
          <Rocket className="w-6 h-6 neon-text-blue" />
          <span className="text-lg font-bold">VyomVeda <span className="neon-text-blue">OrbitX</span></span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={toggleAudio} className="text-gray-400">
            {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
          </button>
          {user && (
            <img src={user.profilePicture || '/assets/profile.jpg'} className="w-8 h-8 rounded-full border border-blue-500" />
          )}
        </div>
      </header>

      <main className="pt-20 md:pt-24 pb-24 md:pb-12 px-6 relative z-10 max-w-7xl mx-auto">
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            {activeTab === 'home' && <Home key="home" setActiveTab={setActiveTab} />}
            {activeTab === 'dashboard' && <Dashboard key="dashboard" />}
            {activeTab === 'apidata' && <APIHub key="apidata" />}
            {activeTab === 'ai' && <AISection user={user} key="ai" />}
            {activeTab === 'academy' && <YouTubeSection key="academy" />}
            {activeTab === 'future' && <FutureHub key="future" />}
            {activeTab === 'admin' && <AdminPanel key="admin" onExit={() => setActiveTab('home')} />}
            {activeTab === 'satbuilder' && <SatBuilder key="satbuilder" onExit={() => setActiveTab('home')} />}
            {activeTab === 'sos' && <GlobalSOS key="sos" user={user} />}
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Mobile Bottom Tab Bar */}
      <MobileTabNavigation activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Desktop AI Assistant Floating */}
      <div className="fixed bottom-6 right-6 z-50 hidden md:block">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          onClick={() => setActiveTab('ai')}
          className="flex items-center space-x-3 glass-panel p-3 px-5 neon-border-blue"
        >
          <div className="w-10 h-10 rounded-full border-2 border-[var(--neon-blue)] bg-blue-900 flex items-center justify-center">
            <Bot className="w-5 h-5 neon-text-blue" />
          </div>
          <div className="flex flex-col items-start leading-tight text-left">
            <span className="text-xs font-bold neon-text-blue">AI COMMAND</span>
            <span className="text-sm">OrbitX Assistant</span>
          </div>
        </motion.button>
      </div>

      {/* Auth System Modal */}
      {showAuth && (
        <Suspense fallback={null}>
          <AuthSystem 
            onClose={() => setShowAuth(false)} 
            onLogin={(userData) => setUser(userData)} 
          />
        </Suspense>
      )}
    </div>
  );
}

export default App;
