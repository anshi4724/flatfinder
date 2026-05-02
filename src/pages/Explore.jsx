import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useProperty } from '../context/PropertyContext';
import PropertyGrid from '../components/property/PropertyGrid';
import SearchFilters from '../components/property/SearchFilters';
import { HiChevronLeft, HiChevronRight, HiOutlineSparkles } from 'react-icons/hi';
import { motion } from 'framer-motion';

const Explore = () => {
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const { properties, pagination, loading, fetchProperties } = useProperty();
  const [currentFilters, setCurrentFilters] = useState({ search: initialSearch });

  useEffect(() => {
    fetchProperties({ ...currentFilters, page: 1 });
  }, []);

  useEffect(() => {
    if (initialSearch) {
      setCurrentFilters({ search: initialSearch });
      fetchProperties({ search: initialSearch, page: 1 });
    }
  }, [initialSearch]);

  const handleFilter = (filters) => {
    setCurrentFilters(filters);
    fetchProperties({ ...filters, page: 1 });
  };

  const handlePageChange = (page) => {
    fetchProperties({ ...currentFilters, page });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#030712] text-white">
      {/* Header */}
      <div className="relative pt-32 pb-16 overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-[400px] h-[400px] bg-indigo-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 right-1/4 w-[300px] h-[300px] bg-fuchsia-600/5 rounded-full blur-[100px]"></div>
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-4">
              <HiOutlineSparkles className="animate-pulse" />
              Verified Inventory
            </div>
            <h1 className="text-4xl sm:text-6xl font-black text-white mb-4 tracking-tight">
              Explore <span className="text-indigo-500">Properties</span>
            </h1>
            <p className="text-slate-400 text-lg max-w-2xl font-medium">
              {pagination ? `${pagination.total.toLocaleString()} premium properties available for you.` : 'Discover thousands of local property listings.'}
            </p>
          </motion.div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        <SearchFilters onFilter={handleFilter} initialSearch={initialSearch} />

        <div className="mt-12">
           <PropertyGrid properties={properties} loading={loading} />
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <motion.div 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="flex items-center justify-center gap-3 mt-20"
          >
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={pagination.page <= 1}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xl"
            >
              <HiChevronLeft className="text-xl" />
            </button>

            <div className="flex items-center gap-2">
              {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`w-12 h-12 rounded-2xl font-black text-sm tracking-tight transition-all cursor-pointer ${
                    page === pagination.page
                      ? 'bg-white text-[#030712] shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                      : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
                  }`}
                >
                  {page}
                </button>
              ))}
            </div>

            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={pagination.page >= pagination.pages}
              className="p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed transition-all cursor-pointer shadow-xl"
            >
              <HiChevronRight className="text-xl" />
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Explore;

