import { createContext, useContext, useState, useCallback } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const PropertyContext = createContext();

export const useProperty = () => {
  const context = useContext(PropertyContext);
  if (!context) throw new Error('useProperty must be used within PropertyProvider');
  return context;
};

export const PropertyProvider = ({ children }) => {
  const [properties, setProperties] = useState([]);
  const [featuredProperties, setFeaturedProperties] = useState([]);
  const [myProperties, setMyProperties] = useState([]);
  const [currentProperty, setCurrentProperty] = useState(null);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCity, setSelectedCity] = useState(localStorage.getItem('selectedCity') || '');
  const [selectedType, setSelectedType] = useState(() => {
    const saved = localStorage.getItem('selectedType');
    try {
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(!selectedCity);

  // Fetch all properties with filters
  const fetchProperties = useCallback(async (params = {}) => {
    setLoading(true);
    try {
      const { data } = await API.get('/properties', { params });
      setProperties(data.properties);
      setPagination(data.pagination);
    } catch (error) {
      toast.error('Failed to load properties');
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch featured properties
  const fetchFeatured = useCallback(async (city, type) => {
    try {
      const cityToFetch = city !== undefined ? city : selectedCity;
      const typesToFetch = type !== undefined ? type : selectedType;
      
      const { data } = await API.get('/properties/featured', {
        params: { 
          city: cityToFetch, 
          type: Array.isArray(typesToFetch) ? typesToFetch.join(',') : typesToFetch 
        }
      });
      setFeaturedProperties(data.properties);
    } catch (error) {
      console.error('Failed to load featured:', error);
    }
  }, [selectedCity, selectedType]);

  const updateSelectedCity = (city, type) => {
    if (city !== undefined) {
      setSelectedCity(city);
      localStorage.setItem('selectedCity', city);
    }
    if (type !== undefined) {
      setSelectedType(type);
      localStorage.setItem('selectedType', JSON.stringify(type));
    }
    setIsLocationModalOpen(false);
    fetchFeatured(city, type);
  };

  const toggleInterest = async (id) => {
    try {
      await API.post(`/properties/${id}/interest`);
      fetchFeatured();
      return { success: true };
    } catch (error) {
       return { success: false, message: error.response?.data?.message || 'Error' };
    }
  };

  const addReview = async (id, review) => {
    try {
      await API.post(`/properties/${id}/reviews`, review);
      return { success: true };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || 'Error' };
    }
  };

  // Fetch single property
  const fetchProperty = useCallback(async (id) => {
    setLoading(true);
    try {
      const { data } = await API.get(`/properties/${id}`);
      setCurrentProperty(data.property);
      return data.property;
    } catch (error) {
      toast.error('Property not found');
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  // Fetch owner's properties
  const fetchMyProperties = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await API.get('/properties/my-properties');
      setMyProperties(data.properties);
    } catch (error) {
      toast.error('Failed to load your properties');
    } finally {
      setLoading(false);
    }
  }, []);

  // Create property
  const createProperty = async (formData) => {
    try {
      const { data } = await API.post('/properties', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Property listed successfully!');
      return { success: true, property: data.property };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to create property';
      toast.error(msg);
      return { success: false };
    }
  };

  // Update property
  const updateProperty = async (id, formData) => {
    try {
      const { data } = await API.put(`/properties/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success('Property updated!');
      return { success: true, property: data.property };
    } catch (error) {
      const msg = error.response?.data?.message || 'Failed to update property';
      toast.error(msg);
      return { success: false };
    }
  };

  // Delete property
  const deleteProperty = async (id) => {
    try {
      await API.delete(`/properties/${id}`);
      setMyProperties((prev) => prev.filter((p) => p._id !== id));
      toast.success('Property deleted');
      return { success: true };
    } catch (error) {
      toast.error('Failed to delete property');
      return { success: false };
    }
  };

  return (
    <PropertyContext.Provider
      value={{
        properties,
        featuredProperties,
        myProperties,
        currentProperty,
        pagination,
        loading,
        selectedCity,
        selectedType,
        isLocationModalOpen,
        setIsLocationModalOpen,
        updateSelectedCity,
        fetchProperties,
        fetchFeatured,
        fetchProperty,
        fetchMyProperties,
        createProperty,
        updateProperty,
        deleteProperty,
        toggleInterest,
        addReview,
      }}
    >
      {children}
    </PropertyContext.Provider>
  );
};

