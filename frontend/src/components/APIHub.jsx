import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Globe, Image as ImageIcon, Activity, Map, Orbit, Info } from 'lucide-react';

const APIHub = () => {
  const [issData, setIssData] = useState(null);
  const [apodData, setApodData] = useState(null);
  const [loadingApod, setLoadingApod] = useState(true);

  // Fetch ISS Data
  useEffect(() => {
    const fetchISS = async () => {
      try {
        const res = await fetch('https://api.wheretheiss.at/v1/satellites/25544');
        const data = await res.json();
        setIssData(data);
      } catch (err) {
        console.error('Failed to fetch ISS data', err);
      }
    };
    fetchISS();
    const interval = setInterval(fetchISS, 2000);
    return () => clearInterval(interval);
  }, []);

  // Fetch NASA APOD
  useEffect(() => {
    const fetchAPOD = async () => {
      try {
        const res = await fetch('https://api.nasa.gov/planetary/apod?api_key=DEMO_KEY');
        const data = await res.json();
        setApodData(data);
        setLoadingApod(false);
      } catch (err) {
        console.error('Failed to fetch APOD', err);
        setLoadingApod(false);
      }
    };
    fetchAPOD();
  }, []);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -30 }}
      className="space-y-12 pb-20"
    >
      <div className="text-center space-y-4">
        <h1 className="text-4xl md:text-6xl font-bold italic tracking-tighter">
          GLOBAL <span className="neon-text-blue">API HUB</span>
        </h1>
        <p className="text-gray-400 max-w-2xl mx-auto uppercase tracking-widest text-xs font-bold">
          Live connections to NASA and International Space Station databases.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* ISS Live Tracking Panel */}
        <div className="glass-panel p-8 border-blue-500/30 flex flex-col justify-between relative overflow-hidden group min-h-[400px]">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-all">
             <Orbit size={180} />
          </div>
          
          <div className="relative z-10 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center border border-blue-500/20">
                  <Globe className="text-blue-400 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-widest text-blue-400">ISS Live Feed</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <Activity className="w-3 h-3 text-green-400" /> Active Connection
                  </p>
                </div>
              </div>
            </div>

            {issData ? (
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Velocity</span>
                  <span className="text-xl font-mono text-white">{Math.round(issData.velocity)} km/h</span>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Altitude</span>
                  <span className="text-xl font-mono text-white">{Math.round(issData.altitude)} km</span>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Latitude</span>
                  <span className="text-xl font-mono text-blue-400">{issData.latitude.toFixed(4)}</span>
                </div>
                <div className="bg-black/40 p-4 rounded-xl border border-white/5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block mb-1">Longitude</span>
                  <span className="text-xl font-mono text-blue-400">{issData.longitude.toFixed(4)}</span>
                </div>
              </div>
            ) : (
              <div className="text-gray-400 animate-pulse text-sm">Establishing uplink...</div>
            )}
            
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-xl mt-4">
               <p className="text-xs text-blue-400 flex items-center gap-2">
                 <Map className="w-4 h-4" /> Data streams directly from whereistheiss.at REST API
               </p>
            </div>
          </div>
        </div>

        {/* NASA APOD Panel */}
        <div className="glass-panel p-8 border-purple-500/30 flex flex-col justify-between relative overflow-hidden group min-h-[400px]">
          <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-20 transition-all">
             <ImageIcon size={180} />
          </div>
          
          <div className="relative z-10 h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20">
                  <ImageIcon className="text-purple-400 w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-xl font-bold uppercase tracking-widest text-purple-400">NASA APOD</h3>
                  <p className="text-xs text-gray-400 uppercase tracking-widest">Astronomy Picture Of The Day</p>
                </div>
              </div>
            </div>

            {loadingApod ? (
               <div className="text-gray-400 animate-pulse flex-1 flex items-center justify-center border border-white/10 rounded-xl border-dashed">
                 Fetching deep space imaging...
               </div>
            ) : apodData ? (
              <div className="flex-1 space-y-4">
                 <div className="rounded-xl overflow-hidden border border-white/10 relative group-hover:border-purple-500/50 transition-all">
                   <img src={apodData.url} alt={apodData.title} className="w-full h-48 object-cover" />
                   <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/90 to-transparent p-4">
                     <p className="text-sm font-bold text-white uppercase">{apodData.title}</p>
                   </div>
                 </div>
                 <div className="h-32 overflow-y-auto pr-2 custom-scrollbar">
                   <p className="text-xs text-gray-400 leading-relaxed text-justify">
                     {apodData.explanation}
                   </p>
                 </div>
              </div>
            ) : (
               <div className="text-red-400 text-sm">Signal lost. Cannot retrieve NASA APOD.</div>
            )}
          </div>
        </div>

      </div>
    </motion.div>
  );
};

export default APIHub;
