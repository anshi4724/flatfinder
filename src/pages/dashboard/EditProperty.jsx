import { useState, useEffect } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useProperty } from '../../context/PropertyContext';
import { HiArrowLeft, HiPhotograph, HiX } from 'react-icons/hi';
import Spinner from '../../components/ui/Spinner';
import toast from 'react-hot-toast';

const EditProperty = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { fetchProperty, updateProperty, loading } = useProperty();
  const [submitting, setSubmitting] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    city: '',
    area: '',
    type: '1BHK',
    phone: '',
    email: '',
  });

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const property = await fetchProperty(id);
      if (property) {
        setFormData({
          title: property.title,
          description: property.description,
          price: property.price,
          city: property.location?.city || '',
          area: property.location?.area || '',
          type: property.type,
          phone: property.contactInfo?.phone || '',
          email: property.contactInfo?.email || '',
        });
        setExistingImages(property.images || []);
      }
      setInitialLoad(false);
    };
    loadData();
  }, [id, fetchProperty]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length + newImages.length + existingImages.length > 5) {
      toast.error('You can only have a maximum of 5 images total');
      return;
    }

    const addedImages = [...newImages, ...files];
    setNewImages(addedImages);

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    const updatedImages = [...newImages];
    updatedImages.splice(index, 1);
    setNewImages(updatedImages);

    const updatedPreviews = [...previewUrls];
    URL.revokeObjectURL(updatedPreviews[index]); // Free memory
    updatedPreviews.splice(index, 1);
    setPreviewUrls(updatedPreviews);
  };

  const removeExistingImage = (index) => {
    // Note: To fully implement existing image removal on the backend, 
    // we would need to pass an array of images to keep/delete.
    // For now, we'll just allow adding new ones.
    toast.error('Removing existing images is not supported in this version');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    const submitData = new FormData();
    Object.keys(formData).forEach(key => {
      submitData.append(key, formData[key]);
    });

    newImages.forEach(image => {
      submitData.append('images', image);
    });

    const res = await updateProperty(id, submitData);
    setSubmitting(false);

    if (res.success) {
      navigate('/dashboard');
    }
  };

  if (initialLoad || loading) {
    return <div className="min-h-screen pt-20"><Spinner /></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
          <Link to="/dashboard" className="inline-flex items-center text-sm text-slate-500 hover:text-indigo-600 mb-4 transition font-medium">
            <HiArrowLeft className="mr-1" /> Back to Dashboard
          </Link>
          <h1 className="text-3xl font-extrabold text-slate-800">Edit Property</h1>
          <p className="text-slate-500 mt-1">Update details for your listing</p>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-8">
            
            {/* Basic Info */}
            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Property Title *</label>
                  <input
                    type="text"
                    name="title"
                    required
                    value={formData.title}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Description *</label>
                  <textarea
                    name="description"
                    required
                    rows="4"
                    value={formData.description}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition resize-none"
                  ></textarea>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Monthly Rent (₹) *</label>
                    <input
                      type="number"
                      name="price"
                      required
                      min="0"
                      value={formData.price}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Property Type *</label>
                    <select
                      name="type"
                      required
                      value={formData.type}
                      onChange={handleChange}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                    >
                      <option value="1BHK">1 BHK</option>
                      <option value="2BHK">2 BHK</option>
                      <option value="3BHK">3 BHK</option>
                      <option value="PG">PG / Hostel</option>
                      <option value="Studio">Studio Apartment</option>
                      <option value="Villa">Villa</option>
                    </select>
                  </div>
                </div>
              </div>
            </section>

            {/* Location */}
            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Location Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">City *</label>
                  <input
                    type="text"
                    name="city"
                    required
                    value={formData.city}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Area/Locality *</label>
                  <input
                    type="text"
                    name="area"
                    required
                    value={formData.area}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>
              </div>
            </section>

            {/* Contact Info */}
            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2">Contact Information</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Contact Email *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition"
                  />
                </div>
              </div>
            </section>

            {/* Images */}
            <section>
              <h3 className="text-lg font-bold text-slate-800 mb-4 border-b pb-2 flex justify-between items-center">
                <span>Property Images</span>
                <span className="text-sm font-normal text-slate-500">{existingImages.length + newImages.length}/5 uploaded</span>
              </h3>
              
              {/* Existing Images */}
              {existingImages.length > 0 && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-slate-600 mb-3">Current Images</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {existingImages.map((url, index) => (
                      <div key={`existing-${index}`} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 shadow-sm opacity-80">
                        <img src={url} alt={`Existing ${index}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeExistingImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer shadow-sm"
                        >
                          <HiX className="text-sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload New Images */}
              {existingImages.length + newImages.length < 5 && (
                <div className="mt-2">
                  <p className="text-sm font-medium text-slate-600 mb-3">Add Additional Images</p>
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-slate-300 border-dashed rounded-xl hover:border-indigo-400 transition-colors bg-slate-50 group">
                    <div className="space-y-1 text-center">
                      <HiPhotograph className="mx-auto h-12 w-12 text-slate-400 group-hover:text-indigo-400 transition-colors" />
                      <div className="flex text-sm text-slate-600 justify-center">
                        <label htmlFor="file-upload" className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500 px-2 py-1">
                          <span>Upload new images</span>
                          <input id="file-upload" name="images" type="file" multiple accept="image/*" className="sr-only" onChange={handleImageChange} disabled={existingImages.length + newImages.length >= 5} />
                        </label>
                        <p className="pl-1 py-1">or drag and drop</p>
                      </div>
                      <p className="text-xs text-slate-500">PNG, JPG, WEBP up to 5MB each. You can add {5 - (existingImages.length + newImages.length)} more.</p>
                    </div>
                  </div>
                </div>
              )}

              {previewUrls.length > 0 && (
                <div className="mt-6">
                  <p className="text-sm font-medium text-slate-600 mb-3">New Images (to be uploaded)</p>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 mt-6">
                    {previewUrls.map((url, index) => (
                      <div key={`new-${index}`} className="relative group rounded-xl overflow-hidden aspect-square border border-slate-200 shadow-sm border-2 border-indigo-200">
                        <img src={url} alt={`Preview ${index}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeNewImage(index)}
                          className="absolute top-2 right-2 p-1.5 bg-white/90 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white cursor-pointer shadow-sm"
                        >
                          <HiX className="text-sm" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>

            <div className="pt-6 border-t border-slate-200 flex justify-end gap-4">
              <Link
                to="/dashboard"
                className="px-6 py-3 border border-slate-300 rounded-xl text-slate-700 font-medium hover:bg-slate-50 transition"
              >
                Cancel
              </Link>
              <button
                type="submit"
                disabled={submitting}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-medium hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed transition cursor-pointer"
              >
                {submitting ? 'Updating...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProperty;
