import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useProperty } from '../../context/PropertyContext';
import Spinner from '../../components/ui/Spinner';
import { HiPlusCircle, HiPencilAlt, HiTrash, HiOutlineHome, HiUsers, HiStar, HiMail, HiPhone, HiChevronRight, HiCollection, HiX, HiArrowRight } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import { getImageUrl } from '../../utils/helpers';

const Dashboard = () => {
  const { myProperties, fetchMyProperties, deleteProperty, loading } = useProperty();
  const [deletingId, setDeletingId] = useState(null);
  const [selectedProperty, setSelectedProperty] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // 'list', 'details'

  useEffect(() => {
    fetchMyProperties();
  }, [fetchMyProperties]);

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this property? This action cannot be undone.')) {
      setDeletingId(id);
      await deleteProperty(id);
      setDeletingId(null);
      if (selectedProperty?._id === id) setViewMode('list');
    }
  };

  if (loading && !myProperties.length) {
    return (
      <div className="min-h-screen bg-[#030712] flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030712] pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[10px] font-black uppercase tracking-widest mb-2"
            >
              Management Portal
            </motion.div>
            <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
              Owner <span className="text-indigo-500">Dashboard</span>
            </h1>
            <p className="text-slate-400 mt-1 text-sm font-medium">Streamline your property workflow & tenant leads.</p>
          </div>
          
          <Link
            to="/dashboard/add-property"
            className="inline-flex items-center justify-center gap-2 px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white font-black rounded-xl shadow-lg shadow-indigo-500/20 hover:-translate-y-0.5 transition-all active:scale-95 cursor-pointer shrink-0 text-sm"
          >
            <HiPlusCircle className="text-xl" />
            <span className="whitespace-nowrap">Add New Property</span>
          </Link>
        </div>

        {(!myProperties || myProperties.length === 0) ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10 p-10 text-center"
          >
            <div className="w-16 h-16 rounded-xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
              <HiOutlineHome className="text-3xl text-indigo-500" />
            </div>
            <h3 className="text-xl font-black text-white mb-2">No Properties Listed</h3>
            <p className="text-slate-400 mb-6 max-w-md mx-auto font-medium text-sm">
              Your property portfolio is currently empty. Start by listing your first space to connect with seekers.
            </p>
            <Link
              to="/dashboard/add-property"
              className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 text-white font-black rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 cursor-pointer text-sm"
            >
              List Property <HiArrowRight />
            </Link>
          </motion.div>
        ) : (
          <div className="grid lg:grid-cols-12 gap-8">
            
            {/* Sidebar / List */}
            <div className={`lg:col-span-4 space-y-4 ${viewMode === 'details' ? 'hidden lg:block' : 'block'}`}>
              <div className="text-white/40 text-xs font-black uppercase tracking-widest mb-4 flex items-center gap-2">
                <HiCollection /> Your Listings ({myProperties.length})
              </div>
              {myProperties.map((property) => (
                <motion.div
                  key={property._id}
                  layoutId={property._id}
                  onClick={() => {
                    setSelectedProperty(property);
                    setViewMode('details');
                  }}
                  className={`group relative p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                    selectedProperty?._id === property._id 
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-lg' 
                      : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex gap-4">
                    <img 
                      src={getImageUrl(property.images?.[0])} 
                      alt="" 
                      className="w-20 h-20 rounded-2xl object-cover shrink-0"
                    />
                    <div className="overflow-hidden">
                      <h4 className="text-white font-black text-base truncate group-hover:text-indigo-400 transition-colors">{property.title}</h4>
                      <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{property.location?.city}</p>
                      <div className="mt-2 flex items-center gap-3">
                         <div className="flex items-center gap-1 text-emerald-400 text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-400/10 border border-emerald-400/20 uppercase">
                           Active
                         </div>
                         <div className="text-indigo-400 text-[10px] font-black uppercase tracking-widest">
                           {property.interestedUsers?.length || 0} Leads
                         </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Content Area */}
            <div className={`lg:col-span-8 ${viewMode === 'list' ? 'hidden lg:block' : 'block'}`}>
              <AnimatePresence mode="wait">
                {selectedProperty ? (
                  <motion.div
                    key={selectedProperty._id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="bg-white/5 backdrop-blur-3xl rounded-[1.5rem] border border-white/10 p-6 sm:p-8"
                  >
                    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-6 pb-6 border-b border-white/5">
                      <div className="text-center sm:text-left">
                         <h2 className="text-2xl font-black text-white mb-1">{selectedProperty.title}</h2>
                         <p className="text-slate-400 text-sm font-medium">Property leads & feedback.</p>
                      </div>
                      <div className="flex gap-2">
                         <Link 
                           to={`/dashboard/edit-property/${selectedProperty._id}`}
                           className="p-3 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-indigo-600 transition-all cursor-pointer"
                         >
                            <HiPencilAlt className="text-lg" />
                         </Link>
                         <button 
                           onClick={() => handleDelete(selectedProperty._id)}
                           className="p-3 rounded-xl bg-white/5 border border-white/10 text-red-400 hover:bg-red-600 hover:text-white transition-all cursor-pointer"
                         >
                            <HiTrash className="text-lg" />
                         </button>
                         <button 
                           onClick={() => setViewMode('list')}
                           className="lg:hidden p-3 rounded-xl bg-white/5 border border-white/10 text-slate-400 cursor-pointer"
                         >
                            <HiX />
                         </button>
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-8">
                      {/* Leads Section */}
                      <div className="space-y-6">
                         <div className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-widest">
                            <HiUsers className="text-indigo-400 text-xl" />
                            Interested Seekeers ({selectedProperty.interestedUsers?.length || 0})
                         </div>
                         <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                           {selectedProperty.interestedUsers && selectedProperty.interestedUsers.length > 0 ? (
                             selectedProperty.interestedUsers.map((user) => (
                               <div key={user._id} className="p-4 rounded-2xl bg-white/5 border border-white/5 hover:border-indigo-500/30 transition-all group">
                                  <div className="flex justify-between items-start mb-2">
                                     <div className="font-black text-white">{user.name}</div>
                                     <div className="text-[10px] font-black text-indigo-400 uppercase tracking-widest">Lead</div>
                                  </div>
                                  <div className="space-y-1">
                                     <div className="flex items-center gap-2 text-slate-400 text-xs">
                                        <HiMail className="text-indigo-500/50" />
                                        {user.email}
                                     </div>
                                     <div className="flex items-center gap-2 text-slate-400 text-xs text-left">
                                        <HiPhone className="text-indigo-500/50" />
                                        {user.phone || 'No phone provided'}
                                     </div>
                                  </div>
                               </div>
                             ))
                           ) : (
                             <div className="p-10 rounded-3xl border-2 border-dashed border-white/5 text-center">
                                <p className="text-slate-500 font-medium text-sm">No one has expressed interest yet.</p>
                             </div>
                           )}
                         </div>
                      </div>

                      {/* Reviews Section */}
                      <div className="space-y-6 text-left">
                         <div className="flex items-center gap-2 text-white font-black text-sm uppercase tracking-widest">
                            <HiStar className="text-amber-400 text-xl" />
                            Recent Reviews ({selectedProperty.reviews?.length || 0})
                         </div>
                         <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                           {selectedProperty.reviews && selectedProperty.reviews.length > 0 ? (
                             selectedProperty.reviews.map((review, i) => (
                               <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/5">
                                  <div className="flex justify-between items-center mb-2">
                                     <div className="font-bold text-white text-sm">{review.user?.name || 'Anonymous'}</div>
                                     <div className="flex gap-0.5">
                                        {[...Array(5)].map((_, star) => (
                                           <HiStar key={star} className={star < review.rating ? "text-amber-400" : "text-white/10"} />
                                        ))}
                                     </div>
                                  </div>
                                  <p className="text-slate-400 text-sm leading-relaxed">"{review.comment}"</p>
                                  <div className="mt-2 text-[10px] text-slate-600 font-bold uppercase tracking-widest">
                                     {new Date(review.createdAt).toLocaleDateString()}
                                  </div>
                               </div>
                             ))
                           ) : (
                             <div className="p-10 rounded-3xl border-2 border-dashed border-white/5 text-center">
                                <p className="text-slate-500 font-medium text-sm">No reviews posted yet.</p>
                             </div>
                           )}
                         </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex items-center justify-center">
                    <div className="text-center opacity-40">
                       <HiOutlineHome className="text-6xl mx-auto mb-4" />
                       <p className="font-black text-sm uppercase tracking-widest">Select a property to view leads</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
