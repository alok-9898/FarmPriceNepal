import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  TrendingUp, 
  ShoppingCart,
  BarChart3, 
  Settings, 
  Leaf,
  Bell
} from 'lucide-react';

import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const Sidebar = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const role = user?.role || 'farmer';
  
  const roleSpecificNav = {
    farmer: {
      ne: [
        { name: 'मेरो बाली', path: '/commodities', icon: Leaf },
        { name: 'मौसम र सुझाव', path: '/alerts', icon: Bell },
      ],
      en: [
        { name: 'My Crops', path: '/commodities', icon: Leaf },
        { name: 'Weather & Advisory', path: '/alerts', icon: Bell },
      ]
    },
    trader: {
      ne: [
        { name: 'थोक बजार', path: '/commodities', icon: ShoppingCart },
        { name: 'व्यापार अवसर', path: '/forecast', icon: BarChart3 },
      ],
      en: [
        { name: 'Wholesale Market', path: '/commodities', icon: ShoppingCart },
        { name: 'Trading Opportunities', path: '/forecast', icon: BarChart3 },
      ]
    },
    consumer: {
      ne: [
        { name: 'विस्तृत विश्लेषण', path: '/analytics', icon: BarChart3 },
        { name: 'डाटा रिपोर्ट', path: '/alerts', icon: Bell },
      ],
      en: [
        { name: 'Advanced Analytics', path: '/analytics', icon: BarChart3 },
        { name: 'Data Reports', path: '/alerts', icon: Bell },
      ]
    }
  };

  const navItems = {
    ne: [
      { name: 'ड्यासबोर्ड', path: '/dashboard', icon: LayoutDashboard },
      { name: 'मूल्य अनुमान', path: '/forecast', icon: TrendingUp },
      ...(roleSpecificNav[role]?.ne || roleSpecificNav.farmer.ne),
    ],
    en: [
      { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
      { name: 'Price Forecast', path: '/forecast', icon: TrendingUp },
      ...(roleSpecificNav[role]?.en || roleSpecificNav.farmer.en),
    ]
  }[language];

  return (
    <aside className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-white/80 backdrop-blur-md border-r border-slate-200 p-6 flex flex-col z-40 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="flex-1 space-y-2">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-300 group
              ${isActive 
                ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                : 'text-dark/60 hover:bg-gray-50 hover:text-primary'}
            `}
          >
            <item.icon className="w-5 h-5 transition-transform group-hover:scale-110" />
            <span className="font-medium whitespace-nowrap">{item.name}</span>
          </NavLink>
        ))}
      </div>

      <div className="space-y-2 pt-6 border-t border-gray-100">
        <NavLink to="/settings" className="flex items-center gap-3 px-4 py-3 rounded-xl text-dark/60 hover:bg-gray-50 hover:text-primary transition-all">
          <Settings className="w-5 h-5" />
          <span className="font-medium whitespace-nowrap">{language === 'ne' ? 'सेटिङहरू' : 'Settings'}</span>
        </NavLink>
        
        <div className="mt-4 p-4 bg-emerald-50 rounded-2xl relative overflow-hidden group">
          <Leaf className="absolute -right-2 -bottom-2 w-16 h-16 text-emerald-100 rotate-12 transition-transform group-hover:rotate-45" />
          <h4 className="text-xs font-bold text-primary uppercase tracking-widest mb-1 relative z-10">
            {language === 'ne' ? 'नेपाल एग्रो' : 'Nepal Agri'}
          </h4>
          <p className="text-[10px] text-primary/70 relative z-10">
            {language === 'ne' 
              ? 'टिकाऊ भविष्यको लागि एआई-सञ्चालित अन्तर्दृष्टि।' 
              : 'AI-powered insights for a sustainable future.'}
          </p>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
