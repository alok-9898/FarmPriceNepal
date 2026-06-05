import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import client from '../api/client';
import Card from '../components/Card';
import {
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  MapPin,
  ShoppingCart,
  Calendar,
  ArrowUpRight,
  Zap,
  Leaf,
  ChevronDown,
  Bell
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const dummyTrend = [
  { day: 'Mon', price: 65 }, { day: 'Tue', price: 68 }, { day: 'Wed', price: 72 },
  { day: 'Thu', price: 70 }, { day: 'Fri', price: 85 }, { day: 'Sat', price: 82 }, { day: 'Sun', price: 90 }
];

const Dashboard = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const role = user?.role || 'farmer';
  const [summary, setSummary] = useState({
    total_markets: 0,
    total_commodities: 0,
    latest_data_points: 0,
    active_models: 0
  });
  const [trendingItems, setTrendingItems] = useState([]);
  const [historicalData, setHistoricalData] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [sumRes, comRes, priceRes, markRes] = await Promise.all([
          client.get('/analytics/summary'),
          client.get('/commodities'),
          client.get(`/prices?limit=50${selectedMarket ? `&market_id=${selectedMarket.market_id}` : ''}`),
          client.get('/markets')
        ]);
        setSummary(sumRes.data);
        setTrendingItems(comRes.data.slice(0, 3));
        setMarkets(markRes.data);
        if (!selectedMarket && markRes.data.length > 0) setSelectedMarket(markRes.data[0]);

        // Group by date and take the average or last entry to avoid "wall of bars"
        const dailyData = {};
        priceRes.data.forEach(p => {
          const date = new Date(p.date).toLocaleDateString();
          if (!dailyData[date]) {
            dailyData[date] = p;
          }
        });

        const formattedPrices = Object.values(dailyData).slice(0, 7).reverse().map(p => ({
          day: new Date(p.date).toLocaleDateString(language === 'ne' ? 'ne-NP' : 'en-US', { weekday: 'short' }),
          price: p.price_npr
        }));
        setHistoricalData(formattedPrices);
      } catch (e) {
        console.error("Failed to fetch dashboard data");
      }
    };
    fetchData();
  }, [language, selectedMarket?.market_id]);

  const t = {
    ne: {
      stat1: "आजको औसत भाउ",
      stat2: "भोलिको अनुमान",
      stat3: "साप्ताहिक ट्रेन्ड",
      stat4: "जोखिम सूचक",
      bullish: "बढ्दो",
      moderate: "मध्यम",
      stability: "स्थिरता",
      header: "बजार ड्यासबोर्ड",
      subHeader: "आजको विवरण",
      location: "काठमाडौं उपत्यका",
      comparison: "अघिल्लो तुलनामा",
      trendsTitle: "मूल्यको उतारचढाव",
      trendsSub: "७ दिनको बजार दर विश्लेषण",
      price: "भाउ",
      supply: "आपूर्ति",
      aiTitle: "एआई सल्लाह",
      aiInsight: "काठमाडौंमा गोलभेडाको भाउ आगामी ४ दिनमा १२% ले बढ्न सक्छ। काभ्रे सडक अवरोधले आपूर्तिमा कमी आउने सम्भावना छ।",
      confidence: "शुद्धता",
      trending: "बढी माग भएका वस्तु",
      tomato: "गोलभेडा",
      onion: "प्याज",
      potato: "आलु",
      currency: "रू"
    },
    en: {
      stat1: "Today's Avg Price",
      stat2: "Tomorrow Forecast",
      stat3: "Weekly Trend",
      stat4: "Risk Indicator",
      bullish: "Bullish",
      moderate: "Moderate",
      stability: "Stability",
      header: "Market Dashboard",
      subHeader: "Today's Overview",
      location: "Kathmandu Valley",
      comparison: "vs last period",
      trendsTitle: "Price Trends (7-Day)",
      trendsSub: "Aggregated market index analysis",
      price: "Price",
      supply: "Supply",
      aiTitle: "AI Insight",
      aiInsight: "Kathmandu Tomato prices are projected to increase by 12% over the next 4 days due to heavy rainfall in the supply corridor.",
      confidence: "Confidence",
      trending: "High Demand Commodities",
      tomato: "Tomato (गोलभेडा)",
      onion: "Onion (प्याज)",
      potato: "Potato (आलु)",
      currency: "Rs"
    }
  }[language];

  const headers = {
    farmer: language === 'ne' ? 'किसान ड्यासबोर्ड' : 'Farmer Dashboard',
    trader: language === 'ne' ? 'व्यापारी ड्यासबोर्ड' : 'Trader Dashboard',
    consumer: language === 'ne' ? 'उपभोक्ता ड्यासबोर्ड' : 'Consumer Dashboard',
  };

  const roleSpecificStats = {
    farmer: [
      { title: language === 'ne' ? 'कुल बाली' : 'Total Crops', value: 3, trend: "+१", icon: Leaf, color: "text-emerald-600", bg: "bg-emerald-50" },
      { title: language === 'ne' ? 'मौसम जोखिम' : 'Weather Risk', value: language === 'ne' ? 'कम' : 'Low', trend: language === 'ne' ? 'सुरक्षित' : 'Safe', icon: AlertTriangle, color: "text-blue-600", bg: "bg-blue-50" },
    ],
    trader: [
      { title: language === 'ne' ? 'कुल माग' : 'Total Demand', value: language === 'ne' ? '२.५ टन' : '2.5 Ton', trend: "+१२%", icon: ShoppingCart, color: "text-emerald-600", bg: "bg-emerald-50" },
      { title: language === 'ne' ? 'नयाँ अर्डर' : 'New Orders', value: 8, trend: language === 'ne' ? 'प्रतीक्षामा' : 'Pending', icon: Bell, color: "text-blue-600", bg: "bg-blue-50" },
    ],
    consumer: [
      { title: language === 'ne' ? 'कुल बजार' : 'Total Markets', value: summary.total_markets, trend: language === 'ne' ? 'सक्रिय' : 'Active', icon: MapPin, color: "text-blue-600", bg: "bg-blue-50" },
      { title: language === 'ne' ? 'सक्रिय मोडल' : 'Active Models', value: summary.active_models || 4, trend: "१००%", icon: Zap, color: "text-emerald-600", bg: "bg-emerald-50" },
    ]
  };

  const stats = [
    { title: t.stat1, value: `${t.currency} ८२.५`, trend: "+४.२%", icon: ShoppingCart, color: "text-primary", bg: "bg-emerald-50" },
    { title: t.stat2, value: `${t.currency} ८८.२`, trend: "+६.९%", icon: Zap, color: "text-amber-600", bg: "bg-amber-50" },
    ...(roleSpecificStats[role] || roleSpecificStats.farmer)
  ];

  const getEmoji = (name) => {
    const n = name.toLowerCase();
    if (n.includes('tomato') || n.includes('गोलभेडा')) return '🍅';
    if (n.includes('potato') || n.includes('आलु')) return '🥔';
    if (n.includes('onion') || n.includes('प्याज')) return '🧅';
    if (n.includes('cabbage') || n.includes('बन्दा')) return '🥬';
    if (n.includes('cauli') || n.includes('काउली')) return '🥦';
    if (n.includes('ginger') || n.includes('अदुवा')) return '🫚';
    if (n.includes('garlic') || n.includes('लसुन')) return '🧄';
    if (n.includes('chilli') || n.includes('खुर्सानी')) return '🌶️';
    return '🥗';
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto pt-24">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-dark tracking-tight">{headers[role] || t.header}</h1>
          <p className="text-dark/40 font-medium flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            {t.subHeader}: {new Date().toLocaleDateString(language === 'ne' ? 'ne-NP' : 'en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </div>
        <div className="flex gap-3">
          <div className="relative group">
            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40 group-focus-within:text-primary transition-colors z-10" />
            <select
              value={selectedMarket?.market_id || ''}
              onChange={(e) => {
                const m = markets.find(mark => mark.market_id === e.target.value);
                setSelectedMarket(m);
              }}
              className="pl-10 pr-10 py-3 bg-white border border-gray-100 rounded-xl text-sm font-bold text-dark/60 outline-none focus:ring-2 focus:ring-primary/10 transition-all appearance-none shadow-sm cursor-pointer hover:bg-gray-50 min-w-[220px]"
            >
              <option value="" disabled>{language === 'ne' ? 'मुख्य बजार छान्नुहोस्' : 'Select Main Market'}</option>
              {markets.map(m => (
                <option key={m.market_id} value={m.market_id}>{m.name}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/40 pointer-events-none" />
          </div>
        </div>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} delay={i * 0.1} className="relative overflow-hidden group">
            <div className={`absolute top-0 right-0 p-4 ${stat.bg} rounded-bl-[32px] transition-transform group-hover:scale-110`}>
              <stat.icon className={`w-6 h-6 ${stat.color}`} />
            </div>
            <p className="text-xs font-bold text-dark/40 uppercase tracking-widest mb-1">{stat.title}</p>
            <h3 className="text-2xl font-black text-dark mb-2">{stat.value}</h3>
            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-2 py-1 rounded-full ${stat.color} ${stat.bg}`}>
                {stat.trend}
              </span>
              <span className="text-[10px] text-dark/30 font-bold uppercase">{t.comparison}</span>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Main Chart */}
        <Card className="lg:col-span-2" delay={0.4}>
          <div className="flex justify-between items-center mb-8">
            <div>
              <h3 className="text-xl font-bold text-dark">{t.trendsTitle}</h3>
              <p className="text-sm text-dark/40">{t.trendsSub}</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 rounded-lg border border-emerald-100">
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] font-black text-primary uppercase tracking-widest">{t.price} ({t.currency})</span>
            </div>
          </div>

          <div className="h-[400px] w-full">
            <ResponsiveContainer>
              <AreaChart data={historicalData.length > 0 ? historicalData : dummyTrend}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#166534" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#166534" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                  dy={10}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 12, fill: '#64748b', fontWeight: 600 }}
                  dx={-10}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: '20px',
                    border: 'none',
                    boxShadow: '0 20px 50px rgba(0,0,0,0.1)',
                    padding: '20px'
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#166534"
                  strokeWidth={4}
                  fillOpacity={1}
                  fill="url(#colorPrice)"
                  dot={{ r: 6, fill: '#166534', strokeWidth: 3, stroke: '#fff' }}
                  activeDot={{ r: 8, strokeWidth: 0 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          <Card delay={0.5} className="bg-dark text-white">
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-accent" />
              {t.aiTitle}
            </h3>
            <p className="text-white/60 text-sm leading-relaxed mb-6">
              {t.aiInsight}
            </p>
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/10">
              <span className="text-xs font-bold text-white/40 uppercase tracking-widest">{t.confidence}</span>
              <span className="text-sm font-bold text-emerald-400">९२.४%</span>
            </div>
          </Card>

          <Card delay={0.6}>
            <h3 className="text-lg font-bold text-dark mb-4">{t.trending}</h3>
            <div className="space-y-4">
              {trendingItems.map((item, i) => (
                <div key={i} className="flex items-center justify-between p-3 rounded-2xl hover:bg-gray-50 transition-all cursor-pointer group">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-100 rounded-xl flex items-center justify-center text-xl">
                      {getEmoji(item.name)}
                    </div>
                    <div>
                      <p className="text-sm font-bold text-dark">
                        {language === 'en'
                          ? (item.name.includes('(') ? item.name : `${item.name} (${item.name_ne || ''})`.replace(' ()', ''))
                          : (item.name_ne || item.name)
                        }
                      </p>
                      <p className="text-[10px] font-bold text-dark/30 uppercase tracking-wider">{t.currency} {item.price || 85}/kg</p>
                    </div>
                  </div>
                  <div className={`p-2 rounded-lg bg-emerald-50 text-primary`}>
                    <TrendingUp className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
