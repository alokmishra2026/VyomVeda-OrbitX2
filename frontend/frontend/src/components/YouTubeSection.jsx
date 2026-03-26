import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Youtube, Search, Play, X, Loader, TrendingUp, BookOpen, Rocket, Star, ChevronRight } from 'lucide-react';

const API_KEY = import.meta.env.VITE_YOUTUBE_API_KEY;
const BASE_URL = 'https://www.googleapis.com/youtube/v3';

const CATEGORIES = [
  { label: 'Trending Space', query: 'space exploration 2024', icon: <TrendingUp className="w-4 h-4" /> },
  { label: 'NASA Videos', query: 'NASA official', icon: <Rocket className="w-4 h-4" /> },
  { label: 'ISRO Missions', query: 'ISRO mission India space', icon: <Star className="w-4 h-4" /> },
  { label: 'Learn Astronomy', query: 'astronomy tutorial beginners', icon: <BookOpen className="w-4 h-4" /> },
  { label: 'Satellite Tech', query: 'satellite technology explained', icon: <Play className="w-4 h-4" /> },
  { label: 'Mars & Moon', query: 'Mars mission Moon 2024', icon: <Rocket className="w-4 h-4" /> },
];

const NO_API_FALLBACK = [
  { id: { videoId: 'zavAijqxDKA' }, snippet: { title: "Perseverance Rover's First 360° View of Mars", channelTitle: 'NASA JPL', publishedAt: '2021-02-24', thumbnails: { high: { url: 'https://img.youtube.com/vi/zavAijqxDKA/hqdefault.jpg' } } } },
  { id: { videoId: 'n3yDSqblIaQ' }, snippet: { title: "Earth From Space — ISS 4K Time-Lapse", channelTitle: 'NASA', publishedAt: '2018-01-01', thumbnails: { high: { url: 'https://img.youtube.com/vi/n3yDSqblIaQ/hqdefault.jpg' } } } },
  { id: { videoId: 'BzNzgsAE4F0' }, snippet: { title: "Living on the International Space Station", channelTitle: 'ESA', publishedAt: '2019-06-01', thumbnails: { high: { url: 'https://img.youtube.com/vi/BzNzgsAE4F0/hqdefault.jpg' } } } },
  { id: { videoId: 'IOTiRpFe1aM' }, snippet: { title: "How Satellites Work — Full Explanation", channelTitle: 'Kurzgesagt', publishedAt: '2020-03-01', thumbnails: { high: { url: 'https://img.youtube.com/vi/IOTiRpFe1aM/hqdefault.jpg' } } } },
  { id: { videoId: 'KNKXRo_7FJY' }, snippet: { title: "Chandrayaan-3 Moon Landing - ISRO Historic Mission", channelTitle: 'ISRO', publishedAt: '2023-08-23', thumbnails: { high: { url: 'https://img.youtube.com/vi/KNKXRo_7FJY/hqdefault.jpg' } } } },
  { id: { videoId: 'tBXPMnvRkxQ' }, snippet: { title: "SpaceX Falcon 9 Booster Landing — 4K", channelTitle: 'SpaceX', publishedAt: '2022-01-01', thumbnails: { high: { url: 'https://img.youtube.com/vi/tBXPMnvRkxQ/hqdefault.jpg' } } } },
];

const YouTubeSection = () => {
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [playingVideo, setPlayingVideo] = useState(null);
  const [activeCategory, setActiveCategory] = useState(CATEGORIES[0].label);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [nextPageToken, setNextPageToken] = useState(null);
  const searchRef = useRef(null);

  const isValidApiKey = API_KEY && API_KEY !== 'AIzaSyD_your_key_here' && API_KEY.startsWith('AIza');

  useEffect(() => {
    setHasApiKey(isValidApiKey);
    if (isValidApiKey) {
      fetchVideos(CATEGORIES[0].query);
    } else {
      setVideos(NO_API_FALLBACK);
    }
  }, []);

  const fetchVideos = async (query, pageToken = '') => {
    if (!isValidApiKey) { setVideos(NO_API_FALLBACK); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams({
        part: 'snippet',
        q: query,
        type: 'video',
        maxResults: 12,
        key: API_KEY,
        videoEmbeddable: 'true',
        ...(pageToken && { pageToken }),
      });
      const res = await fetch(`${BASE_URL}/search?${params}`);
      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      setVideos(pageToken ? prev => [...prev, ...(data.items || [])] : (data.items || []));
      setNextPageToken(data.nextPageToken || null);
    } catch (err) {
      console.error('YouTube API error:', err);
      setVideos(NO_API_FALLBACK);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchInput.trim()) return;
    setSearch(searchInput);
    setActiveCategory('');
    fetchVideos(searchInput);
  };

  const handleCategory = (cat) => {
    setActiveCategory(cat.label);
    setSearch('');
    setSearchInput('');
    fetchVideos(cat.query);
  };

  const getVideoId = (video) => video?.id?.videoId || video?.id || '';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6 pb-20"
    >
      {/* Header + Search */}
      <div className="glass-panel p-6 neon-border-blue flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-3 flex-shrink-0">
          <Youtube className="w-10 h-10 text-red-500" />
          <div>
            <h2 className="text-2xl font-bold tracking-widest uppercase">OrbitX Academy</h2>
            <p className="text-[10px] text-gray-400 tracking-widest uppercase">Real YouTube — Search Anything</p>
          </div>
        </div>

        <form onSubmit={handleSearch} className="flex-1 w-full flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              ref={searchRef}
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search karo — koi bhi YouTube video..."
              className="w-full bg-black/50 border border-gray-700 rounded-xl py-3 pl-12 pr-4 text-white placeholder-gray-600 focus:outline-none focus:border-[var(--neon-blue)] transition-all font-mono text-sm"
            />
          </div>
          <button type="submit" className="px-6 py-3 bg-red-600 hover:bg-red-500 rounded-xl font-bold text-white text-sm transition-all flex items-center gap-2">
            <Search className="w-4 h-4" /> Search
          </button>
        </form>
      </div>

      {/* API Key Notice */}
      {!hasApiKey && (
        <div className="glass-panel p-4 border border-yellow-500/40 bg-yellow-500/5 flex items-start gap-3">
          <span className="text-yellow-400 text-xl">⚠️</span>
          <div className="text-sm">
            <p className="text-yellow-300 font-bold mb-1">YouTube API Key Chahiye — Real Search Ke Liye</p>
            <p className="text-gray-400 text-xs">
              Abhi preloaded space videos dikh rahe hain. Real YouTube search ke liye:
              <span className="text-[var(--neon-blue)] font-bold mx-1">frontend/.env</span> mein
              <span className="font-mono bg-black/50 px-1 rounded mx-1">VITE_YOUTUBE_API_KEY=your_key</span> add karo.
              Free key milti hai: <a href="https://console.cloud.google.com" target="_blank" rel="noreferrer" className="text-blue-400 hover:underline">console.cloud.google.com</a>
            </p>
          </div>
        </div>
      )}

      {/* Video Player */}
      <AnimatePresence>
        {playingVideo && (
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="glass-panel neon-border-blue overflow-hidden"
          >
            <div className="flex justify-between items-center p-4 bg-black/60 border-b border-white/5">
              <h3 className="font-bold text-base flex items-center gap-2 truncate pr-4">
                <Youtube className="w-5 h-5 text-red-500 flex-shrink-0" />
                <span className="truncate">{playingVideo.snippet?.title}</span>
              </h3>
              <button onClick={() => setPlayingVideo(null)} className="p-2 hover:bg-red-500/20 text-red-400 rounded-full transition-all flex-shrink-0">
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="aspect-video w-full bg-black">
              <iframe
                className="w-full h-full"
                src={`https://www.youtube-nocookie.com/embed/${getVideoId(playingVideo)}?rel=0&modestbranding=1&controls=1`}
                title={playingVideo.snippet?.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
              />
            </div>
            <div className="p-3 bg-black/40 text-xs text-gray-400 flex items-center gap-2">
              <span className="font-bold text-[var(--neon-blue)]">{playingVideo.snippet?.channelTitle}</span>
              <span>•</span>
              <span>{new Date(playingVideo.snippet?.publishedAt).toLocaleDateString()}</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Category Chips */}
      <div className="flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.label}
            onClick={() => handleCategory(cat)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all border ${
              activeCategory === cat.label
                ? 'bg-[var(--neon-blue)]/20 border-[var(--neon-blue)] text-[var(--neon-blue)]'
                : 'border-white/10 text-gray-400 hover:border-white/30 hover:text-white'
            }`}
          >
            {cat.icon} {cat.label}
          </button>
        ))}
      </div>

      {/* Video Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader className="w-8 h-8 animate-spin text-[var(--neon-blue)]" />
          <span className="ml-3 text-gray-400 font-mono">YouTube se load ho raha hai...</span>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {videos.map((video, idx) => {
              const videoId = getVideoId(video);
              const thumb = video.snippet?.thumbnails?.high?.url || video.snippet?.thumbnails?.medium?.url || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
              return (
                <motion.div
                  key={`${videoId}-${idx}`}
                  whileHover={{ y: -4, scale: 1.02 }}
                  onClick={() => setPlayingVideo(video)}
                  className="glass-panel group overflow-hidden border-white/5 hover:border-red-500/50 transition-all cursor-pointer"
                >
                  <div className="relative aspect-video bg-black overflow-hidden">
                    <img
                      src={thumb}
                      alt={video.snippet?.title}
                      className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-all"
                      onError={(e) => { e.target.src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`; }}
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-14 h-14 rounded-full bg-red-600/80 flex items-center justify-center group-hover:scale-110 group-hover:bg-red-600 transition-all shadow-[0_0_20px_rgba(255,0,0,0.5)]">
                        <Play className="w-7 h-7 text-white ml-1" />
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 bg-red-600 text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase">
                      YouTube
                    </div>
                  </div>
                  <div className="p-3 bg-gradient-to-b from-black/60 to-black">
                    <h3 className="font-bold text-sm text-white group-hover:text-red-400 transition-colors line-clamp-2 mb-1">{video.snippet?.title}</h3>
                    <div className="flex justify-between text-[10px] text-gray-500 font-bold uppercase tracking-tight">
                      <span className="text-gray-300">{video.snippet?.channelTitle}</span>
                      <span>{new Date(video.snippet?.publishedAt).getFullYear()}</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* Load More */}
          {nextPageToken && hasApiKey && (
            <div className="flex justify-center mt-4">
              <button
                onClick={() => fetchVideos(search || CATEGORIES.find(c => c.label === activeCategory)?.query || 'space', nextPageToken)}
                className="flex items-center gap-2 px-8 py-3 glass-panel neon-border-blue text-sm font-bold hover:bg-[var(--neon-blue)]/10 transition-all"
              >
                <ChevronRight className="w-4 h-4" /> Aur Videos Load Karo
              </button>
            </div>
          )}
        </>
      )}
    </motion.div>
  );
};

export default YouTubeSection;
