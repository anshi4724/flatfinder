import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useProperty } from '../../context/PropertyContext';
import { HiLocationMarker, HiSearch, HiX, HiCheckCircle } from 'react-icons/hi';
import toast from 'react-hot-toast';

const popularCities = [
  { name: 'Mumbai', icon: '🏙️' },
  { name: 'Pune', icon: '🌳' },
  { name: 'Bangalore', icon: '💻' },
  { name: 'Delhi', icon: '🏛️' },
  { name: 'Ahmedabad', icon: '🏭' },
  { name: 'Chennai', icon: '🌊' },
];

const propertyTypes = [
  { id: '1BHK', label: '1 BHK', icon: '🏠' },
  { id: '2BHK', label: '2 BHK', icon: '🏡' },
  { id: '3BHK', label: '3 BHK', icon: '🏢' },
  { id: 'Villa', label: 'Villa', icon: '🏰' },
  { id: 'PG', label: 'PG', icon: '🛌' },
  { id: 'Studio', label: 'Studio', icon: '🎨' },
];

const LocationSelector = () => {
  const { selectedCity, selectedType, updateSelectedCity, isLocationModalOpen, setIsLocationModalOpen } = useProperty();
  const [step, setStep] = useState(1);
  const [tempCity, setTempCity] = useState(selectedCity || '');
  const [tempTypes, setTempTypes] = useState(selectedType || []);
  const [customCity, setCustomCity] = useState('');
  const [geolocating, setGeolocating] = useState(false);
  const modalRef = useRef(null);

  useEffect(() => {
    if (isLocationModalOpen) {
      setStep(1);
      setTempTypes(selectedType || []);
    }
  }, [isLocationModalOpen, selectedType]);

  const handleBackdropClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setIsLocationModalOpen(false);
    }
  };

  const detectLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported');
      return;
    }
    setGeolocating(true);
    navigator.geolocation.getCurrentPosition(async (position) => {
      try {
        const { latitude, longitude } = position.coords;
        const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
        const data = await response.json();
        const city = data.address.city || data.address.town || data.address.village || data.address.state_district || data.address.county;
        if (city) {
          const cleanCity = city.replace(' District', '').replace(' Tehsils', '');
          setTempCity(cleanCity);
          toast.success(`Detected: ${cleanCity}`);
          setStep(2);
        } else {
          toast.error('Could not determine city');
        }
      } catch (error) {
        toast.error('Error detecting location');
      } finally {
        setGeolocating(false);
      }
    }, () => {
      setGeolocating(false);
      toast.error('Permission denied');
    });
  };

  const handleCitySelect = (city) => {
    setTempCity(city);
    setStep(2);
  };

  const toggleType = (typeId) => {
    setTempTypes(prev =>
      prev.includes(typeId) ? prev.filter(t => t !== typeId) : [...prev, typeId]
    );
  };

  const handleConfirm = () => {
    if (tempTypes.length === 0) {
      toast.error('Please select at least one type');
      return;
    }
    updateSelectedCity(tempCity, tempTypes);
  };

  const handleCustomSubmit = (e) => {
    e.preventDefault();
    if (customCity.trim()) {
      handleCitySelect(customCity.trim());
    }
  };

  return (
    <AnimatePresence>
      {isLocationModalOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
          className="fixed inset-0 z-[999] flex items-center justify-center p-4 bg-[#030712]/95 backdrop-blur-3xl"
        >
          <button
            onClick={() => setIsLocationModalOpen(false)}
            className="absolute top-6 right-6 sm:top-10 sm:right-10 p-3 rounded-2xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all z-[1000] cursor-pointer"
          >
            <HiX className="text-2xl" />
          </button>

          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 rounded-full blur-[120px]"></div>
          </div>

          <motion.div
            ref={modalRef}
            key={step}
            initial={{ scale: 0.9, opacity: 0, x: step === 1 ? -30 : 30 }}
            animate={{ scale: 1, opacity: 1, x: 0 }}
            exit={{ scale: 0.9, opacity: 0, x: step === 1 ? 30 : -30 }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="relative w-full max-w-2xl bg-white/5 border border-white/10 rounded-[3.5rem] p-8 sm:p-12 shadow-2xl overflow-hidden"
          >
            {step === 1 ? (
              <>
                <div className="text-center mb-10">
                  <motion.div initial={{ y: -10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-indigo-400 text-xs font-black uppercase tracking-widest mb-6">
                    <HiLocationMarker className="text-lg" />
                    Discovery Phase
                  </motion.div>
                  <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
                    Where are you <span className="text-indigo-500">looking?</span>
                  </h2>
                </div>

                <button
                  onClick={detectLocation}
                  disabled={geolocating}
                  className="w-full h-16 mb-8 rounded-2xl bg-indigo-600 border border-indigo-500 flex items-center justify-center gap-3 text-white font-black hover:bg-indigo-700 transition-all group relative cursor-pointer"
                >
                  <HiLocationMarker className={`text-2xl ${geolocating ? 'animate-bounce' : 'group-hover:scale-110'}`} />
                  {geolocating ? 'Detecting...' : 'Current Location'}
                </button>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                  {popularCities.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleCitySelect(city.name)}
                      className="group relative p-6 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:border-indigo-500 transition-all text-left cursor-pointer"
                    >
                      <div className="text-2xl mb-2 group-hover:scale-125 transition-transform">{city.icon}</div>
                      <div className="font-black text-white text-xs tracking-widest uppercase">{city.name}</div>
                    </button>
                  ))}
                </div>

                <form onSubmit={handleCustomSubmit} className="relative group">
                  <HiSearch className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500 text-2xl group-focus-within:text-indigo-400 transition-colors" />
                  <input
                    type="text"
                    value={customCity}
                    onChange={(e) => setCustomCity(e.target.value)}
                    placeholder="Or enter city manually..."
                    className="w-full pl-16 pr-10 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-700 outline-none focus:ring-2 focus:ring-indigo-500/50 font-bold"
                  />
                </form>
              </>
            ) : (
              <>
                <div className="text-center mb-10">
                  <motion.div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-widest mb-6">
                    <HiCheckCircle className="text-lg" />
                    {tempCity} Locked In
                  </motion.div>
                  <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 tracking-tight">
                    Select <span className="text-indigo-500">Categories</span>
                  </h2>
                  <p className="text-slate-400 font-medium text-sm">You can select multiple options relative to your budget.</p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
                  {propertyTypes.map((type) => {
                    const isSelected = tempTypes.includes(type.id);
                    return (
                      <button
                        key={type.id}
                        onClick={() => toggleType(type.id)}
                        className={`group relative p-6 border-2 rounded-2xl transition-all duration-300 text-left cursor-pointer ${
                          isSelected
                            ? 'bg-indigo-600/20 border-indigo-500 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                            : 'bg-white/5 border-white/10 hover:bg-white/10'
                        }`}
                      >
                        <div className={`text-2xl mb-2 transition-transform duration-500 ${isSelected ? 'scale-125' : 'group-hover:scale-110'}`}>{type.icon}</div>
                        <div className={`font-black text-xs tracking-widest uppercase transition-colors ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                          {type.label}
                        </div>
                        {isSelected && (
                          <div className="absolute top-4 right-4 text-indigo-400">
                            <HiCheckCircle className="text-xl" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={handleConfirm}
                    className="w-full py-5 bg-white text-[#030712] rounded-2xl font-black text-lg transition-all hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:scale-95 cursor-pointer"
                  >
                    Confirm Selection ({tempTypes.length})
                  </button>
                  <button
                    onClick={() => setStep(1)}
                    className="text-slate-500 hover:text-white text-[10px] font-black uppercase tracking-widest transition-colors cursor-pointer"
                  >
                    ← Change Location
                  </button>
                </div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LocationSelector;
