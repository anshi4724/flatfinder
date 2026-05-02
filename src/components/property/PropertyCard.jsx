import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { HiLocationMarker, HiCurrencyRupee, HiPhotograph, HiArrowRight } from 'react-icons/hi';
import { getImageUrl } from '../../utils/helpers';

const PropertyCard = ({ property }) => {
  const { _id, title, price, location, type, images, createdAt } = property;

  const formattedPrice = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

  const timeAgo = (date) => {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    const intervals = [
      { label: 'yr', seconds: 31536000 },
      { label: 'mo', seconds: 2592000 },
      { label: 'wk', seconds: 604800 },
      { label: 'd', seconds: 86400 },
      { label: 'h', seconds: 3600 },
      { label: 'm', seconds: 60 },
    ];
    for (const interval of intervals) {
      const count = Math.floor(seconds / interval.seconds);
      if (count >= 1) return `${count}${interval.label} ago`;
    }
    return 'Just now';
  };

  const typeStyles = {
    '1BHK': 'from-blue-500/20 to-indigo-500/20 text-blue-400 border-blue-500/30',
    '2BHK': 'from-emerald-500/20 to-teal-500/20 text-emerald-400 border-emerald-500/30',
    '3BHK': 'from-purple-500/20 to-violet-500/20 text-purple-400 border-purple-500/30',
    PG: 'from-orange-500/20 to-amber-500/20 text-orange-400 border-orange-500/30',
    Studio: 'from-pink-500/20 to-rose-500/20 text-pink-400 border-pink-500/30',
    Villa: 'from-fuchsia-500/20 to-purple-500/20 text-fuchsia-400 border-fuchsia-500/30',
  };

  const thumbnailUrl = getImageUrl(images?.[0]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.5 }}
    >
      <Link to={`/property/${_id}`} className="group block h-full">
        <div className="relative h-full bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl hover:shadow-slate-200/60 transition-all duration-500 shadow-lg shadow-slate-200/50">
          
          {/* Image Container */}
          <div className="relative h-48 overflow-hidden">
            <img
              src={thumbnailUrl}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-1000"
              onError={(e) => {
                e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop';
              }}
            />
            
            {/* Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>

            {/* Type Badge */}
            <div className={`absolute top-4 right-4 px-3 py-1.5 rounded-xl text-xs font-bold uppercase border backdrop-blur-md bg-white/90 text-indigo-600 border-indigo-200 shadow-sm`}>
              {type}
            </div>

            {/* Image Count */}
            {images && images.length > 1 && (
              <div className="absolute top-4 left-4 flex items-center gap-1.5 bg-black/50 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-white/20">
                <HiPhotograph className="text-sm" />
                {images.length}
              </div>
            )}

            {/* Price Tag */}
            <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
               <div className="flex flex-col">
                  <span className="text-xs font-bold text-indigo-300 uppercase tracking-wide leading-none mb-1">Monthly Rent</span>
                  <div className="flex items-center gap-1">
                    <span className="text-2xl font-black text-white tracking-tight">₹{formattedPrice.replace(/₹|,/g, '')}</span>
                    <span className="text-sm font-bold text-white/80 mb-0.5">/month</span>
                  </div>
               </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <h3 className="text-lg font-bold text-slate-900 mb-2 line-clamp-1 group-hover:text-indigo-600 transition-colors leading-tight">
              {title}
            </h3>
            <div className="flex items-center gap-2 text-slate-600 mb-4 font-medium">
              <HiLocationMarker className="text-indigo-500 text-base flex-shrink-0" />
              <span className="text-sm truncate">
                {location?.area}, {location?.city}
              </span>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <div className="flex items-center gap-2">
                 <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                 <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{timeAgo(createdAt)}</span>
              </div>
              <div className="flex items-center gap-2 text-sm font-bold text-indigo-600 uppercase tracking-wide group-hover:gap-3 transition-all duration-300">
                View Details
                <HiArrowRight className="text-lg" />
              </div>
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default PropertyCard;

