import { useState, useEffect } from 'react';
import { HiSearch, HiFilter, HiX, HiAdjustments } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';

const propertyTypes = ['1BHK', '2BHK', '3BHK', 'PG', 'Studio', 'Villa'];
const sortOptions = [
  { value: 'latest', label: 'Latest First' },
  { value: 'oldest', label: 'Oldest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
];

const SearchFilters = ({ onFilter, initialSearch = '' }) => {
  const [search, setSearch] = useState(initialSearch);
  const [city, setCity] = useState('');
  const [type, setType] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sort, setSort] = useState('latest');
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onFilter({ search, city, type, minPrice, maxPrice, sort });
  };

  const handleReset = () => {
    setSearch('');
    setCity('');
    setType('');
    setMinPrice('');
    setMaxPrice('');
    setSort('latest');
    onFilter({});
  };

  const hasActiveFilters = city || type || minPrice || maxPrice || sort !== 'latest';

  return (
    <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 mt-8 shadow-2xl overflow-hidden">
      {/* Search bar */}
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1 group">
            <HiSearch className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-500 text-2xl group-focus-within:text-indigo-500 transition-colors" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Locality, City or Building..."
              className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-[1.5rem] text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/[0.08] transition-all font-medium text-lg"
            />
          </div>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center gap-3 px-6 py-5 rounded-[1.5rem] border font-black text-sm tracking-widest uppercase transition-all cursor-pointer ${
                showFilters || hasActiveFilters
                  ? 'bg-indigo-600 border-indigo-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)]'
                  : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <HiAdjustments className="text-xl" />
              <span>Filters</span>
              {hasActiveFilters && (
                <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse"></span>
              )}
            </button>
            <button
              type="submit"
              className="px-10 py-5 bg-white text-[#030712] rounded-[1.5rem] font-black tracking-widest uppercase hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1 transition-all cursor-pointer"
            >
              Search
            </button>
          </div>
        </div>
      </form>

      {/* Expandable filters */}
      <AnimatePresence>
        {showFilters && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="border-t border-white/5 pt-8 mt-8 space-y-8">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* City */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">City</label>
                  <div className="relative">
                     <input
                       type="text"
                       value={city}
                       onChange={(e) => setCity(e.target.value)}
                       placeholder="e.g. Mumbai"
                       className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                     />
                  </div>
                </div>

                {/* Property Type */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Type</label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold appearance-none cursor-pointer"
                  >
                    <option value="" className="bg-[#030712]">All Types</option>
                    {propertyTypes.map((t) => (
                      <option key={t} value={t} className="bg-[#030712]">{t}</option>
                    ))}
                  </select>
                </div>

                {/* Min Price */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Min Price</label>
                  <input
                    type="number"
                    value={minPrice}
                    onChange={(e) => setMinPrice(e.target.value)}
                    placeholder="Min ₹"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                  />
                </div>

                {/* Max Price */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.2em] ml-1">Max Price</label>
                  <input
                    type="number"
                    value={maxPrice}
                    onChange={(e) => setMaxPrice(e.target.value)}
                    placeholder="Max ₹"
                    className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                  />
                </div>
              </div>

              {/* Sort & Reset */}
              <div className="flex flex-wrap items-center justify-between pt-8 border-t border-white/5 gap-4">
                <div className="flex items-center gap-6">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-widest">Sort by:</span>
                  <div className="flex gap-2">
                     {sortOptions.map((opt) => (
                        <button
                          key={opt.value}
                          onClick={() => setSort(opt.value)}
                          className={`px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer border ${
                            sort === opt.value 
                              ? 'bg-indigo-500/20 border-indigo-500 text-indigo-400' 
                              : 'bg-white/5 border-white/5 text-slate-500 hover:text-white'
                          }`}
                        >
                          {opt.label}
                        </button>
                     ))}
                  </div>
                </div>

                {hasActiveFilters && (
                  <button
                    onClick={handleReset}
                    className="flex items-center gap-2 text-xs font-black text-red-400 hover:text-red-300 transition cursor-pointer uppercase tracking-[0.2em]"
                  >
                    <HiX className="text-lg" />
                    Reset All
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SearchFilters;

