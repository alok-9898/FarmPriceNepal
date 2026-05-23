import React from 'react';
import { motion } from 'framer-motion';
import Card from '../components/Card';
import { useLanguage } from '../context/LanguageContext';
import { Globe, CheckCircle2, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { language, toggleLanguage } = useLanguage();
  const { user, logout } = useAuth();

  const t = {
    en: {
      title: 'Settings',
      desc: 'Manage your portal preferences and language.',
      langTitle: 'Language Preference',
      langDesc: 'Select your preferred language for the interface.',
      nepali: 'Nepali (नेपाली)',
      english: 'English',
      success: 'Language updated successfully!',
      account: 'Account & Security',
      logout: 'Log Out',
      logoutDesc: 'Sign out of your current session securely.',
      currentPortal: 'Current Portal'
    },
    ne: {
      title: 'सेटिङहरू (Settings)',
      desc: 'तपाईंको प्रोफाइल र भाषा सेटिङहरू मिलाउनुहोस्।',
      langTitle: 'भाषा छनौट (Language Preference)',
      langDesc: 'प्रणालीको लागि आफ्नो मनपर्ने भाषा छान्नुहोस्।',
      nepali: 'नेपाली (Nepali)',
      english: 'अंग्रेजी (English)',
      success: 'भाषा सफलतापूर्वक परिवर्तन गरियो!',
      account: 'खाता र सुरक्षा',
      logout: 'लग आउट गर्नुहोस्',
      logoutDesc: 'तपाईंको हालको सत्र सुरक्षित रूपमा समाप्त गर्नुहोस्।',
      currentPortal: 'हालको पोर्टल'
    }
  }[language];

  return (
    <div className="p-8 space-y-8 max-w-[800px] mx-auto pt-24">
      <header>
        <h1 className="text-3xl font-black text-dark tracking-tight">{t.title}</h1>
        <p className="text-dark/40 font-medium">{t.desc}</p>
      </header>

      <Card className="mb-8 border-primary/10 bg-gradient-to-br from-emerald-50/50 to-white shadow-soft">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-24 h-24 bg-primary text-white rounded-[32px] flex items-center justify-center text-4xl font-black shadow-lg shadow-primary/20 shrink-0 rotate-3 transition-transform hover:rotate-0">
            {user?.name?.[0] || 'U'}
          </div>
          <div className="text-center sm:text-left flex-1">
            <h2 className="text-2xl font-black text-dark mb-1">{user?.name || 'User Name'}</h2>
            <p className="text-dark/50 font-medium mb-4">{user?.email || 'user@example.com'}</p>
            
            <div className="inline-flex items-center gap-3 px-4 py-3 bg-white rounded-xl border border-gray-100 shadow-sm">
              <span className="text-xs font-bold text-dark/40 uppercase tracking-widest">{t.currentPortal}:</span>
              <span className="text-sm font-black text-primary capitalize px-3 py-1 bg-emerald-50 rounded-lg">
                {language === 'ne' 
                  ? (user?.role === 'farmer' ? 'किसान (Farmer)' : user?.role === 'trader' ? 'व्यापारी (Trader)' : user?.role === 'cooperative' ? 'सहकारी (Cooperative)' : user?.role === 'analyst' ? 'विश्लेषक (Analyst)' : user?.role)
                  : (user?.role || 'Unknown')}
              </span>
            </div>
          </div>
        </div>
      </Card>

      <Card className="space-y-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 bg-emerald-50 text-primary rounded-2xl">
            <Globe className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-dark">{t.langTitle}</h3>
            <p className="text-sm text-dark/40 font-medium">{t.langDesc}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => toggleLanguage('ne')}
            className={`
              p-6 rounded-[24px] border-2 transition-all flex flex-col items-center gap-3
              ${language === 'ne' 
                ? 'border-primary bg-emerald-50 text-primary' 
                : 'border-gray-100 hover:border-gray-200 text-dark/40'}
            `}
          >
            <span className="text-2xl font-black">क</span>
            <span className="font-bold">{t.nepali}</span>
            {language === 'ne' && <CheckCircle2 className="w-5 h-5" />}
          </button>

          <button
            onClick={() => toggleLanguage('en')}
            className={`
              p-6 rounded-[24px] border-2 transition-all flex flex-col items-center gap-3
              ${language === 'en' 
                ? 'border-primary bg-emerald-50 text-primary' 
                : 'border-gray-100 hover:border-gray-200 text-dark/40'}
            `}
          >
            <span className="text-2xl font-black">A</span>
            <span className="font-bold">{t.english}</span>
            {language === 'en' && <CheckCircle2 className="w-5 h-5" />}
          </button>
        </div>
      </Card>

      <Card className="space-y-6 border-red-50 bg-red-50/10">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-red-50 text-red-600 rounded-2xl">
              <LogOut className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-dark">{t.account}</h3>
              <p className="text-sm text-dark/40 font-medium">{t.logoutDesc}</p>
            </div>
          </div>
          <button
            onClick={logout}
            className="px-6 py-3 bg-red-600 text-white font-black rounded-xl hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 active:scale-95"
          >
            {t.logout}
          </button>
        </div>
      </Card>

      <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100">
        <p className="text-xs text-dark/40 text-center font-medium italic">
          Tip: Your language preference is saved automatically for your next visit.
        </p>
      </div>
    </div>
  );
};

export default SettingsPage;
