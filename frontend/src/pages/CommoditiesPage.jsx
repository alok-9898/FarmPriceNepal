import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import client from '../api/client';
import Card from '../components/Card';
import Button from '../components/Button';
import { 
  Plus, 
  MapPin, 
  TrendingUp, 
  Zap, 
  Search,
  Filter,
  ArrowUpRight,
  TrendingDown,
  Leaf,
  Warehouse,
  ClipboardList,
  Download,
  Trash,
  AlertCircle
} from 'lucide-react';
import { ResponsiveContainer, LineChart, Line } from 'recharts';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

const sparklineData = [
  { val: 10 }, { val: 15 }, { val: 12 }, { val: 18 }, { val: 14 }, { val: 20 }, { val: 25 }
];

const CommodityCard = ({ name, price, trend, icon, delay, currency, t, onClick }) => (
  <Card delay={delay} className="group relative overflow-hidden cursor-pointer hover:border-primary/20 transition-all">
    <div className="flex justify-between items-start mb-6">
      <div className="w-14 h-14 bg-gray-50 rounded-2xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110">
        {icon}
      </div>
      <div className="text-right">
        <p className="text-[10px] font-bold text-dark/30 uppercase tracking-widest">{t.today}</p>
        <p className="text-xl font-black text-dark">{currency} {price}</p>
      </div>
    </div>
    
    <div className="space-y-4">
      <div>
        <h4 className="text-lg font-bold text-dark group-hover:text-primary transition-colors">{name}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${trend > 0 ? 'bg-emerald-50 text-primary' : 'bg-red-50 text-red-500'}`}>
            {trend > 0 ? '+' : ''}{trend}%
          </span>
          <span className="text-[10px] text-dark/30 font-bold uppercase tracking-tighter">{t.projection}</span>
        </div>
      </div>

      <div className="h-12 w-full">
        <ResponsiveContainer>
          <LineChart data={sparklineData}>
            <Line 
              type="monotone" 
              dataKey="val" 
              stroke={trend > 0 ? "#166534" : "#EF4444"} 
              strokeWidth={2} 
              dot={false} 
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>

    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
      <ArrowUpRight className="w-4 h-4 text-primary" />
    </div>
  </Card>
);

const CommoditiesPage = () => {
  const { language } = useLanguage();
  const { user } = useAuth();
  const role = user?.role || 'farmer';
  const [searchQuery, setSearchQuery] = useState('');

  // Filtering states
  const [showFilterPanel, setShowFilterPanel] = useState(false);
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterTrend, setFilterTrend] = useState('all');
  const [filterPriceOrder, setFilterPriceOrder] = useState('none');

  // Role-specific states
  const [myCrops, setMyCrops] = useState([
    { id: 1, name: 'Tomato', nameNe: 'गोलभेडा', area: '2 Ropani', plantedDate: '2026-03-10', estHarvest: 'June 2026' },
    { id: 2, name: 'Onion', nameNe: 'प्याज', area: '1.5 Ropani', plantedDate: '2026-02-15', estHarvest: 'July 2026' }
  ]);
  const [newCrop, setNewCrop] = useState({ name: 'Tomato', area: '', plantedDate: '', estHarvest: '' });

  const [buyOffers, setBuyOffers] = useState([
    { id: 1, name: 'Onion', quantity: '500 kg', offerPrice: 115, location: 'Kalimati, Kathmandu' },
    { id: 2, name: 'Potato', quantity: '1000 kg', offerPrice: 42, location: 'Balkhu, Kathmandu' }
  ]);
  const [newOffer, setNewOffer] = useState({ name: 'Tomato', quantity: '', offerPrice: '', location: '' });

  const [inventory, setInventory] = useState([
    { id: 1, member: 'Ram Bahadur', crop: 'Potato', weight: '1200 kg', shelf: 'Cold-Room A3' },
    { id: 2, member: 'Hari Maya', crop: 'Cabbage', weight: '450 kg', shelf: 'Shelf B-12' }
  ]);
  const [newDeposit, setNewDeposit] = useState({ member: '', crop: 'Tomato', weight: '', shelf: '' });

  const [downloading, setDownloading] = useState(false);

  const t = {
    en: {
      header: role === 'farmer' ? "My Crops" : role === 'trader' ? "Wholesale Market" : role === 'cooperative' ? "Collective Inventory" : "Market Prices",
      subHeader: role === 'farmer' ? "Track and manage crops you are harvesting or planning to sell." : role === 'trader' ? "View large-scale wholesale demand, trade bids, and commodity listings." : role === 'cooperative' ? "Monitor consolidated storage levels and member contributions." : "Real-time market rates across Nepal.",
      search: "Search commodities...",
      today: "Today",
      projection: "7-Day Projection",
      currency: "Rs",
      items: [
        { name: 'Tomato (गोलभेडा)', price: 85, trend: 12.4, icon: '🍅', category: 'vegetable' },
        { name: 'Potato (आलु)', price: 45, trend: -3.2, icon: '🥔', category: 'vegetable' },
        { name: 'Onion (प्याज)', price: 120, trend: 8.5, icon: '🧅', category: 'vegetable' },
        { name: 'Cauliflower (काउली)', price: 65, trend: 15.0, icon: '🥦', category: 'vegetable' },
        { name: 'Apple (स्याउ)', price: 280, trend: 2.1, icon: '🍎', category: 'fruit' },
        { name: 'Spinach (पालुङ्गो)', price: 35, trend: -5.4, icon: '🥬', category: 'vegetable' },
        { name: 'Lentil (दाल)', price: 190, trend: 0.8, icon: '🥣', category: 'grain' },
        { name: 'Rice (चामल)', price: 210, trend: 1.2, icon: '🍚', category: 'grain' },
      ]
    },
    ne: {
      header: role === 'farmer' ? "मेरो बाली" : role === 'trader' ? "थोक बजार" : role === 'cooperative' ? "सामूहिक भण्डारण" : "बजार भाउ",
      subHeader: role === 'farmer' ? "तपाईंले उत्पादन गरिरहनुभएको वा बिक्री गर्न खोज्नुभएको बालीहरूको व्यवस्थापन।" : role === 'trader' ? "थोक माग, बोलपत्र प्रस्ताव र बजारमा उपलब्ध उपजहरूको विवरण।" : role === 'cooperative' ? "सहकारीको भण्डारण क्षमता र सदस्यहरूले बुझाएको उपजको निगरानी।" : "नेपालका मुख्य बजारका ताजा तरकारी तथा फलफूलको भाउ।",
      search: "खोज्नुहोस्...",
      today: "आजको भाउ",
      projection: "७-दिनको अनुमान",
      currency: "रू",
      items: [
        { name: 'गोलभेडा (Tomato)', price: 85, trend: 12.4, icon: '🍅', category: 'vegetable' },
        { name: 'आलु (Potato)', price: 45, trend: -3.2, icon: '🥔', category: 'vegetable' },
        { name: 'प्याज (Onion)', price: 120, trend: 8.5, icon: '🧅', category: 'vegetable' },
        { name: 'काउली (Cauliflower)', price: 65, trend: 15.0, icon: '🥦', category: 'vegetable' },
        { name: 'स्याउ (Apple)', price: 280, trend: 2.1, icon: '🍎', category: 'fruit' },
        { name: 'पालुङ्गो (Spinach)', price: 35, trend: -5.4, icon: '🥬', category: 'vegetable' },
        { name: 'दाल (Lentil)', price: 190, trend: 0.8, icon: '🥣', category: 'grain' },
        { name: 'चामल (Rice)', price: 210, trend: 1.2, icon: '🍚', category: 'grain' },
      ]
    }
  }[language];

  // Applied Filtering Logic
  let filteredItems = t.items.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory;
    
    let matchesTrend = true;
    if (filterTrend === 'bullish') matchesTrend = item.trend > 0;
    if (filterTrend === 'bearish') matchesTrend = item.trend < 0;

    return matchesSearch && matchesCategory && matchesTrend;
  });

  if (filterPriceOrder === 'low-high') {
    filteredItems = [...filteredItems].sort((a, b) => a.price - b.price);
  } else if (filterPriceOrder === 'high-low') {
    filteredItems = [...filteredItems].sort((a, b) => b.price - a.price);
  }

  const addFarmedCrop = (e) => {
    e.preventDefault();
    if (!newCrop.area || !newCrop.plantedDate || !newCrop.estHarvest) return;
    const nameNe = newCrop.name === 'Tomato' ? 'गोलभेडा' : newCrop.name === 'Onion' ? 'प्याज' : newCrop.name === 'Potato' ? 'आलु' : 'काउली';
    setMyCrops([...myCrops, { ...newCrop, id: Date.now(), nameNe }]);
    setNewCrop({ name: 'Tomato', area: '', plantedDate: '', estHarvest: '' });
  };

  const removeFarmedCrop = (id) => {
    setMyCrops(myCrops.filter(c => c.id !== id));
  };

  const addBuyOffer = (e) => {
    e.preventDefault();
    if (!newOffer.quantity || !newOffer.offerPrice || !newOffer.location) return;
    setBuyOffers([...buyOffers, { ...newOffer, id: Date.now(), offerPrice: Number(newOffer.offerPrice) }]);
    setNewOffer({ name: 'Tomato', quantity: '', offerPrice: '', location: '' });
  };

  const removeBuyOffer = (id) => {
    setBuyOffers(buyOffers.filter(o => o.id !== id));
  };

  const addInventoryDeposit = (e) => {
    e.preventDefault();
    if (!newDeposit.member || !newDeposit.weight || !newDeposit.shelf) return;
    setInventory([...inventory, { ...newDeposit, id: Date.now() }]);
    setNewDeposit({ member: '', crop: 'Tomato', weight: '', shelf: '' });
  };

  const removeInventoryDeposit = (id) => {
    setInventory(inventory.filter(i => i.id !== id));
  };

  const downloadCSV = () => {
    setDownloading(true);
    setTimeout(() => {
      const csvContent = "data:text/csv;charset=utf-8," 
        + "Commodity,Price,Trend,Icon\n"
        + t.items.map(i => `"${i.name}",${i.price},${i.trend}%,"${i.icon}"`).join("\n");
      
      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `Market_Prices_${new Date().toISOString().split('T')[0]}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setDownloading(false);
    }, 1200);
  };

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto pt-24 pb-20">
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h1 className="text-3xl font-black text-dark tracking-tight">{t.header}</h1>
          <p className="text-dark/40 font-medium">{t.subHeader}</p>
        </div>
        
        <div className="flex flex-wrap gap-3 w-full md:w-auto">
          {role === 'consumer' && (
            <Button onClick={downloadCSV} size="md" className="flex items-center gap-2 group">
              <Download className="w-4 h-4 transition-transform group-hover:-translate-y-0.5" />
              {downloading ? (language === 'ne' ? 'तथ्याङ्क डाउनलोड हुँदै...' : 'Downloading...') : (language === 'ne' ? 'डाटा डाउनलोड गर्नुहोस् (CSV)' : 'Export to CSV')}
            </Button>
          )}

          <div className="relative flex-1 md:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-dark/20" />
            <input 
              type="text" 
              placeholder={t.search} 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-100 rounded-xl text-sm outline-none focus:ring-1 focus:ring-primary/20 transition-all shadow-sm"
            />
          </div>
          
          <button 
            onClick={() => setShowFilterPanel(!showFilterPanel)}
            className={`p-3 border rounded-xl transition-all shadow-sm ${
              showFilterPanel || filterCategory !== 'all' || filterTrend !== 'all' || filterPriceOrder !== 'none'
                ? 'bg-primary text-white border-primary' 
                : 'bg-white border-gray-100 text-dark/60 hover:text-primary hover:border-primary/20'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Filter panel slide down */}
      <AnimatePresence>
        {showFilterPanel && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: 'auto', marginTop: 8 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="overflow-hidden"
          >
            <Card className="bg-gray-50 border border-gray-100 p-6 grid grid-cols-1 sm:grid-cols-3 gap-6">
              {/* Category Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-dark/40 uppercase tracking-widest block">
                  {language === 'ne' ? 'श्रेणी' : 'Category'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { val: 'all', label: language === 'ne' ? 'सबै' : 'All' },
                    { val: 'vegetable', label: language === 'ne' ? 'तरकारी' : 'Vegetables' },
                    { val: 'fruit', label: language === 'ne' ? 'फलफूल' : 'Fruits' },
                    { val: 'grain', label: language === 'ne' ? 'खाद्यान्न' : 'Grains' }
                  ].map((cat) => (
                    <button
                      key={cat.val}
                      onClick={() => setFilterCategory(cat.val)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        filterCategory === cat.val
                          ? 'bg-primary border-primary text-white'
                          : 'bg-white border-gray-200 text-dark/60 hover:border-primary/30'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trend Filter */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-dark/40 uppercase tracking-widest block">
                  {language === 'ne' ? 'मूल्य प्रवृत्ति' : 'Trend Direction'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { val: 'all', label: language === 'ne' ? 'सबै' : 'All' },
                    { val: 'bullish', label: language === 'ne' ? 'बढ्दो (Bullish)' : 'Bullish (+)' },
                    { val: 'bearish', label: language === 'ne' ? 'घट्दो (Bearish)' : 'Bearish (-)' }
                  ].map((t) => (
                    <button
                      key={t.val}
                      onClick={() => setFilterTrend(t.val)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        filterTrend === t.val
                          ? 'bg-primary border-primary text-white'
                          : 'bg-white border-gray-200 text-dark/60 hover:border-primary/30'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price Sort Order */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-dark/40 uppercase tracking-widest block">
                  {language === 'ne' ? 'मूल्य क्रमबद्ध' : 'Sort Price'}
                </label>
                <div className="flex flex-wrap gap-2">
                  {[
                    { val: 'none', label: language === 'ne' ? 'साधारण' : 'Default' },
                    { val: 'low-high', label: language === 'ne' ? 'कम देखि बढी' : 'Low to High' },
                    { val: 'high-low', label: language === 'ne' ? 'बढी देखि कम' : 'High to Low' }
                  ].map((p) => (
                    <button
                      key={p.val}
                      onClick={() => setFilterPriceOrder(p.val)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                        filterPriceOrder === p.val
                          ? 'bg-primary border-primary text-white'
                          : 'bg-white border-gray-200 text-dark/60 hover:border-primary/30'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Role-Specific Portal Content at the top */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* ================= FARMER PORTAL ================= */}
        {role === 'farmer' && (
          <>
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-emerald-50 rounded-xl text-primary">
                    <Leaf className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark">
                      {language === 'ne' ? 'मेरो बाली सूची' : 'My Cultivated Crops'}
                    </h3>
                    <p className="text-xs text-dark/40 font-semibold uppercase tracking-wider">
                      {language === 'ne' ? 'तपाईंको खेतबारीमा भएका बालीहरू' : 'Active Crops Under Management'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {myCrops.map((crop) => (
                    <div key={crop.id} className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                          {crop.name === 'Tomato' ? '🍅' : crop.name === 'Onion' ? '🧅' : crop.name === 'Potato' ? '🥔' : '🥦'}
                        </div>
                        <div>
                          <h4 className="font-bold text-dark text-base">
                            {language === 'ne' ? `${crop.nameNe} (${crop.name})` : `${crop.name}`}
                          </h4>
                          <div className="flex gap-4 text-xs font-semibold text-dark/40 mt-1">
                            <span>Area: {crop.area}</span>
                            <span>Planted: {crop.plantedDate}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-dark/30 uppercase">Est. Harvest</p>
                          <p className="text-sm font-bold text-primary">{crop.estHarvest}</p>
                        </div>
                        <button 
                          onClick={() => removeFarmedCrop(crop.id)}
                          className="p-2 text-dark/30 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {myCrops.length === 0 && (
                    <div className="text-center py-10 bg-white/40 rounded-2xl border-2 border-dashed border-gray-100">
                      <p className="text-sm text-dark/30 font-medium">No crops registered yet.</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-emerald-50 border-emerald-100">
                <h3 className="text-lg font-bold text-primary mb-4">
                  {language === 'ne' ? 'नयाँ बाली थप्नुहोस्' : 'Register New Crop'}
                </h3>
                <form onSubmit={addFarmedCrop} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary/60 uppercase">Crop Name</label>
                    <select 
                      value={newCrop.name}
                      onChange={(e) => setNewCrop({ ...newCrop, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-emerald-200/50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold text-dark"
                    >
                      <option value="Tomato">Tomato (गोलभेडा)</option>
                      <option value="Onion">Onion (प्याज)</option>
                      <option value="Potato">Potato (आलु)</option>
                      <option value="Cauliflower">Cauliflower (काउली)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary/60 uppercase">Cultivated Area</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 2 Ropani / 5 Kattha" 
                      value={newCrop.area}
                      onChange={(e) => setNewCrop({ ...newCrop, area: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white border border-emerald-200/50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium text-dark"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary/60 uppercase">Planting Date</label>
                    <input 
                      type="date" 
                      value={newCrop.plantedDate}
                      onChange={(e) => setNewCrop({ ...newCrop, plantedDate: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white border border-emerald-200/50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium text-dark"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary/60 uppercase">Estimated Harvest</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Late June 2026" 
                      value={newCrop.estHarvest}
                      onChange={(e) => setNewCrop({ ...newCrop, estHarvest: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white border border-emerald-200/50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium text-dark"
                    />
                  </div>

                  <Button type="submit" size="md" className="w-full flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    {language === 'ne' ? 'बाली दर्ता गर्नुहोस्' : 'Add to List'}
                  </Button>
                </form>
              </Card>
            </div>
          </>
        )}

        {/* ================= TRADER PORTAL ================= */}
        {role === 'trader' && (
          <>
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2.5 bg-emerald-50 rounded-xl text-primary">
                    <ClipboardList className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-dark">
                      {language === 'ne' ? 'सक्रिय बोलपत्र खरिद प्रस्ताव' : 'My Active Buy Offers'}
                    </h3>
                    <p className="text-xs text-dark/40 font-semibold uppercase tracking-wider">
                      {language === 'ne' ? 'किसानहरूबाट खरिद गर्न राखिएको अफर' : 'Bids placed for wholesale procurement'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {buyOffers.map((offer) => (
                    <div key={offer.id} className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                          {offer.name === 'Tomato' ? '🍅' : offer.name === 'Onion' ? '🧅' : offer.name === 'Potato' ? '🥔' : '🥦'}
                        </div>
                        <div>
                          <h4 className="font-bold text-dark text-base">{offer.name}</h4>
                          <div className="flex gap-4 text-xs font-semibold text-dark/40 mt-1">
                            <span>Quantity: {offer.quantity}</span>
                            <span>Target: {offer.location}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-dark/30 uppercase">Offer Price</p>
                          <p className="text-sm font-bold text-primary">{t.currency} {offer.offerPrice}/kg</p>
                        </div>
                        <button 
                          onClick={() => removeBuyOffer(offer.id)}
                          className="p-2 text-dark/30 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {buyOffers.length === 0 && (
                    <div className="text-center py-10 bg-white/40 rounded-2xl border-2 border-dashed border-gray-100">
                      <p className="text-sm text-dark/30 font-medium">No procurement offers submitted.</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-emerald-50 border-emerald-100">
                <h3 className="text-lg font-bold text-primary mb-4">
                  {language === 'ne' ? 'नयाँ बोलपत्र पेश गर्नुहोस्' : 'Submit Procurement Offer'}
                </h3>
                <form onSubmit={addBuyOffer} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary/60 uppercase">Commodity</label>
                    <select 
                      value={newOffer.name}
                      onChange={(e) => setNewOffer({ ...newOffer, name: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-emerald-200/50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold text-dark"
                    >
                      <option value="Tomato">Tomato (गोलभेडा)</option>
                      <option value="Onion">Onion (प्याज)</option>
                      <option value="Potato">Potato (आलु)</option>
                      <option value="Cauliflower">Cauliflower (काउली)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary/60 uppercase">Quantity Needed</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 500 kg / 2 Tons" 
                      value={newOffer.quantity}
                      onChange={(e) => setNewOffer({ ...newOffer, quantity: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white border border-emerald-200/50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium text-dark"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary/60 uppercase">Offered Price (Per kg)</label>
                    <input 
                      type="number" 
                      placeholder="e.g. 85" 
                      value={newOffer.offerPrice}
                      onChange={(e) => setNewOffer({ ...newOffer, offerPrice: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white border border-emerald-200/50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium text-dark"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary/60 uppercase">Target Hub / Delivery Point</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Kalimati, Kathmandu" 
                      value={newOffer.location}
                      onChange={(e) => setNewOffer({ ...newOffer, location: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white border border-emerald-200/50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium text-dark"
                    />
                  </div>

                  <Button type="submit" size="md" className="w-full flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    {language === 'ne' ? 'बोलपत्र प्रकाशित गर्नुहोस्' : 'Submit Procurement'}
                  </Button>
                </form>
              </Card>
            </div>
          </>
        )}

        {/* ================= COOPERATIVE PORTAL ================= */}
        {role === 'cooperative' && (
          <>
            <div className="lg:col-span-2 space-y-6">
              <Card>
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-emerald-50 rounded-xl text-primary">
                      <Warehouse className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-dark">
                        {language === 'ne' ? 'भण्डारण दर्ता र मौज्दात' : 'Consolidated Ledger & Stock'}
                      </h3>
                      <p className="text-xs text-dark/40 font-semibold uppercase tracking-wider">
                        {language === 'ne' ? 'किसान सदस्यहरूले बुझाएको उपजको रसिद' : 'Member deposits inside warehouse'}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-bold text-dark/30 uppercase">Warehouse Cap.</p>
                    <p className="text-sm font-bold text-primary">6,800 kg / 10,000 kg (68%)</p>
                  </div>
                </div>

                {/* Cooperative Progress Bar */}
                <div className="w-full h-2.5 bg-gray-100 rounded-full overflow-hidden mb-6">
                  <div className="h-full bg-primary rounded-full" style={{ width: '68%' }} />
                </div>

                <div className="space-y-4">
                  {inventory.map((item) => (
                    <div key={item.id} className="flex justify-between items-center p-4 rounded-2xl bg-gray-50 border border-gray-100 hover:border-emerald-100 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center text-2xl shadow-sm">
                          {item.crop === 'Tomato' ? '🍅' : item.crop === 'Onion' ? '🧅' : item.crop === 'Potato' ? '🥔' : '🥦'}
                        </div>
                        <div>
                          <h4 className="font-bold text-dark text-base">{item.member}</h4>
                          <div className="flex gap-4 text-xs font-semibold text-dark/40 mt-1">
                            <span>Crop: {item.crop}</span>
                            <span>Stored in: {item.shelf}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-[10px] font-bold text-dark/30 uppercase">Stock Weight</p>
                          <p className="text-sm font-bold text-primary">{item.weight}</p>
                        </div>
                        <button 
                          onClick={() => removeInventoryDeposit(item.id)}
                          className="p-2 text-dark/30 hover:text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                  {inventory.length === 0 && (
                    <div className="text-center py-10 bg-white/40 rounded-2xl border-2 border-dashed border-gray-100">
                      <p className="text-sm text-dark/30 font-medium">No storage inventory logged.</p>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-emerald-50 border-emerald-100">
                <h3 className="text-lg font-bold text-primary mb-4">
                  {language === 'ne' ? 'नयाँ मौज्दात दाखिला' : 'Log Member Deposit'}
                </h3>
                <form onSubmit={addInventoryDeposit} className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary/60 uppercase">Farmer / Depositor Name</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Ram Bahadur" 
                      value={newDeposit.member}
                      onChange={(e) => setNewDeposit({ ...newDeposit, member: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white border border-emerald-200/50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium text-dark"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary/60 uppercase">Crop type</label>
                    <select 
                      value={newDeposit.crop}
                      onChange={(e) => setNewDeposit({ ...newDeposit, crop: e.target.value })}
                      className="w-full px-4 py-3 bg-white border border-emerald-200/50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-bold text-dark"
                    >
                      <option value="Tomato">Tomato (गोलभेडा)</option>
                      <option value="Onion">Onion (प्याज)</option>
                      <option value="Potato">Potato (आलु)</option>
                      <option value="Cauliflower">Cauliflower (काउली)</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary/60 uppercase">Deposit Weight (kg)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 500 kg" 
                      value={newDeposit.weight}
                      onChange={(e) => setNewDeposit({ ...newDeposit, weight: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white border border-emerald-200/50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium text-dark"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-xs font-bold text-primary/60 uppercase">Shelf / Warehouse Location</label>
                    <input 
                      type="text" 
                      placeholder="e.g. Cold-Room B12" 
                      value={newDeposit.shelf}
                      onChange={(e) => setNewDeposit({ ...newDeposit, shelf: e.target.value })}
                      required
                      className="w-full px-4 py-3 bg-white border border-emerald-200/50 rounded-xl outline-none focus:ring-2 focus:ring-primary/20 text-sm font-medium text-dark"
                    />
                  </div>

                  <Button type="submit" size="md" className="w-full flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    {language === 'ne' ? 'भण्डारणमा दाखिला थप्नुहोस्' : 'Add Storage Ledger'}
                  </Button>
                </form>
              </Card>
            </div>
          </>
        )}
      </div>

      {/* Primary Price Index Table */}
      <div className="space-y-6">
        <div className="flex justify-between items-end">
          <div>
            <h3 className="text-xl font-bold text-dark">
              {role === 'consumer' ? (language === 'ne' ? 'नेपाल कृषि बजार मूल्य सूचकांक' : 'Nepal Market Price Index') : (language === 'ne' ? 'आजको ताजा बजार मूल्य' : 'Current Market Price List')}
            </h3>
            <p className="text-xs text-dark/40 font-semibold uppercase tracking-wider mt-1">
              {role === 'consumer' 
                ? (language === 'ne' ? 'ऐतिहासिक उतारचढाव र मूल्य सूचकांक विश्लेषण' : 'Advanced commodity index trackers') 
                : (language === 'ne' ? 'कालीमाटी बजार दरभाउ र उतारचढाव' : 'Kalimati daily vegetable & crop valuation indices')}
            </p>
          </div>
          {filteredItems.length === 0 && (
            <p className="text-xs text-red-500 font-bold bg-red-50 px-3 py-1 rounded-lg">
              {language === 'ne' ? 'कुनै नतिजा भेटिएन' : 'No items match filters'}
            </p>
          )}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredItems.map((item, i) => (
            <CommodityCard key={i} {...item} delay={i * 0.05} currency={t.currency} t={t} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CommoditiesPage;
