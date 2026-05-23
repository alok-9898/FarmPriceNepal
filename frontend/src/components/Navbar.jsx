import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { motion } from 'framer-motion';
import { LayoutDashboard, TrendingUp, Bell, PieChart, Settings, LogOut, Search } from 'lucide-react';
import Button from './Button';

import { useLanguage } from '../context/LanguageContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const t = {
    en: {
      home: "Home",
      login: "Login",
      start: "Get Started",
      search: "Search...",
      farmer: "Farmer",
      logout: "Logout"
    },
    ne: {
      home: "गृहपृष्ठ",
      login: "लगइन",
      start: "सुरु गर्नुहोस्",
      search: "खोज्नुहोस्...",
      farmer: "किसान",
      logout: "लगआउट"
    }
  }[language];

  const isAuthPage = ['/login', '/register', '/'].includes(location.pathname) && !user;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 h-16">
      <div className="max-w-7xl mx-auto h-full px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <motion.div 
            whileHover={{ rotate: 10 }}
            className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold"
          >
            F
          </motion.div>
          <span className="text-xl font-extrabold tracking-tight text-dark">
            FarmPrice<span className="text-primary">Nepal</span>
          </span>
        </Link>

        <div className="flex items-center gap-6">
          {!user ? (
            <>
              <Link to="/" className="text-sm font-medium text-dark/70 hover:text-primary transition-colors">{t.home}</Link>
              <Link to="/login" className="text-sm font-medium text-dark/70 hover:text-primary transition-colors">{t.login}</Link>
              <Button onClick={() => navigate('/register')} size="sm">{t.start}</Button>
            </>
          ) : (
            <>
              <div className="relative hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40" />
                <input 
                  type="text" 
                  placeholder={t.search}
                  className="pl-10 pr-4 py-2 bg-gray-100 rounded-full text-sm outline-none focus:ring-1 focus:ring-primary/20 transition-all w-64"
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.1 }} 
                className="p-2 bg-gray-100 rounded-full text-dark/60 relative"
                onClick={() => logout()}
                title={t.logout}
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
              <div className="flex items-center gap-3 pl-4 border-l border-gray-100">
                <div className="text-right hidden sm:block">
                  <p className="text-xs font-bold text-dark">{user.name}</p>
                  <p className="text-[10px] text-dark/50 uppercase tracking-wider">
                    {language === 'ne' 
                      ? (user.role === 'farmer' ? 'किसान' : user.role === 'trader' ? 'व्यापारी' : user.role)
                      : (user.role.charAt(0).toUpperCase() + user.role.slice(1))
                    }
                  </p>
                </div>
                <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-700 font-bold border-2 border-white shadow-sm">
                  {user.name[0]}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
