import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../api/client';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  ChevronDown, 
  MapPin, 
  Leaf, 
  Calendar, 
  ArrowRight,
  Zap,
  Info,
  ShieldCheck,
  TrendingUp,
  CloudRain
} from 'lucide-react';
import ForecastChart from '../components/ForecastChart';
import { useLanguage } from '../context/LanguageContext';

const ForecastPage = () => {
  const { language } = useLanguage();
  const [markets, setMarkets] = useState([]);
  const [commodities, setCommodities] = useState([]);
  const [selectedMarket, setSelectedMarket] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('');
  const [horizon, setHorizon] = useState(7);
  const [forecast, setForecast] = useState(null);
  const [historical, setHistorical] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mRes, cRes] = await Promise.all([
          client.get('/markets'),
          client.get('/commodities')
        ]);
        setMarkets(mRes.data);
        setCommodities(cRes.data);
        if (mRes.data.length) setSelectedMarket(mRes.data[0].market_id);
        if (cRes.data.length) setSelectedCommodity(cRes.data[0].commodity_id);
      } catch (e) {
        console.error("Data fetch failed");
      }
    };
    fetchData();
  }, []);

  const handleGetForecast = async () => {
    setLoading(true);
    try {
      const [fRes, hRes] = await Promise.all([
        client.get(`/forecast?market_id=${selectedMarket}&commodity_id=${selectedCommodity}&horizon=${horizon}`),
        client.get(`/prices?market_id=${selectedMarket}&commodity_id=${selectedCommodity}`)
      ]);
      setForecast(fRes.data);
      setHistorical(hRes.data.reverse());
    } catch (e) {
      console.error("Forecast failed");
    } finally {
      setLoading(false);
    }
  };

  const horizons = [
    { label: '1 Day', val: 1 },
    { label: '7 Days', val: 7 },
    { label: '30 Days', val: 30 }
  ];

  const t = {
    en: {
      header: "Price Forecast",
      subHeader: "AI-driven analysis of market future and price volatility.",
      market: "Market",
      commodity: "Commodity",
      horizon: "Horizon",
      h1: "1 Day",
      h7: "7 Days",
      h30: "30 Days",
      generate: "Generate Prediction",
      analyzing: "Analyzing...",
      accuracy: "AI Accuracy",
      accuracyDesc: "Our system is based on daily data from the Kalimati Market Board.",
      ready: "Ready to Analyze",
      readyDesc: "Select a commodity and market to see data.",
      projection: "Price Projection",
      predictedFor: "Predicted price for",
      in: "in",
      aiInsight: "AI Insight & Explanation",
      external: "External Factors",
      monsoon: "Monsoon Risk",
      road: "Road Connectivity",
      high: "HIGH",
      stable: "STABLE",
      weatherDesc: "Weather systems in central Nepal may impact the supply corridor.",
      currency: "Rs"
    },
    ne: {
      header: "मूल्य अनुमान",
      subHeader: "बजारको भविष्य र भाउको उतारचढाव बारे एआई विश्लेषण।",
      market: "मुख्य बजार",
      commodity: "कृषि उपज",
      horizon: "अनुमानित दिन",
      h1: "१ दिन",
      h7: "७ दिन",
      h30: "३० दिन",
      generate: "अनुमान हेर्नुहोस्",
      analyzing: "विश्लेषण गर्दै...",
      accuracy: "एआईको शुद्धता",
      accuracyDesc: "हाम्रो प्रणाली कालीमाटी फलफूल तथा तरकारी बजार विकास समितिको दैनिक तथ्याङ्कमा आधारित छ।",
      ready: "विश्लेषणका लागि तयार",
      readyDesc: "तथ्याङ्क हेर्नका लागि कृषि उपज र बजार छान्नुहोस्।",
      projection: "मूल्य अनुमान प्रोजेक्सन",
      predictedFor: "अनुमानित भाउ:",
      in: "बजार:",
      aiInsight: "एआई विश्लेषण र कारणहरू",
      external: "बाह्य कारकहरू",
      monsoon: "मनसुन जोखिम",
      road: "सडक सम्पर्क",
      high: "उच्च",
      stable: "स्थिर",
      weatherDesc: "मध्य नेपालमा आउने मौसम प्रणालीले आपूर्ति करिडोरलाई असर गर्न सक्छ।",
      currency: "रू"
    }
  }[language];

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto pb-20 pt-24">
      <header className="space-y-2">
        <h1 className="text-4xl font-black text-dark tracking-tight">{t.header}</h1>
        <p className="text-lg text-dark/40 font-medium">{t.subHeader}</p>
      </header>

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Input Panel */}
        <div className="lg:col-span-1 space-y-6">
          <Card className="space-y-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-dark/40 uppercase tracking-widest ml-1">{t.market}</label>
              <div className="relative group">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/20 group-focus-within:text-primary transition-colors" />
                <select 
                  value={selectedMarket} 
                  onChange={(e) => setSelectedMarket(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all text-dark font-bold appearance-none"
                >
                  {markets.map(m => <option key={m.market_id} value={m.market_id}>{m.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/20 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-dark/40 uppercase tracking-widest ml-1">{t.commodity}</label>
              <div className="relative group">
                <Leaf className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-dark/20 group-focus-within:text-primary transition-colors" />
                <select 
                  value={selectedCommodity} 
                  onChange={(e) => setSelectedCommodity(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-gray-50 rounded-2xl border-none outline-none focus:ring-2 focus:ring-primary/20 transition-all text-dark font-bold appearance-none"
                >
                  {commodities.map(c => <option key={c.commodity_id} value={c.commodity_id}>{c.name}</option>)}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/20 pointer-events-none" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-dark/40 uppercase tracking-widest ml-1">{t.horizon}</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { label: t.h1, val: 1 },
                  { label: t.h7, val: 7 },
                  { label: t.h30, val: 30 }
                ].map((h) => (
                  <button
                    key={h.val}
                    onClick={() => setHorizon(h.val)}
                    className={`
                      py-3 rounded-xl text-xs font-bold transition-all
                      ${horizon === h.val 
                        ? 'bg-primary text-white shadow-lg shadow-primary/20' 
                        : 'bg-gray-50 text-dark/40 hover:bg-gray-100'}
                    `}
                  >
                    {h.label}
                  </button>
                ))}
              </div>
            </div>

            <Button onClick={handleGetForecast} size="lg" className="w-full group" disabled={loading}>
              {loading ? t.analyzing : t.generate}
              {!loading && <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />}
            </Button>
          </Card>

          <Card className="bg-emerald-50 border-emerald-100">
            <h4 className="text-sm font-bold text-primary flex items-center gap-2 mb-3">
              <ShieldCheck className="w-4 h-4" />
              {t.accuracy}
            </h4>
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold text-primary/60 uppercase">
                <span>Accuracy</span>
                <span>८९%</span>
              </div>
              <div className="h-1.5 w-full bg-white rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: '89%' }}
                  className="h-full bg-primary" 
                />
              </div>
              <p className="text-[10px] text-primary/40 leading-relaxed pt-1">
                {t.accuracyDesc}
              </p>
            </div>
          </Card>
        </div>

        {/* Output Panel */}
        <div className="lg:col-span-3">
          <AnimatePresence mode="wait">
            {!forecast ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="h-full min-h-[500px] flex flex-col items-center justify-center bg-gray-50 rounded-[32px] border-2 border-dashed border-gray-200 p-12 text-center"
              >
                <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-soft mb-6">
                  <TrendingUp className="w-10 h-10 text-primary/20" />
                </div>
                <h3 className="text-xl font-bold text-dark/60 mb-2">{t.ready}</h3>
                <p className="text-dark/30 max-w-xs font-medium">{t.readyDesc}</p>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
              >
                <Card className="relative overflow-hidden">
                  <div className="flex justify-between items-center mb-10">
                    <div>
                      <h3 className="text-2xl font-bold text-dark">{t.projection}</h3>
                      <p className="text-dark/40 font-medium">{t.predictedFor} {selectedCommodity.toUpperCase()} {t.in} {selectedMarket.toUpperCase()}</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-primary rounded-full text-xs font-black uppercase tracking-widest border border-emerald-100">
                      <Zap className="w-4 h-4" />
                      {forecast.model_used}
                    </div>
                  </div>

                  <div className="h-[400px]">
                    <ForecastChart data={forecast.predictions} historicalData={historical} />
                  </div>
                </Card>

                <div className="grid md:grid-cols-2 gap-8">
                  <Card className="bg-dark text-white border-none">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-white/10 rounded-xl text-accent">
                        <Zap className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold">{t.aiInsight}</h3>
                    </div>
                    <p className="text-white/60 leading-relaxed font-medium">
                      {forecast.explanation}
                    </p>
                  </Card>

                  <Card className="bg-amber-50 border-amber-100">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 bg-amber-100 rounded-xl text-amber-600">
                        <CloudRain className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-amber-900">{t.external}</h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-amber-900/60 uppercase tracking-wider">{t.monsoon}</span>
                        <span className="text-sm font-black text-amber-600">{t.high}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-amber-900/60 uppercase tracking-wider">{t.road}</span>
                        <span className="text-sm font-black text-amber-600">{t.stable}</span>
                      </div>
                      <p className="text-xs text-amber-900/40 leading-relaxed">
                        {t.weatherDesc}
                      </p>
                    </div>
                  </Card>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ForecastPage;
