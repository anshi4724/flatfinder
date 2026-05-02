import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { HiSparkles, HiLocationMarker } from 'react-icons/hi';
import { getImageUrl } from '../utils/helpers';

const Recommendations = () => {
  const { user, token } = useAuth();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasRequested, setHasRequested] = useState(false);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);

  const [searchQuery, setSearchQuery] = useState('');

  const fetchRecommendations = async (e) => {
    if (e) e.preventDefault();
    if (!user) return;
    setHasRequested(true);
    setLoading(true);
    try {
      const res = await API.get(`/ai/recommendations?query=${encodeURIComponent(searchQuery)}`);
      if (res.data && Array.isArray(res.data.data)) {
        setRecommendations(res.data.data);
        setIsQuotaExceeded(res.data.isQuotaExceeded || false);
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      console.error('Failed to fetch recommendations');
      setRecommendations([]);
    }
    setLoading(false);
  };

  if (!user) return null;

  return (
    <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#030712]">
      <div className="max-w-7xl mx-auto">
        {!hasRequested ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="p-12 rounded-[3.5rem] bg-gradient-to-br from-indigo-600/10 via-violet-600/10 to-fuchsia-600/10 border border-white/10 text-center relative overflow-hidden group"
          >
            {/* Animated Glow Background */}
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-indigo-500/20 blur-[100px] group-hover:bg-indigo-500/30 transition-all duration-700" />
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-fuchsia-500/20 blur-[100px] group-hover:bg-fuchsia-500/30 transition-all duration-700" />

            <div className="relative z-10">
              <div className="inline-flex p-4 rounded-3xl bg-white/5 border border-white/10 text-indigo-400 mb-8 items-center justify-center">
                <HiSparkles className="text-4xl animate-pulse" />
              </div>
              <h2 className="text-4xl sm:text-5xl font-black text-white mb-6 tracking-tighter">
                What are you <span className="bg-gradient-to-r from-indigo-400 to-fuchsia-400 bg-clip-text text-transparent italic">looking for?</span>
              </h2>
              <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-12 font-medium">
                Type your dream property details below, and our AI will find the perfect matches based on your unique preferences.
              </p>
              
              <form onSubmit={fetchRecommendations} className="max-w-2xl mx-auto flex flex-col sm:flex-row gap-4">
                <div className="flex-1 relative group/input">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="e.g. Quiet 2BHK in Pune with a mountain view..."
                    className="w-full px-8 py-6 bg-white/5 border-2 border-white/10 rounded-[2rem] text-white focus:outline-none focus:border-indigo-500/50 transition-all text-lg placeholder:text-slate-600 backdrop-blur-md"
                  />
                  <div className="absolute inset-0 rounded-[2rem] bg-indigo-500/5 opacity-0 group-hover/input:opacity-100 transition-opacity pointer-events-none" />
                </div>
                <button
                  type="submit"
                  disabled={!searchQuery.trim()}
                  className="px-10 py-6 bg-white text-[#030712] rounded-[2rem] font-black text-xl hover:shadow-[0_0_40px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:hover:translate-y-0 transition-all flex items-center justify-center gap-3 whitespace-nowrap shadow-2xl"
                >
                  Find Matches
                  <HiSparkles className="text-indigo-600" />
                </button>
              </form>
            </div>
          </motion.div>
        ) : (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-[1.5rem] bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.1)]">
                  <HiSparkles size={28} className="animate-pulse" />
                </div>
                <div>
                  <h2 className="text-4xl font-black text-white italic tracking-tighter leading-none mb-2">
                    {searchQuery ? (
                      <>Results for <span className="text-indigo-500 underline decoration-indigo-500/30">"{searchQuery}"</span></>
                    ) : (
                      <>AI <span className="text-indigo-500 underline decoration-indigo-500/30">Picks</span> For You</>
                    )}
                  </h2>
                  <p className="text-indigo-400/60 text-[10px] font-black uppercase tracking-[0.3em]">
                    {searchQuery ? 'Highly relevant matches found' : 'Smarter matches based on your interest'}
                  </p>
                </div>
              </div>

              {isQuotaExceeded && (
                <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none">AI Quota Exceeded — Using Local Engine</span>
                </div>
              )}
              
              <button
                onClick={() => {
                  setHasRequested(false);
                  setSearchQuery('');
                }}
                className="self-start sm:self-center px-6 py-3 rounded-2xl bg-white/5 border border-white/10 text-white text-xs font-black uppercase tracking-widest hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-2 group"
              >
                Search Again
                <HiSparkles className="group-hover:rotate-12 transition-transform" />
              </button>
            </div>

            {loading ? (
              <div className="flex gap-8 overflow-x-auto pb-10 custom-scrollbar">
                {[1, 2, 3, 4].map(n => (
                  <div key={n} className="w-80 h-64 bg-white/5 animate-pulse rounded-[2.5rem] shrink-0 border border-white/5" />
                ))}
              </div>
            ) : recommendations.length === 0 ? (
              <div className="p-20 rounded-[3.5rem] bg-white/5 border border-white/10 text-center backdrop-blur-3xl">
                <p className="text-slate-400 text-xl font-medium italic mb-6">No exact matches for <span className="text-white">"{searchQuery}"</span></p>
                <button
                  onClick={() => setHasRequested(false)}
                  className="px-8 py-4 bg-indigo-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-indigo-500 transition-all shadow-xl shadow-indigo-600/20"
                >
                  Try Different Keywords
                </button>
              </div>
            ) : (
              <div className="flex gap-8 overflow-x-auto pb-12 custom-scrollbar snap-x">
                {recommendations.map((prop, i) => (
                  <motion.div
                    key={prop._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1, type: 'spring', stiffness: 50 }}
                    className="w-85 shrink-0 group relative snap-start"
                  >
                    <Link to={`/property/${prop._id}`}>
                      <div className="relative aspect-[4/5] rounded-[3rem] overflow-hidden border border-white/10 group-hover:border-indigo-500/50 transition-all duration-700 shadow-2xl">
                        <img 
                          src={getImageUrl(prop.images?.[0])} 
                          alt={prop.title} 
                          className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#030712] via-[#030712]/20 to-transparent opacity-90 group-hover:via-[#030712]/40 transition-all" />
                        
                        <div className="absolute top-8 left-8 flex items-center gap-2">
                          <div className="px-5 py-2 rounded-full bg-indigo-600 text-white text-[10px] font-black tracking-[0.2em] uppercase shadow-2xl">
                            {searchQuery ? 'EXACT MATCH' : 'AI CHOICE'}
                          </div>
                        </div>

                        <div className="absolute bottom-10 left-10 right-10 transform group-hover:-translate-y-2 transition-transform duration-500">
                          <h4 className="text-white font-black text-3xl line-clamp-2 mb-4 tracking-tighter leading-[0.9] group-hover:text-indigo-400 transition-colors uppercase italic">{prop.title}</h4>
                          <div className="flex items-center gap-2 text-slate-300 font-bold text-sm tracking-tight opacity-70">
                            <HiLocationMarker className="text-indigo-500 text-lg" />
                            <span className="truncate">{prop.location?.area}, {prop.location?.city}</span>
                          </div>
                        </div>
                        
                        <div className="absolute top-8 right-8 px-5 py-3 rounded-[1.5rem] bg-white/10 backdrop-blur-xl text-indigo-400 text-lg font-black italic shadow-2xl border border-white/5 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                          ₹{prop.price.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </Link>
                  </motion.div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default Recommendations;
