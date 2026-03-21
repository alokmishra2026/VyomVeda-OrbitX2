import React, { useState, useEffect, Suspense } from 'react';
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
  VolumeX
} from 'lucide-react';

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
          const token = localStorage.getItem('orbitx_token');
          const res = await fetch('/api/user/profile', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ profilePicture: base64Data })
          });
          const data = await res.json();
          if (res.ok) {
            setUser(data.user);
            localStorage.setItem('orbitx_user', JSON.stringify(data.user));
          } else {
            console.error(data.error);
          }
        } catch (err) {
          console.error(err);
        } finally {
          setUploadingDP(false);
        }
      };
      img.src = event.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Play audio on first user interaction
  useEffect(() => {
    const startAudio = () => {
      if (audioRef.current && isMuted) {
        audioRef.current.volume = 0.4;
        audioRef.current.play().then(() => setIsMuted(false)).catch(() => {});
        document.removeEventListener('click', startAudio);
      }
    };
    document.addEventListener('click', startAudio);
    return () => document.removeEventListener('click', startAudio);
  }, [isMuted]);

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
    <div className="relative min-h-screen text-white overflow-hidden">
      {/* Background Space Cinematic Music */}
      <audio ref={audioRef} loop preload="auto">
         <source src="https://cdn.pixabay.com/audio/2022/10/25/audio_51cbfa7717.mp3" type="audio/mpeg" />
         <source src="https://cdn.pixabay.com/audio/2022/11/22/audio_febc508520.mp3" type="audio/mpeg" />
      </audio>

      {/* Dynamic Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
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

      {/* Floating Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <Rocket className="floating-jet" style={{ top: '15%', animationDelay: '0s' }} />
        <Rocket className="floating-jet-reverse" style={{ top: '35%', animationDelay: '5s' }} />
        <Satellite className="floating-sat" style={{ top: '65%', left: '8%', animationDelay: '2s' }} />
        <Bot className="floating-drone" style={{ bottom: '15%', right: '20%', animationDelay: '3s' }} />
        <Zap className="floating-jet" style={{ top: '80%', animationDelay: '10s', transform: 'scale(0.4)' }} />
      </div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center glass-panel px-6 py-3 neon-border-blue">
          <div className="flex items-center space-x-2">
            <Rocket className="w-8 h-8 neon-text-blue" />
            <span className="text-xl font-bold tracking-tighter">VyomVeda <span className="neon-text-blue">OrbitX</span></span>
          </div>

          <div className="hidden md:flex space-x-8 items-center">
            {['home', 'dashboard', 'apidata', 'academy', 'ai', 'future', ...(user?.role === 'admin' ? ['admin'] : [])].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`capitalize transition-all hover:neon-text-blue ${activeTab === tab ? 'neon-text-blue font-bold' : 'text-gray-400'}`}
              >
                {tab === 'academy' ? 'OrbitX Academy' : tab === 'future' ? 'Future Hub' : tab === 'apidata' ? 'API Hub' : tab === 'admin' ? 'Admin Panel' : tab}
              </button>
            ))}
            
            {user ? (
              <div className="flex items-center gap-4 border-l border-white/20 pl-6">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleDPUpload} 
                  accept="image/*" 
                  className="hidden" 
                />
                <button 
                  onClick={() => fileInputRef.current?.click()}
                  title="Upload Custom Profile Picture"
                  className={`relative w-8 h-8 rounded-full border border-[var(--neon-blue)] overflow-hidden hover:scale-110 transition-all ${uploadingDP ? 'opacity-50 animate-pulse' : ''}`}
                >
                  <img src={user.profilePicture || '/assets/profile.jpg'} alt="DP" className="w-full h-full object-cover" />
                </button>
                <span className="text-gray-300 font-mono text-xs hidden lg:inline">ID: {user.email.split('@')[0]}</span>
                <button onClick={handleLogout} className="text-red-400 hover:text-red-300 transition-all">
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button 
                onClick={() => setShowAuth(true)}
                className="flex items-center gap-2 px-4 py-2 border border-blue-500/50 rounded-lg text-blue-400 hover:bg-blue-500 hover:text-black transition-all text-xs font-bold uppercase tracking-widest ml-4"
              >
                <User className="w-4 h-4" /> Connect ID
              </button>
            )}

            <button 
              onClick={toggleAudio}
              className="p-2 ml-4 rounded-full border border-gray-600 text-gray-400 hover:text-[var(--neon-blue)] hover:border-[var(--neon-blue)] transition-all"
              title="Toggle Space Audio"
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
          </div>

          <div className="md:hidden flex items-center gap-4">
             <button 
               onClick={toggleAudio}
               className="p-2 rounded-full border border-gray-600 text-gray-400 hover:text-[var(--neon-blue)] hover:border-[var(--neon-blue)] transition-all"
             >
               {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
             </button>
             <button onClick={() => setIsMenuOpen(!isMenuOpen)}>
               {isMenuOpen ? <X /> : <Menu />}
             </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="fixed top-20 right-6 z-50 md:hidden w-48 glass-panel p-4 neon-border-blue"
          >
            {['home', 'dashboard', 'apidata', 'academy', 'ai', 'future'].map((tab) => (
              <button 
                key={tab} 
                className="block w-full text-left py-2 capitalize transition-all hover:neon-text-blue"
                onClick={() => { setActiveTab(tab); setIsMenuOpen(false); }}
              >
                {tab === 'academy' ? 'OrbitX Academy' : tab === 'future' ? 'Future Hub' : tab === 'apidata' ? 'API Hub' : tab}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <main className="pt-24 pb-12 px-6 relative z-10 max-w-7xl mx-auto">
        <Suspense fallback={<LoadingFallback />}>
          <AnimatePresence mode="wait">
            {activeTab === 'home' && <Home key="home" setActiveTab={setActiveTab} />}
            {activeTab === 'dashboard' && <Dashboard key="dashboard" />}
            {activeTab === 'apidata' && <APIHub key="apidata" />}
            {activeTab === 'ai' && (
            <Suspense key="ai" fallback={<LoadingFallback />}>
               <AISection user={user} />
            </Suspense>
          )}
            {activeTab === 'academy' && <YouTubeSection key="academy" />}
            {activeTab === 'future' && <FutureHub key="future" />}
            {activeTab === 'admin' && <AdminPanel key="admin" />}
            {activeTab === 'satbuilder' && <SatBuilder key="satbuilder" onExit={() => setActiveTab('home')} />}
          </AnimatePresence>
        </Suspense>
      </main>

      {/* Persistent AI Assistant */}
      <div className="fixed bottom-6 right-6 z-50">
        <motion.button 
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setActiveTab('ai')}
          className="flex items-center space-x-3 glass-panel p-3 px-5 neon-border-blue"
        >
          <div className="w-10 h-10 rounded-full border-2 border-[var(--neon-blue)] bg-blue-900 flex items-center justify-center">
            <Bot className="w-5 h-5 neon-text-blue" />
          </div>
          <div className="flex flex-col items-start leading-tight">
            <span className="text-xs font-bold neon-text-blue">AI COMMAND</span>
            <span className="text-sm">Mishra Assistant</span>
          </div>
          <MessageSquare className="w-5 h-5 ml-2" />
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
