import { Link } from 'react-router-dom';
import { HiHome, HiMail, HiPhone, HiGlobeAlt } from 'react-icons/hi';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <HiHome className="text-white text-lg" />
              </div>
              <span className="text-xl font-bold text-white">FlatFinder</span>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed mb-6">
              Your trusted platform for finding the perfect rental property. Connecting tenants and owners seamlessly.
            </p>
            
            {/* Social Media Icons */}
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors">
                <HiGlobeAlt className="text-slate-300 hover:text-white text-lg" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors">
                <HiGlobeAlt className="text-slate-300 hover:text-white text-lg" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors">
                <HiGlobeAlt className="text-slate-300 hover:text-white text-lg" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-800 hover:bg-indigo-600 flex items-center justify-center transition-colors">
                <HiGlobeAlt className="text-slate-300 hover:text-white text-lg" />
              </a>
            </div>
          </div>

          {/* Navigation Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Navigation</h4>
            <ul className="space-y-2">
              {[
                { to: '/', label: 'Home' },
                { to: '/explore', label: 'About' },
                { to: '/contact', label: 'Contact' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: '/explore', label: 'Explore Properties' },
                { to: '/login', label: 'Login' },
                { to: '/signup', label: 'Sign Up' },
              ].map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className="text-sm text-slate-400 hover:text-indigo-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <HiMail className="text-indigo-400" />
                support@flatfinder.com
              </li>
              <li className="flex items-center gap-2 text-sm text-slate-400">
                <HiPhone className="text-indigo-400" />
                +91 98765 43210
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-slate-800 mt-12 pt-8">
          {/* Verified Network Section */}
          <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
            <div className="flex -space-x-3">
              {[1,2,3,4].map(i => (
                <img key={i} className="w-10 h-10 rounded-full border-2 border-slate-700 shadow-md" src={`https://i.pravatar.cc/100?img=${i+10}`} alt="avatar" />
              ))}
              <div className="w-10 h-10 rounded-full border-2 border-slate-700 bg-indigo-600 flex items-center justify-center text-[10px] text-white font-bold shadow-md">+10k</div>
            </div>
            <div className="text-center">
              <div className="text-white font-bold text-sm">Verified Network</div>
              <div className="text-slate-400 text-xs font-semibold uppercase tracking-wider">Trusted by owners & tenants</div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-sm text-slate-500">© {new Date().getFullYear()} FlatFinder. All rights reserved.</p>
            <div className="flex gap-6">
              <span className="text-sm text-slate-500 hover:text-slate-300 cursor-pointer transition">Privacy Policy</span>
              <span className="text-sm text-slate-500 hover:text-slate-300 cursor-pointer transition">Terms of Service</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
