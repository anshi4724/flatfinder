import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useProperty } from '../../context/PropertyContext';
import { HiOutlineUpload, HiCurrencyRupee, HiLocationMarker, HiInformationCircle, HiPlus, HiX, HiCheckCircle } from 'react-icons/hi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { PROPERTY_TYPES, LOCATIONS } from '../../utils/constants';

const AddProperty = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: LOCATIONS[0].city,
    area: '',
    type: PROPERTY_TYPES[0],
    phone: '',
    email: '',
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const { createProperty } = useProperty();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImages([...images, ...files]);

    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...newPreviews]);
  };

  const removeImage = (index) => {
    const newImages = [...images];
    newImages.splice(index, 1);
    setImages(newImages);

    const newPreviews = [...previews];
    newPreviews.splice(index, 1);
    setPreviews(newPreviews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (images.length === 0) {
      return toast.error('Please upload at least one image');
    }

    setLoading(true);
    const data = new FormData();
    Object.keys(formData).forEach((key) => data.append(key, formData[key]));
    images.forEach((image) => data.append('images', image));

    const res = await createProperty(data);
    setLoading(false);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] pt-32 pb-20 px-4 sm:px-6 lg:px-8 relative overflow-hidden w-full">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/10 rounded-full blur-[120px]"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/10 rounded-full blur-[120px]"></div>
      </div>

      <div className="max-w-4xl mx-auto relative z-10">
        <div className="flex items-center gap-4 mb-12">
           <button 
             onClick={() => navigate('/dashboard')}
             className="p-4 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all cursor-pointer"
           >
              <HiX className="text-xl rotate-45" />
           </button>
           <div>
              <h1 className="text-4xl font-black text-white tracking-tight">Post <span className="text-indigo-500">Property</span></h1>
              <p className="text-slate-400 font-medium">Add a new premium listing to FlatFinder.</p>
           </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
           {/* Image Upload Section */}
           <motion.div 
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-8 sm:p-10"
           >
              <div className="flex items-center gap-2 mb-6">
                 <HiOutlineUpload className="text-indigo-400 text-xl" />
                 <h2 className="text-xl font-black text-white uppercase tracking-widest text-sm">Media Upload</h2>
              </div>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
                {previews.map((src, i) => (
                  <div key={i} className="relative aspect-square rounded-2xl overflow-hidden group border border-white/10">
                    <img src={src} alt="preview" className="w-full h-full object-cover" />
                    <button
                      type="button"
                      onClick={() => removeImage(i)}
                      className="absolute top-2 right-2 p-1.5 bg-red-600 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer shadow-lg"
                    >
                      <HiX size={12} />
                    </button>
                  </div>
                ))}
                
                <label className="relative aspect-square rounded-2xl border-2 border-dashed border-white/10 hover:border-indigo-500/50 hover:bg-white/5 transition-all cursor-pointer flex flex-col items-center justify-center gap-2">
                  <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                  <div className="w-10 h-10 rounded-full bg-indigo-600/10 flex items-center justify-center text-indigo-400">
                     <HiPlus />
                  </div>
                  <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Add Photo</span>
                </label>
              </div>
              <p className="text-slate-500 text-xs font-medium">Upload high-quality images of your property. (JPG, PNG)</p>
           </motion.div>

           {/* Details Sections */}
           <div className="grid md:grid-cols-2 gap-8">
              {/* Basic Details */}
              <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-8 space-y-6"
              >
                  <div className="flex items-center gap-2 mb-2">
                     <HiInformationCircle className="text-indigo-400 text-xl" />
                     <h2 className="text-xs font-black text-white uppercase tracking-widest">Core Details</h2>
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">Property Title</label>
                    <input 
                      type="text" name="title" required value={formData.title} onChange={handleChange}
                      placeholder="e.g. Luxury 2BHK with City View"
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                     <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">Price (₹/mo)</label>
                        <input 
                          type="number" name="price" required value={formData.price} onChange={handleChange}
                          placeholder="25,000"
                          className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                        />
                     </div>
                      <div>
                        <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">Property Type</label>
                        <select 
                          name="type" value={formData.type} onChange={handleChange}
                          className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold appearance-none"
                        >
                          {PROPERTY_TYPES.map(type => (
                            <option key={type} value={type} className="bg-[#030712]">{type}</option>
                          ))}
                        </select>
                      </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">Description</label>
                    <textarea 
                      name="description" required value={formData.description} onChange={handleChange} rows="4"
                      placeholder="Describe the amenities, nearby landmarks, etc..."
                      className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-medium text-sm resize-none"
                    ></textarea>
                  </div>
              </motion.div>

              {/* Location & Contact */}
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="space-y-8"
              >
                  <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-8 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                       <HiLocationMarker className="text-indigo-400 text-xl" />
                       <h2 className="text-xs font-black text-white uppercase tracking-widest">Location</h2>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">City</label>
                          <select 
                            name="city" required value={formData.city} onChange={handleChange}
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold appearance-none"
                          >
                            {LOCATIONS.map(loc => (
                              <option key={loc.city} value={loc.city} className="bg-[#030712]">{loc.city}</option>
                            ))}
                          </select>
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">Area</label>
                          <input 
                            type="text" name="area" required value={formData.area} onChange={handleChange}
                            placeholder="Hinjewadi"
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                          />
                       </div>
                    </div>
                  </div>

                  <div className="bg-white/5 backdrop-blur-3xl rounded-[2.5rem] border border-white/10 p-8 space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                       <HiCheckCircle className="text-indigo-400 text-xl" />
                       <h2 className="text-xs font-black text-white uppercase tracking-widest">Contact Information</h2>
                    </div>
                    <div className="space-y-4">
                       <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">Phone Number</label>
                          <input 
                            type="text" name="phone" required value={formData.phone} onChange={handleChange}
                            placeholder="+91 9876543210"
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                          />
                       </div>
                       <div>
                          <label className="text-[10px] font-black text-slate-500 uppercase tracking-widest mb-2 block ml-1">Contact Email</label>
                          <input 
                            type="email" name="email" required value={formData.email} onChange={handleChange}
                            placeholder="owner@example.com"
                            className="w-full p-4 bg-white/5 border border-white/10 rounded-xl text-white outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-bold"
                          />
                       </div>
                    </div>
                  </div>
              </motion.div>
           </div>

           <button
             type="submit"
             disabled={loading}
             className="w-full py-6 bg-white text-[#030712] rounded-[2rem] font-black text-xl shadow-2xl hover:shadow-[0_0_50px_rgba(255,255,255,0.2)] hover:-translate-y-2 active:scale-95 transition-all disabled:opacity-50 cursor-pointer flex items-center justify-center gap-4"
           >
              {loading ? (
                <>Posting Listing...</>
              ) : (
                <>Publish Property <HiCheckCircle className="text-2xl" /></>
              )}
           </button>
        </form>
      </div>
    </div>
  );
};

export default AddProperty;
