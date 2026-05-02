import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useProperty } from '../../context/PropertyContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  HiMenu, HiX, HiHome, HiSearch, HiViewGrid, 
  HiLogin, HiPlusCircle, HiLogout, HiUser,
  HiChevronDown, HiSparkles, HiLocationMarker,
  HiChatAlt2
} from 'react-icons/hi';

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { user, logout, isOwner } = useAuth();
  const { selectedCity, selectedType, setIsLocationModalOpen } = useProperty();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileOpen(false);
  };

  const navLinks = [
    { to: '/', label: 'Home', icon: HiHome },
    { to: '/explore', label: 'Explore', icon: HiSearch },
    ...(user ? [{ to: '/chats', label: 'Messages', icon: HiChatAlt2 }] : []),
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-500 ease-in-out px-4 sm:px-6 lg:px-8 py-4 ${
        scrolled ? 'top-2' : 'top-0'
      }`}
    >
      <div 
        className={`max-w-7xl mx-auto transition-all duration-500 rounded-2xl ${
          scrolled 
            ? 'bg-white/95 backdrop-blur-xl border border-slate-200/50 shadow-[0_8px_32px_rgba(0,0,0,0.12)]' 
            : 'bg-white/90 backdrop-blur-xl border border-white/30 shadow-[0_4px_20px_rgba(0,0,0,0.08)]'
        }`}
      >
        <div className="flex items-center justify-between h-16 px-4 sm:px-6">
          {/* Logo & Location */}
          <div className="flex items-center gap-4 sm:gap-8">
            <Link to="/" className="flex items-center gap-3 group">
              <motion.div 
                whileHover={{ rotate: 10, scale: 1.1 }}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-700 to-purple-800 flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-all duration-300"
              >
                <HiHome className="text-white text-xl" />
              </motion.div>
              <span className={`hidden sm:block text-2xl font-black tracking-tight bg-gradient-to-r from-indigo-600 to-purple-800 bg-clip-text text-transparent group-hover:from-purple-800 group-hover:to-indigo-600 transition-all duration-500 ${!scrolled && location.pathname === '/' ? 'brightness-150' : ''}`}>
                Flat<span className="font-light">Finder</span>
              </span>
            </Link>

            {/* Location Selector Trigger */}
            <button
              onClick={() => setIsLocationModalOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 group cursor-pointer ${
                scrolled ? 'bg-slate-100 hover:bg-slate-200' : 'bg-slate-100/80 hover:bg-slate-200/80 backdrop-blur-md'
              }`}
            >
              <HiLocationMarker className={`text-lg transition-colors ${scrolled ? 'text-indigo-600' : 'text-indigo-600 group-hover:text-indigo-700'}`} />
              <div className="flex flex-col items-start leading-none">
                <span className={`text-[10px] font-black uppercase tracking-widest ${scrolled ? 'text-slate-400' : 'text-slate-500'}`}>
                   {selectedType && selectedType.length > 0 ? selectedType.join(', ') : 'Any Type'}
                </span>
                <span className={`text-sm font-black ${scrolled ? 'text-slate-800' : 'text-slate-700'}`}>
                  {selectedCity || 'Select City'}
                </span>
              </div>
              <HiChevronDown className={`text-sm ml-1 transition-transform group-hover:translate-y-0.5 ${scrolled ? 'text-slate-400' : 'text-slate-500'}`} />
            </button>
          </div>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center bg-slate-100/50 p-1 rounded-2xl border border-slate-200/50 backdrop-blur-sm">
            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  isActive(link.to) 
                    ? 'text-indigo-600' 
                    : scrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
                }`}
              >
                {isActive(link.to) && (
                  <motion.div 
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-white border border-slate-200/50 shadow-sm rounded-xl"
                    transition={{ type: "spring", stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <link.icon className={`text-lg transition-transform ${isActive(link.to) ? 'scale-110' : ''}`} />
                  {link.label}
                </span>
              </Link>
            ))}

            {isOwner && (
              <Link
                to="/dashboard"
                className={`relative flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  isActive('/dashboard') 
                    ? 'text-indigo-600' 
                    : scrolled ? 'text-slate-600 hover:text-indigo-600' : 'text-slate-700 hover:text-indigo-600'
                }`}
              >
                {isActive('/dashboard') && (
                  <motion.div 
                    layoutId="navbar-active"
                    className="absolute inset-0 bg-white border border-slate-200/50 shadow-sm rounded-xl"
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <HiViewGrid className={`text-lg ${isActive('/dashboard') ? 'scale-110' : ''}`} />
                  Dashboard
                </span>
              </Link>
            )}
          </div>


          {/* Auth — Desktop */}
          <div className="hidden md:flex items-center gap-4">
            {isOwner && (
              <Link
                to="/dashboard/add-property"
                className={`group flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                  scrolled 
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20 hover:bg-indigo-700' 
                    : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-lg shadow-indigo-500/20'
                }`}
              >
                <HiPlusCircle className="text-lg group-hover:rotate-90 transition-transform duration-300" />
                <span className="hidden xl:inline">Post Property</span>
              </Link>
            )}
            {user ? (
              <div className="flex items-center gap-3">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className={`flex items-center gap-3 pl-2 pr-4 py-1.5 rounded-2xl border transition-all duration-300 ${
                    scrolled 
                      ? 'bg-slate-50 border-slate-200' 
                      : 'bg-white/10 border-white/20 backdrop-blur-md'
                  }`}
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 border-2 border-white flex items-center justify-center shadow-sm">
                    <span className="text-white text-xs font-black">{user.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div className="flex flex-col">
                    <span className={`text-xs font-bold leading-none ${scrolled ? 'text-slate-800' : 'text-white'}`}>
                      {user.name}
                    </span>
                    <span className="text-[10px] text-indigo-500 font-bold uppercase tracking-wider">
                      {user.role}
                    </span>
                  </div>
                </motion.div>
                
                <button
                  onClick={handleLogout}
                  className={`group flex items-center gap-2 px-4 py-2.5 rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer border ${
                    scrolled 
                      ? 'text-red-600 hover:text-white hover:bg-red-600 border-red-200 hover:border-red-600' 
                      : 'text-red-400 hover:text-white hover:bg-red-500 border-red-400/30 hover:border-red-500'
                  }`}
                  title="Logout"
                >
                  <HiLogout className="text-lg group-hover:rotate-12 transition-transform duration-300" />
                  <span className="text-xs font-bold uppercase tracking-wider">Logout</span>
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                    scrolled ? 'text-slate-600 hover:bg-slate-100' : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="group relative px-6 py-2.5 rounded-xl overflow-hidden font-bold text-sm text-white shadow-lg transition-all duration-300"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 via-indigo-700 to-indigo-600 group-hover:scale-110 transition-transform duration-500" />
                  <div className="relative flex items-center gap-2">
                    <HiSparkles className="text-lg animate-pulse" />
                    Join Now
                  </div>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={`md:hidden p-2.5 rounded-xl transition-all duration-300 ${
              scrolled 
                ? 'text-slate-600 hover:bg-slate-100' 
                : 'text-slate-700 hover:bg-slate-100'
            }`}
          >
            {mobileOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="md:hidden absolute top-24 left-4 right-4 z-[90] overflow-hidden"
          >
            <div className="bg-white/95 backdrop-blur-2xl border border-slate-200 rounded-3xl shadow-2xl p-4 overflow-hidden">
              <div className="space-y-2">
                {navLinks.map((link) => (
                  <Link
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${
                      isActive(link.to) 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <link.icon className="text-2xl" />
                    {link.label}
                  </Link>
                ))}

                {isOwner && (
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${
                      isActive('/dashboard') 
                        ? 'bg-indigo-50 text-indigo-600' 
                        : 'text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    <HiViewGrid className="text-2xl" />
                    Dashboard
                  </Link>
                )}
                
                <div className="pt-4 mt-4 border-t border-slate-100 space-y-4">
                  {user ? (
                    <div className="space-y-2">
                      <div className="flex items-center gap-4 px-5 py-3">
                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-lg">
                          <span className="text-white text-lg font-black">{user.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <div>
                          <div className="font-extrabold text-slate-800">{user.name}</div>
                          <div className="text-xs text-indigo-500 font-bold uppercase tracking-widest">{user.role}</div>
                        </div>
                      </div>
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl text-red-500 bg-red-50/50 font-bold hover:bg-red-50 transition"
                      >
                        <HiLogout className="text-2xl" />
                        Sign Out
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-3">
                      <Link
                        to="/login"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center h-14 rounded-2xl font-bold text-slate-600 bg-slate-100"
                      >
                        Login
                      </Link>
                      <Link
                        to="/signup"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-center h-14 rounded-2xl font-bold text-white bg-indigo-600 shadow-lg shadow-indigo-500/30"
                      >
                        Sign Up
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;

