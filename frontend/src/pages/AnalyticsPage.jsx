import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import client from '../api/client';
import Card from '../components/Card';
import { 
  MapPin, 
  ChevronDown, 
  BarChart3, 
  ShieldAlert
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip,
  Cell
} from 'recharts';
import { useLanguage } from '../context/LanguageContext';

const AnalyticsPage = () => {
  const { language } = useLanguage();
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);
  const [volatilityData, setVolatilityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMarkets = async () => {
      try {
        const { data } = await client.get('/markets');
        setMarkets(data);
        if (data.length > 0) {
          setSelectedMarket(data[0]);
        }
      } catch (e) {
        console.error("Failed to load markets");
      }
    };
    fetchMarkets();
  }, []);

  useEffect(() => {
    if (!selectedMarket) return;
    const fetchVolatility = async () => {
      setLoading(true);
      try {
        const { data } = await client.get(`/analytics/volatility?market_id=${selectedMarket.market_id}`);
        const formatted = data.slice(0, 8).map(item => ({
          commodity: item.commodity_id.replace('-', ' ').toUpperCase(),
          volatility: parseFloat((item.volatility * 100).toFixed(2)),
          value: item.volatility
        }));
        setVolatilityData(formatted);
      } catch (e) {
        console.error("Failed to load volatility analysis");
      } finally {
        setLoading(false);
      }
    };
    fetchVolatility();
  }, [selectedMarket]);

  const t = {
    en: {
      header: "Market Volatility",
      subHeader: "Analyze crop price fluctuations to evaluate risk and stability across Nepal.",
      volatilityTitle: "Price Volatility Index",
      volatilityDesc: "Higher percentage indicates higher price fluctuation risk in this market.",
      highRisk: "Fluctuation Risk Index"
    },
    ne: {
      header: "बजार उतारचढाव विश्लेषण",
      subHeader: "नेपालका बजारहरूमा कृषि उपजको मूल्य उतारचढाव र जोखिम विश्लेषण।",
      volatilityTitle: "मूल्य उतारचढाव सूचकांक",
      volatilityDesc: "उच्च प्रतिशतले यस बजारमा बढी मूल्य उतारचढाव जोखिम संकेत गर्दछ।",
      highRisk: "उतारचढाव जोखिम सूचक"
    }
  }[language];

  const colors = ['#166534', '#15803d', '#1e3a8a', '#1d4ed8', '#b45309', '#d97706', '#be123c', '#e11d48'];

  return (
    <div className="p-8 space-y-8 max-w-[1200px] mx-auto pt-24 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight">{t.header}</h1>
          <p className="text-dark/40 font-medium">{t.subHeader}</p>
        </div>
        
        <div className="relative group min-w-[240px]">
          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40 group-focus-within:text-primary transition-colors z-10" />
          <select
            value={selectedMarket?.market_id || ''}
            onChange={(e) => {
              const m = markets.find(mark => mark.market_id === e.target.value);
              setSelectedMarket(m);
            }}
            className="pl-10 pr-10 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold text-dark/60 outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none shadow-sm cursor-pointer hover:bg-gray-50 w-full"
          >
            {markets.map(m => (
              <option key={m.market_id} value={m.market_id}>{m.name}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40 pointer-events-none" />
        </div>
      </header>

      {/* Volatility Index Bar Chart - Full Width */}
      <Card delay={0.1}>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-bold text-dark">{t.volatilityTitle}</h3>
            <p className="text-xs text-dark/40 mt-1 max-w-xl leading-relaxed">{t.volatilityDesc}</p>
          </div>
          <div className="flex items-center gap-2 p-2 bg-amber-50 text-amber-700 rounded-lg text-[10px] font-black uppercase tracking-wider border border-amber-100">
            <ShieldAlert className="w-4 h-4" />
            {t.highRisk}
          </div>
        </div>

        <div className="h-[400px] w-full">
          {loading ? (
            <div className="w-full h-full flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
            </div>
          ) : volatilityData.length > 0 ? (
            <ResponsiveContainer>
              <BarChart data={volatilityData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="commodity" 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
                />
                <YAxis 
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
                  unit="%"
                />
                <Tooltip 
                  cursor={{ fill: 'transparent' }}
                  contentStyle={{
                    borderRadius: '16px',
                    border: 'none',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                    padding: '12px'
                  }}
                />
                <Bar dataKey="volatility" radius={[8, 8, 0, 0]}>
                  {volatilityData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-dark/30">
              <BarChart3 className="w-12 h-12 mb-2" />
              <p className="font-semibold text-sm">No volatility metrics computed for this hub</p>
            </div>
          )}
        </div>
      </Card>
    </div>
  );
};

export default AnalyticsPage;
