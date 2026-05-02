import PropertyCard from './PropertyCard';
import Spinner from '../ui/Spinner';

const PropertyGrid = ({ properties, loading }) => {
  if (loading) return <Spinner />;

  if (!properties || properties.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🏠</div>
        <h3 className="text-xl font-semibold text-slate-700 mb-2">No properties found</h3>
        <p className="text-slate-500">Try adjusting your search or filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {properties.map((property) => (
        <PropertyCard key={property._id} property={property} />
      ))}
    </div>
  );
};

export default PropertyGrid;
