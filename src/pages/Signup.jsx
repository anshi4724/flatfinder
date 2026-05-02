import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { HiMail, HiLockClosed, HiUser, HiBadgeCheck, HiShieldCheck } from 'react-icons/hi';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '', role: 'seeker' });
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error('Passwords do not match');
    }
    setLoading(true);
    const res = await signup(formData);
    setLoading(false);
    if (res.success) {
      navigate('/');
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] flex flex-col items-center justify-center p-4 relative overflow-hidden w-full pt-16 pb-16">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse"></div>
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] bg-fuchsia-600/10 rounded-full blur-[140px]"></div>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg relative z-10"
      >
        <div className="text-center mb-8">
           <h2 className="text-4xl font-black text-white tracking-tight mb-2">
             Create an <span className="text-indigo-500">Account</span>
           </h2>
           <p className="text-slate-400 font-medium">Join our verified network of premium properties.</p>
        </div>

        <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[2.5rem] p-8 sm:p-10 shadow-2xl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Full Name</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiUser className="text-slate-500 text-xl group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    name="name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-700 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-medium"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Email Address</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiMail className="text-slate-500 text-xl group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-700 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-medium"
                    placeholder="you@email.com"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiLockClosed className="text-slate-500 text-xl group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    minLength="6"
                    className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-700 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">Confirm Password</label>
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <HiLockClosed className="text-slate-500 text-xl group-focus-within:text-indigo-400 transition-colors" />
                  </div>
                  <input
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    minLength="6"
                    className="block w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white placeholder-slate-700 focus:ring-2 focus:ring-indigo-500/50 outline-none transition-all font-medium"
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-black text-slate-500 uppercase tracking-widest ml-1 mb-2">I am a...</label>
              <div className="grid grid-cols-2 gap-4">
                <label className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${formData.role === 'seeker' ? 'bg-indigo-600/20 border-indigo-500 ring-4 ring-indigo-500/10' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                  <input type="radio" name="role" value="seeker" checked={formData.role === 'seeker'} onChange={handleChange} className="sr-only" />
                  <HiUser className={`text-3xl mb-2 ${formData.role === 'seeker' ? 'text-white' : 'text-slate-500'}`} />
                  <span className={`text-xs font-black uppercase tracking-widest ${formData.role === 'seeker' ? 'text-white' : 'text-slate-500'}`}>Seeker</span>
                </label>

                <label className={`relative flex flex-col items-center justify-center p-6 border-2 rounded-2xl cursor-pointer transition-all duration-300 ${formData.role === 'owner' ? 'bg-indigo-600/20 border-indigo-500 ring-4 ring-indigo-500/10' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                  <input type="radio" name="role" value="owner" checked={formData.role === 'owner'} onChange={handleChange} className="sr-only" />
                  <HiBadgeCheck className={`text-3xl mb-2 ${formData.role === 'owner' ? 'text-white' : 'text-slate-500'}`} />
                  <span className={`text-xs font-black uppercase tracking-widest ${formData.role === 'owner' ? 'text-white' : 'text-slate-500'}`}>Owner</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group overflow-hidden py-4 px-4 bg-white text-[#030712] rounded-2xl font-black text-lg shadow-xl hover:shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:-translate-y-1 active:scale-95 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? 'Processing...' : 'Create Account'}
            </button>
          </form>

          <div className="mt-8 text-center border-t border-white/5 pt-8">
            <span className="text-sm text-slate-500 font-medium">Already have an account? </span>
            <Link to="/login" className="text-sm font-black text-indigo-400 hover:text-indigo-300 transition-colors underline decoration-2 underline-offset-4">
              Sign In
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
