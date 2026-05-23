import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import client from '../api/client';
import Card from '../components/Card';
import { 
  Bell, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown, 
  Info,
  Calendar,
  MapPin
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

const AlertsPage = () => {
  const { language } = useLanguage();
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);

  const t = {
    en: {
      header: "Market Alerts",
      subHeader: "Stay updated with critical price movements and supply shocks.",
      noAlerts: "No active alerts for your region.",
      types: {
        price_surge: "Price Surge",
        price_drop: "Price Drop",
        supply_shock: "Supply Shock",
        weather: "Weather Warning"
      }
    },
    ne: {
      header: "बजार सूचनाहरू",
      subHeader: "महत्त्वपूर्ण मूल्य वृद्धि र आपूर्ति अवरोधहरूको जानकारी।",
      noAlerts: "तपाईंको क्षेत्रको लागि कुनै सक्रिय सूचना छैन।",
      types: {
        price_surge: "मूल्य वृद्धि",
        price_drop: "मूल्य गिरावट",
        supply_shock: "आपूर्ति अवरोध",
        weather: "मौसम चेतावनी"
      }
    }
  }[language];

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const { data } = await client.get('/alerts');
        setAlerts(data);
      } catch (e) {
        console.error("Failed to fetch alerts");
      } finally {
        setLoading(false);
      }
    };
    fetchAlerts();
  }, []);

  const dummyAlerts = [
    {
      id: 1,
      type: 'price_surge',
      title: language === 'ne' ? 'गोलभेडाको मूल्यमा वृद्धि' : 'Tomato Price Surge',
      message: language === 'ne' ? 'आगामी ४८ घण्टामा काठमाडौंमा गोलभेडाको मूल्य १५% ले बढ्न सक्छ।' : 'Tomato prices in Kathmandu are expected to rise by 15% in the next 48 hours.',
      market: 'Kathmandu',
      date: '2026-05-16',
      severity: 'high'
    },
    {
      id: 2,
      type: 'supply_shock',
      title: language === 'ne' ? 'सडक अवरोध चेतावनी' : 'Road Blockage Alert',
      message: language === 'ne' ? 'पहिरोका कारण सिद्धार्थ राजमार्ग अवरुद्ध भएको छ, आपूर्तिमा ढिलाइ हुन सक्छ।' : 'Siddhartha Highway blocked due to landslide, supply delays expected.',
      market: 'Pokhara',
      date: '2026-05-15',
      severity: 'critical'
    },
    {
      id: 3,
      type: 'weather',
      title: language === 'ne' ? 'भारी वर्षाको चेतावनी' : 'Heavy Rainfall Warning',
      message: language === 'ne' ? 'तराई क्षेत्रमा भारी वर्षाको सम्भावना छ, तरकारी ढुवानीमा असर पर्न सक्छ।' : 'Heavy rainfall predicted in Terai, impacting vegetable transport.',
      market: 'All Markets',
      date: '2026-05-14',
      severity: 'medium'
    }
  ];

  const displayAlerts = alerts.length > 0 ? alerts : dummyAlerts;

  return (
    <div className="p-8 space-y-8 max-w-[1200px] mx-auto pb-20 pt-24">
      <header>
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
            <Bell className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-black text-dark tracking-tight">{t.header}</h1>
        </div>
        <p className="text-dark/40 font-medium ml-13">{t.subHeader}</p>
      </header>

      <div className="space-y-4">
        {displayAlerts.map((alert, i) => (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            key={alert.id}
          >
            <Card className={`border-l-4 ${
              alert.severity === 'critical' ? 'border-l-red-500' : 
              alert.severity === 'high' ? 'border-l-amber-500' : 'border-l-blue-500'
            }`}>
              <div className="flex flex-col md:flex-row justify-between gap-6">
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    alert.severity === 'critical' ? 'bg-red-50 text-red-500' : 
                    alert.severity === 'high' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                  }`}>
                    {alert.type === 'price_surge' ? <TrendingUp className="w-6 h-6" /> : 
                     alert.type === 'price_drop' ? <TrendingDown className="w-6 h-6" /> : 
                     alert.type === 'supply_shock' ? <AlertTriangle className="w-6 h-6" /> : <Info className="w-6 h-6" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-dark mb-1">{alert.title}</h3>
                    <p className="text-dark/60 text-sm leading-relaxed mb-4">{alert.message}</p>
                    <div className="flex flex-wrap gap-4 text-[10px] font-bold uppercase tracking-widest text-dark/30">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5" />
                        {alert.market}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        {new Date(alert.date).toLocaleDateString(language === 'ne' ? 'ne-NP' : 'en-US')}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex md:flex-col justify-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-tighter text-center ${
                    alert.severity === 'critical' ? 'bg-red-50 text-red-500' : 
                    alert.severity === 'high' ? 'bg-amber-50 text-amber-500' : 'bg-blue-50 text-blue-500'
                  }`}>
                    {alert.severity}
                  </span>
                </div>
              </div>
            </Card>
          </motion.div>
        ))}

        {displayAlerts.length === 0 && !loading && (
          <div className="text-center py-20 bg-white/50 rounded-[32px] border border-dashed border-gray-200">
            <Bell className="w-12 h-12 text-dark/10 mx-auto mb-4" />
            <p className="text-dark/40 font-bold">{t.noAlerts}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertsPage;
