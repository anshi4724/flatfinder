import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useProperty } from '../../context/PropertyContext';
import { motion } from 'framer-motion';
import { HiSearch, HiLocationMarker, HiArrowRight, HiShieldCheck, HiOutlineSparkles, HiChevronDown } from 'react-icons/hi';

const HeroSection = () => {
  const { selectedCity, selectedType, setIsLocationModalOpen } = useProperty();
  const [searchQuery, setSearchQuery] = useState(selectedCity || '');
  const navigate = useNavigate();

  useEffect(() => {
    setSearchQuery(selectedCity || '');
  }, [selectedCity]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden w-full bg-gradient-to-br from-gray-50 via-white to-indigo-50">
      {/* Dynamic Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200/30 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-purple-300/20 rounded-full blur-[140px]" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full opacity-[0.02]" 
             style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, #6366f1 1px, transparent 0)', backgroundSize: '48px 48px' }}></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
        <div className="grid lg:grid-cols-2 gap-16 items-center text-center lg:text-left">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
          >
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-sm font-semibold mb-8"
            >
              <HiOutlineSparkles className="text-indigo-600" />
              <span>Premium Property Marketplace</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight">
              Smarter Way to <br />
              Find Perfect <br />
              Home
            </h1>

            <p className="text-lg sm:text-xl text-slate-600 mb-12 max-w-xl mx-auto lg:mx-0 leading-relaxed">
              Leverage AI-powered insights to discover the best properties that match your lifestyle and budget.
            </p>

            <div className="mb-12">
              <Link
                to="/explore"
                className="group inline-flex items-center gap-3 bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-1"
              >
                Explore Now
                <HiArrowRight className="text-xl group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="flex flex-wrap gap-4 justify-center lg:justify-start mb-12">
            </div>
          </motion.div>

          {/* Search Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 1, ease: "circOut" }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-purple-600/10 blur-3xl -z-10"></div>
            
            <div className="bg-white/80 backdrop-blur-xl border border-slate-200 rounded-3xl p-8 sm:p-12 shadow-2xl shadow-slate-900/10">
              <h3 className="text-2xl font-bold text-slate-900 mb-8 text-left">Start your journey</h3>
              
              <form onSubmit={handleSearch} className="space-y-6">
                <div className="space-y-4">
                  <div className="group relative">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-widest ml-1 mb-2 block text-left">Location & Area</label>
                    <div className="relative flex items-center bg-slate-50 border border-slate-200 rounded-2xl p-4 focus-within:border-indigo-500 focus-within:bg-white transition-all duration-300">
                      <HiLocationMarker className="text-indigo-600 text-2xl mr-4" />
                      <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Where do you want to live?"
                        className="bg-transparent text-slate-900 placeholder-slate-500 outline-none w-full text-lg font-medium"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div 
                    onClick={() => setIsLocationModalOpen(true)}
                    className="bg-slate-50 border border-slate-200 rounded-2xl p-5 cursor-pointer hover:bg-white hover:border-indigo-300 hover:shadow-md transition-all flex items-center justify-between group/card"
                  >
                     <div className="text-left">
                       <div className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-1">Property Categories</div>
                       <div className="text-slate-900 font-bold text-lg">
                         {selectedType && selectedType.length > 0 ? selectedType.join(', ') : 'All Types'}
                       </div>
                     </div>
                     <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center group-hover/card:bg-indigo-600 group-hover/card:border-indigo-600 transition-colors">
                       <HiChevronDown className="text-indigo-600 group-hover/card:text-white transition-colors" />
                     </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full group relative overflow-hidden bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-indigo-700 hover:shadow-xl hover:shadow-indigo-500/25 hover:-translate-y-1 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
                >
                  <HiSearch className="text-2xl" />
                  Search Now
                  <HiArrowRight className="group-hover:translate-x-2 transition-transform" />
                </button>
              </form>

              <div className="mt-8 flex items-center justify-between text-slate-500 text-xs font-bold">
                <div className="flex items-center gap-2">
                  <HiShieldCheck className="text-emerald-500 text-base" />
                  <span>100% VERIFIED</span>
                </div>
                <div>SECURE PAYMENTS</div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
