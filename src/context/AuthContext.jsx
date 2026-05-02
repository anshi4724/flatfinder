import { createContext, useContext, useState, useEffect } from 'react';
import API from '../api/axios';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const { data } = await API.get('/auth/me');
          setUser(data.user);
        } catch {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const signup = async (formData) => {
    try {
      const { data } = await API.post('/auth/register', formData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Account created successfully!');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || error.response?.data?.errors?.[0]?.msg || 'Signup failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const login = async (formData) => {
    try {
      const { data } = await API.post('/auth/login', formData);
      localStorage.setItem('token', data.token);
      setUser(data.user);
      toast.success('Welcome back!');
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    toast.success('Logged out');
  };

  const updateProfile = async (formData) => {
    try {
      const { data } = await API.put('/auth/update-profile', formData);
      setUser(data.user);
      return { success: true };
    } catch (error) {
      const msg = error.response?.data?.message || 'Update failed';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, loading, signup, login, logout, updateProfile,
      isOwner: user?.role === 'owner' 
    }}>
      {children}
    </AuthContext.Provider>
  );
};
