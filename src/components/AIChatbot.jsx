import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiChatAlt2, HiX, HiPaperAirplane, HiSparkles, HiLocationMarker, HiArrowRight } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import API from '../api/axios';
import { getImageUrl } from '../utils/helpers';

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: 'Hi! I am your Flat Finder AI assistant. How can I help you find your dream home today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [isQuotaExceeded, setIsQuotaExceeded] = useState(false);
  const scrollRef = useRef(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await API.post('/ai/chat', {
        message: input,
        history: messages.map(m => ({
          role: m.role,
          content: m.content
        })).slice(-5)
      });

      const responseData = res.data.data;
      setIsQuotaExceeded(responseData.isQuotaExceeded || false);
      
      const newAssistantMessage = { 
        role: 'assistant', 
        content: typeof responseData === 'string' ? responseData : responseData.text,
        properties: responseData.properties || []
      };
      
      setMessages(prev => [...prev, newAssistantMessage]);
    } catch (err) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, I am having trouble connecting. Please try again later.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-[500]">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            className="absolute bottom-20 right-0 w-[350px] sm:w-[400px] h-[550px] bg-[#030712]/95 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] shadow-2xl flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-6 bg-indigo-600/10 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
                  <HiSparkles size={20} />
                </div>
                <div>
                  <h3 className="text-white font-black text-sm uppercase tracking-wider">Flat Finder AI</h3>
                  <div className="flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Always Online</span>
                  </div>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                <HiX size={24} />
              </button>
            </div>

            {/* Messages */}
            <div 
              ref={scrollRef}
              className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar scroll-smooth"
            >
              {isQuotaExceeded && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-3 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-3 mb-2"
                >
                  <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                  <p className="text-[10px] font-black text-amber-400 uppercase tracking-widest">
                    AI Limit Reached - Using Local Precision Engine
                  </p>
                </motion.div>
              )}
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: m.role === 'user' ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div className="flex flex-col gap-3 max-w-[85%]">
                    <div className={`p-4 rounded-2xl text-sm font-medium ${
                      m.role === 'user' 
                        ? 'bg-indigo-600 text-white rounded-tr-none shadow-lg shadow-indigo-500/10' 
                        : 'bg-white/10 text-slate-200 rounded-tl-none border border-white/5 backdrop-blur-md'
                    }`}>
                      {m.content}
                    </div>

                    {/* Rich Property Cards List */}
                    {m.properties && m.properties.length > 0 && (
                      <div className="flex gap-3 overflow-x-auto pb-2 custom-scrollbar -mx-2 px-2 snap-x">
                        {m.properties.map((prop) => (
                          <motion.div
                            key={prop._id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="flex-shrink-0 w-[200px] bg-white/5 border border-white/10 rounded-2xl overflow-hidden snap-start hover:border-indigo-500/50 transition-colors"
                          >
                            <img 
                              src={getImageUrl(prop.images?.[0])} 
                              alt={prop.title}
                              className="w-full h-24 object-cover"
                            />
                            <div className="p-3">
                              <h4 className="text-white text-xs font-bold truncate mb-1">{prop.title}</h4>
                              <p className="text-indigo-400 text-xs font-black mb-2">₹{prop.price.toLocaleString()}</p>
                              <Link 
                                to={`/property/${prop._id}`}
                                className="flex items-center justify-between w-full py-1.5 px-3 bg-indigo-600/20 border border-indigo-500/30 rounded-lg text-indigo-400 text-[10px] font-bold hover:bg-indigo-600 hover:text-white transition-all group"
                              >
                                View Details
                                <HiArrowRight className="group-hover:translate-x-1 transition-transform" />
                              </Link>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
              
              {/* Quick Actions */}
              {messages.length === 1 && (
                <div className="flex flex-wrap gap-2 mt-4">
                  {[
                    { icon: <HiSparkles />, label: 'Recommend Properties', msg: 'Can you recommend some properties for me?' },
                    { icon: <HiLocationMarker />, label: 'Market Insights', msg: 'What is the current market trend?' },
                    { icon: <HiChatAlt2 />, label: 'PGs in Mumbai', msg: 'Help me find PGs in Mumbai.' }
                  ].map((action, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setInput(action.msg);
                        setTimeout(() => {
                          const syntheticEvent = { preventDefault: () => {} };
                          setInput(action.msg);
                          // We use a small timeout to ensure state update before triggering send
                          setTimeout(() => {
                            handleSend(syntheticEvent);
                          }, 0);
                        }, 0);
                      }}
                      className="px-3 py-1.5 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold hover:bg-indigo-600/20 transition-all flex items-center gap-1.5"
                    >
                      {action.icon}
                      {action.label}
                    </button>
                  ))}
                </div>
              )}
              
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white/5 border border-white/10 text-slate-300 p-4 rounded-3xl rounded-tl-none flex gap-1">
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-100"></span>
                    <span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-bounce delay-200"></span>
                  </div>
                </div>
              )}
            </div>

            {/* Input */}
            <form onSubmit={handleSend} className="p-6 bg-white/5 border-t border-white/10">
              <div className="relative">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask about properties, areas..."
                  className="w-full pl-6 pr-14 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium placeholder-slate-700"
                />
                <button 
                  type="submit"
                  disabled={loading || !input.trim()}
                  className="absolute right-2 top-2 w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center hover:bg-indigo-500 transition-all active:scale-90 disabled:opacity-50"
                >
                  <HiPaperAirplane className="rotate-90" />
                </button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FAB */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="w-16 h-16 bg-white text-[#030712] rounded-[1.5rem] shadow-2xl flex items-center justify-center group relative overflow-hidden"
      >
        <div className="absolute inset-0 bg-indigo-600 translate-y-16 group-hover:translate-y-0 transition-transform duration-300"></div>
        <div className="relative z-10">
          {isOpen ? <HiX size={28} className="group-hover:text-white transition-colors" /> : <HiChatAlt2 size={28} className="group-hover:text-white transition-colors" />}
        </div>
      </motion.button>
    </div>
  );
};

export default AIChatbot;
