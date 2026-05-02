import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useProperty } from '../context/PropertyContext';
import { useAuth } from '../context/AuthContext';
import Spinner from '../components/ui/Spinner';
import { HiLocationMarker, HiPhone, HiMail, HiOutlineBadgeCheck, HiChevronLeft, HiChevronRight, HiCalendar, HiHome, HiStar, HiHeart, HiOutlineHeart, HiChatAlt2, HiArrowLeft } from 'react-icons/hi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

import { getImageUrl } from '../utils/helpers';
import MapComponent from '../components/MapComponent';
import API from '../api/axios';

const PropertyDetails = () => {
  const { id } = useParams();
  const { fetchProperty, toggleInterest, addReview, loading } = useProperty();
  const { user, token, updateProfile } = useAuth(); // Added token from auth
  const navigate = useNavigate();
  const [property, setProperty] = useState(null);
  const [activeImage, setActiveImage] = useState(0);
  const [isInterested, setIsInterested] = useState(false);
  const [reviewData, setReviewData] = useState({ rating: 5, comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);
  const [showPhoneModal, setShowPhoneModal] = useState(false);
  const [tempPhone, setTempPhone] = useState('');
  const [updatingPhone, setUpdatingPhone] = useState(false);
  
  // AI and Location State
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [loadingAi, setLoadingAi] = useState(false);

  useEffect(() => {
    const loadProperty = async () => {
      const data = await fetchProperty(id);
      setProperty(data);
      if (data && user) {
        const currentUserId = user?._id || user?.id;
        setIsInterested(data.interestedUsers?.some(u => (u._id || u).toString() === currentUserId?.toString()));
        
        // Log view for AI recommendations
        try {
          await API.post(`/ai/log-view/${id}`);
        } catch (err) {
          console.error('Failed to log activity');
        }
      }
    };
    
    const fetchAiInsights = async () => {
      setLoadingAi(true);
      try {
        const res = await API.get(`/ai/analyze/${id}`);
        setAiAnalysis(res.data.data);
      } catch (err) {
        console.error('Failed to fetch AI analysis');
      }
      setLoadingAi(false);
    };

    loadProperty();
    fetchAiInsights();
  }, [id, fetchProperty, user, token]);

  const handleInterest = async () => {
    if (!user) return navigate('/login');
    
    // Check if user has phone number
    if (!user.phone && !isInterested) {
      setShowPhoneModal(true);
      return;
    }

    const res = await toggleInterest(id);
    if (res.success) {
      setIsInterested(!isInterested);
      toast.success(isInterested ? 'Removed from interests' : 'Interest expressed! Owner notified.');
    }
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!tempPhone || tempPhone.length < 10) {
      return toast.error('Please enter a valid phone number');
    }

    setUpdatingPhone(true);
    const res = await updateProfile({ phone: tempPhone });
    setUpdatingPhone(false);

    if (res.success) {
      setShowPhoneModal(false);
      // Now express interest
      handleInterest();
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login');
    if (!reviewData.comment) return toast.error('Please add a comment');
    
    setSubmittingReview(true);
    const res = await addReview(id, reviewData);
    setSubmittingReview(false);
    
    if (res.success) {
      toast.success('Review added successfully!');
      setReviewData({ rating: 5, comment: '' });
      // Refresh property to show new review
      const data = await fetchProperty(id);
      setProperty(data);
    }
  };

  if (loading || !property) {
    return <div className="min-h-screen bg-[#030712] flex items-center justify-center"><Spinner /></div>;
  }

  const { title, description, price, location, type, images, contactInfo, owner, reviews = [] } = property;
  
  const displayImages = images && images.length > 0 
    ? images.map(img => getImageUrl(img)) 
    : [getImageUrl(null)];

  return (
    <div className="min-h-screen bg-[#030712] pt-32 pb-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-slate-400 hover:text-white transition-colors group cursor-pointer"
        >
           <div className="p-1.5 rounded-lg bg-white/5 border border-white/10 group-hover:bg-indigo-600 transition-all">
              <HiArrowLeft className="text-sm" />
           </div>
           <span className="font-black text-[10px] uppercase tracking-widest">Go Back</span>
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Gallery & Details */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Gallery Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-4"
            >
              <div className="relative aspect-[16/9] rounded-[2.5rem] overflow-hidden group">
                 <img src={displayImages[activeImage]} alt="" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                 
                 {displayImages.length > 1 && (
                   <div className="absolute inset-0 flex items-center justify-between px-6 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => setActiveImage((prev) => (prev === 0 ? displayImages.length - 1 : prev - 1))} className="p-4 rounded-2xl bg-black/50 text-white backdrop-blur-md cursor-pointer hover:bg-white hover:text-black transition-all">
                         <HiChevronLeft size={24} />
                      </button>
                      <button onClick={() => setActiveImage((prev) => (prev + 1) % displayImages.length)} className="p-4 rounded-2xl bg-black/50 text-white backdrop-blur-md cursor-pointer hover:bg-white hover:text-black transition-all">
                         <HiChevronRight size={24} />
                      </button>
                   </div>
                 )}
              </div>
              {displayImages.length > 1 && (
                 <div className="flex gap-4 p-4 overflow-x-auto custom-scrollbar">
                    {displayImages.map((img, i) => (
                      <button 
                        key={i} 
                        onClick={() => setActiveImage(i)}
                        className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === i ? 'border-indigo-500 scale-105 shadow-lg' : 'border-transparent opacity-50'}`}
                      >
                         <img src={img} alt="" className="w-full h-full object-cover" />
                      </button>
                    ))}
                 </div>
              )}
            </motion.div>

            {/* Information Section */}
            <div className="space-y-6">
               <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div>
                    <div className="inline-flex items-center gap-2 px-2 py-0.5 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 text-[9px] font-black uppercase tracking-widest mb-3">
                       Featured {type}
                    </div>
                    <h1 className="text-3xl font-black text-white tracking-tight leading-tight">{title}</h1>
                    <div className="flex items-center gap-2 text-slate-400 mt-2 text-left">
                       <HiLocationMarker className="text-indigo-500 text-lg shrink-0" />
                       <span className="text-base font-medium">{location?.area}, {location?.city}</span>
                    </div>
                  </div>
                  <div className="text-left sm:text-right">
                    <div className="text-3xl font-black text-indigo-500">₹{price.toLocaleString('en-IN')}</div>
                    <div className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">Monthly Rent</div>
                    
                    {/* AI Price Insight */}
                    {aiAnalysis && (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="mt-3 p-3 rounded-xl bg-gradient-to-r from-indigo-600/20 to-fuchsia-600/20 border border-indigo-500/30 backdrop-blur-md"
                      >
                         <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs">✨</span>
                            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-indigo-300">AI Price insight</span>
                            <span className={`ml-auto px-2 py-0.5 rounded-full text-[8px] font-black uppercase ${
                              aiAnalysis.status === 'Good Deal' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'
                            }`}>
                               {aiAnalysis.status}
                            </span>
                         </div>
                         <p className="text-[10px] text-slate-300 font-medium leading-tight">
                            {aiAnalysis.insight}
                         </p>
                         <div className="mt-2 text-[8px] text-slate-500 font-bold">
                            Prediction: <span className="text-indigo-400">{aiAnalysis.prediction}</span>
                         </div>
                      </motion.div>
                    )}
                  </div>
               </div>

               <div className="p-6 rounded-2xl bg-indigo-600/5 border border-indigo-500/10">
                  <h3 className="text-white font-black text-[10px] uppercase tracking-widest mb-2">The Space</h3>
                  <p className="text-slate-400 font-medium leading-relaxed text-base">{description}</p>
               </div>

               {/* Map & Location Intelligence */}
               <div className="space-y-6">
                  <div className="flex items-center justify-between">
                     <h2 className="text-xl font-black text-white italic">Location <span className="text-indigo-500">Intelligence</span></h2>
                     <div className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-[9px] font-black tracking-widest uppercase">
                        Real-time View
                     </div>
                  </div>
                  
                  <div className="overflow-hidden rounded-[2.5rem] border border-white/10 shadow-2xl">
                     <MapComponent 
                        center={property.coordinates || { lat: 28.6139, lng: 77.2090 }} 
                        title={title} 
                     />
                  </div>

                  {/* Nearby Facilities */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                     {[
                        { icon: '🏫', label: 'Schools', dist: '0.8 km' },
                        { icon: '🏥', label: 'Hospitals', dist: '1.2 km' },
                        { icon: '🚇', label: 'Transport', dist: '0.5 km' },
                        { icon: '🛍️', label: 'Markets', dist: '1.0 km' }
                     ].map((item, i) => (
                        <div key={i} className="p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-indigo-500/30 transition-all group">
                           <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{item.icon}</div>
                           <div className="text-[10px] font-black text-white uppercase tracking-widest mb-1">{item.label}</div>
                           <div className="text-[9px] text-slate-500 font-bold italic">{item.dist} away</div>
                        </div>
                     ))}
                  </div>
               </div>
            </div>

            {/* Reviews Section */}
            <div className="space-y-6 pb-8">
               <div className="flex items-center gap-2">
                  <h2 className="text-xl font-black text-white">Community <span className="text-indigo-500">Reviews</span></h2>
                  <div className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-400 text-[10px] font-black">
                     {reviews.length}
                  </div>
               </div>

               {/* Add Review Form */}
               {user && user.role === 'seeker' && (
                 <div className="bg-white/5 backdrop-blur-3xl rounded-2xl border border-white/10 p-6">
                    <h4 className="text-white font-black text-[10px] uppercase tracking-widest mb-4">Leave your feedback</h4>
                    <form onSubmit={handleReviewSubmit} className="space-y-6">
                       <div className="flex gap-4 items-center">
                          <label className="text-slate-400 text-xs font-black uppercase tracking-widest">Rating:</label>
                          <div className="flex gap-1 group/stars">
                             {[1, 2, 3, 4, 5].map((s) => (
                               <button 
                                 key={s} type="button" 
                                 onClick={() => setReviewData({ ...reviewData, rating: s })}
                                 className={`transition-all duration-300 transform cursor-pointer hover:scale-125 active:scale-95 ${
                                   s <= reviewData.rating ? 'text-amber-400' : 'text-white/20'
                                 }`}
                               >
                                  <HiStar size={28} />
                               </button>
                             ))}
                          </div>
                       </div>
                       <div className="relative">
                          <textarea 
                             value={reviewData.comment}
                             onChange={(e) => setReviewData({ ...reviewData, comment: e.target.value })}
                             placeholder="Share your thoughts about this property..."
                             className="w-full p-6 bg-white/5 border border-white/10 rounded-[2rem] text-white outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all font-medium min-h-[150px] resize-none"
                          />
                          <button 
                             type="submit" 
                             disabled={submittingReview}
                             className="absolute bottom-4 right-4 px-6 py-3 bg-white text-[#030712] font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2 cursor-pointer"
                          >
                             {submittingReview ? 'Posting...' : <><HiChatAlt2 size={18}/> Post Review</>}
                          </button>
                       </div>
                    </form>
                 </div>
               )}

               {/* Reviews List */}
               <div className="grid gap-6">
                 {reviews.length > 0 ? (
                   reviews.map((review, i) => (
                     <div key={i} className="bg-white/5 p-8 rounded-[2rem] border border-white/5 flex gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center font-black shrink-0">
                           {review.user?.name?.charAt(0)}
                        </div>
                        <div className="text-left">
                           <div className="flex items-center gap-4 mb-2">
                              <span className="font-black text-white">{review.user?.name}</span>
                              <div className="flex gap-0.5">
                                 {[...Array(5)].map((_, s) => (
                                    <HiStar key={s} className={s < review.rating ? "text-amber-400" : "text-white/10"} />
                                 ))}
                              </div>
                           </div>
                           <p className="text-slate-400 text-sm font-medium">{review.comment}</p>
                           <div className="mt-2 text-[9px] text-slate-600 font-black uppercase tracking-widest">
                              {new Date(review.createdAt).toLocaleDateString()}
                           </div>
                        </div>
                     </div>
                   ))
                 ) : (
                    <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-2xl">
                       <p className="text-slate-600 font-medium text-xs">No reviews gathering yet.</p>
                    </div>
                 )}
               </div>
            </div>
          </div>

          {/* Right Column: Actions & Contact */}
          <div className="lg:col-span-4 lg:sticky lg:top-24 h-fit space-y-8">
            {/* Interest Card */}
            {user?.role !== 'owner' && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-indigo-600/5 border border-indigo-500/10 rounded-xl p-5"
              >
                <div className="flex items-center justify-between mb-4">
                   <h3 className="text-white font-black text-[10px] uppercase tracking-widest">Status</h3>
                   {isInterested ? <HiHeart className="text-indigo-400 text-xl" /> : <HiOutlineHeart className="text-slate-700 text-xl" />}
                </div>
                <button 
                  onClick={handleInterest}
                  className={`w-full py-4 rounded-xl font-black text-sm transition-all active:scale-95 cursor-pointer flex items-center justify-center gap-2 ${
                    isInterested 
                    ? 'bg-transparent border border-indigo-500 text-indigo-400 hover:bg-indigo-500/10' 
                    : 'bg-white text-[#030712] hover:shadow-lg'
                  }`}
                >
                  {isInterested ? 'Remove Interest' : 'Express Interest'}
                </button>
                <p className="text-slate-500 text-[9px] font-black uppercase tracking-widest text-center mt-3">
                  Owners see your interest immediately
                </p>
              </motion.div>
            )}

            {/* Owner Contact Card */}
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white/5 backdrop-blur-3xl rounded-[3rem] border border-white/10 p-8 border-t border-indigo-500/20 shadow-2xl"
            >
              <h3 className="text-white font-black text-sm uppercase tracking-widest mb-8">Meet the Owner</h3>
              <div className="flex items-center gap-5 mb-8">
                 <div className="w-16 h-16 rounded-[1.5rem] bg-gradient-to-br from-indigo-500 to-fuchsia-500 flex items-center justify-center text-2xl font-black text-white shadow-xl">
                    {owner?.name?.charAt(0)}
                 </div>
                 <div className="text-left">
                    <div className="font-black text-white text-xl flex items-center gap-2">
                       {owner?.name} <HiOutlineBadgeCheck className="text-indigo-400" />
                    </div>
                    <div className="text-slate-500 font-bold text-xs uppercase tracking-widest">Verified Host</div>
                 </div>
              </div>

              {user ? (
                 <div className="space-y-4">
                    {(user?._id || user?.id)?.toString() !== owner?._id?.toString() && user.role === 'seeker' && (
                      <button 
                        onClick={async (e) => {
                          const btn = e.currentTarget;
                          btn.disabled = true;
                          const loadingToast = toast.loading('Initializing secure chat...');
                          try {
                            const { data } = await API.post('/chats', { userId: owner?._id, propertyId: id });
                            toast.success('Conversation started!', { id: loadingToast });
                            navigate('/chats');
                          } catch (err) {
                            toast.error('Failed to start chat. Please try again.', { id: loadingToast });
                            btn.disabled = false;
                          }
                        }}
                        className="flex items-center justify-center gap-4 w-full py-5 bg-indigo-600 text-white rounded-2xl font-black text-sm hover:bg-indigo-700 transition-all shadow-lg active:scale-95 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed group"
                      >
                        <HiChatAlt2 className="text-xl group-hover:scale-110 transition-transform" />
                        Chat with Owner
                      </button>
                    )}
                    <a href={`tel:${contactInfo?.phone}`} className="flex items-center justify-center gap-4 w-full py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-sm hover:bg-white/10 transition-all group">
                       <HiPhone className="text-indigo-400 text-xl" />
                       {contactInfo?.phone}
                    </a>
                    <a href={`mailto:${contactInfo?.email}`} className="flex items-center justify-center gap-4 w-full py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-sm hover:bg-white/10 transition-all font-bold">
                       <HiMail className="text-indigo-400 text-xl" />
                       Send Secure Email
                    </a>
                 </div>
              ) : (
                 <div className="text-center p-8 bg-black/40 rounded-3xl border border-white/5">
                    <HiChatAlt2 className="mx-auto text-4xl text-slate-700 mb-4" />
                    <p className="text-slate-400 font-medium mb-6">Log in to unlock direct contact with the owner.</p>
                    <Link to="/login" className="inline-block w-full py-4 bg-indigo-600 text-white rounded-2xl font-black text-md hover:bg-indigo-700 shadow-xl shadow-indigo-500/20 transition-all active:scale-95">
                       Log In To View
                    </Link>
                 </div>
              )}

              <div className="mt-8 p-4 bg-indigo-500/5 rounded-2xl border border-indigo-500/10 text-xs text-indigo-400 font-medium flex gap-3 text-left">
                 <span>🛡️</span>
                 <span>Avoid pay brokers! Connect directly for verified listings.</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Phone Collection Modal */}
      <AnimatePresence>
        {showPhoneModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowPhoneModal(false)}
              className="absolute inset-0 bg-[#030712]/80 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[2.5rem] p-10 shadow-2xl overflow-hidden"
            >
              {/* Bg Glow */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/20 blur-3xl -z-10"></div>
              
              <div className="text-center mb-8">
                 <div className="w-16 h-16 rounded-2xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-6">
                    <HiPhone className="text-3xl text-indigo-400" />
                 </div>
                 <h3 className="text-2xl font-black text-white mb-2">Final Step</h3>
                 <p className="text-slate-400 text-sm font-medium">Please provide your contact number so the property owner can reach out to you.</p>
              </div>

              <form onSubmit={handlePhoneSubmit} className="space-y-6">
                 <div>
                    <label className="block text-[10px] font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Phone Number</label>
                    <div className="relative">
                       <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <span className="text-slate-500 font-bold">+91</span>
                       </div>
                       <input 
                          type="tel"
                          required
                          value={tempPhone}
                          onChange={(e) => setTempPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                          placeholder="9876543210"
                          className="w-full pl-14 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold tracking-widest text-lg"
                       />
                    </div>
                 </div>

                 <div className="flex flex-col gap-3">
                    <button 
                       type="submit"
                       disabled={updatingPhone}
                       className="w-full py-4 bg-white text-[#030712] font-black rounded-2xl hover:bg-slate-200 transition-all active:scale-95 disabled:opacity-50 cursor-pointer text-lg"
                    >
                       {updatingPhone ? 'Saving...' : 'Express Interest'}
                    </button>
                    <button 
                       type="button"
                       onClick={() => setShowPhoneModal(false)}
                       className="w-full py-3 bg-transparent text-slate-500 hover:text-white font-bold transition-all cursor-pointer"
                    >
                       Cancel
                    </button>
                 </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default PropertyDetails;
