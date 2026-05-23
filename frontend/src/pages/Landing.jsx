import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowRight, 
  TrendingUp, 
  ShieldCheck, 
  Zap, 
  Globe2, 
  ChevronRight,
  BarChart3,
  CloudSun
} from 'lucide-react';
import Button from '../components/Button';
import Card from '../components/Card';
import { LineChart, Line, ResponsiveContainer } from 'recharts';

const dummyChartData = [
  { val: 10 }, { val: 25 }, { val: 15 }, { val: 35 }, { val: 30 }, { val: 45 }, { val: 40 }, { val: 60 }
];

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-16 overflow-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[90vh] flex items-center bg-white">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] [mask-image:radial-gradient(ellipse_50%_50%_at_50%_50%,#000_70%,transparent_100%)]"></div>
        
        <div className="max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-50 text-primary rounded-full text-xs font-bold uppercase tracking-wider mb-6"
            >
              <Zap className="w-3 h-3" />
              AI-Powered Market Intelligence
            </motion.div>
            
            <h1 className="text-6xl lg:text-7xl font-extrabold text-dark leading-[1.1] mb-6 tracking-tight">
              Predict Tomorrow's <br />
              <span className="text-primary">Market Today</span>
            </h1>
            
            <p className="text-xl text-dark/60 max-w-lg mb-10 leading-relaxed">
              Advanced AI-driven vegetable and fruit price forecasting built specifically for Nepal's unique agricultural landscape.
            </p>
            
            <div className="flex flex-wrap gap-4">
              <Button onClick={() => navigate('/forecast')} size="lg" className="group">
                Try Forecast
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
              </Button>
              <Button onClick={() => navigate('/dashboard')} variant="outline" size="lg">
                View Dashboard
              </Button>
            </div>

            <div className="mt-12 flex items-center gap-8 text-dark/40">
              <div className="flex items-center gap-2">
                <Globe2 className="w-5 h-5" />
                <span className="text-sm font-medium">8 Markets</span>
              </div>
              <div className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5" />
                <span className="text-sm font-medium">15+ Commodities</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: 2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-primary/5 rounded-[40px] blur-2xl"></div>
            <div className="relative bg-white rounded-[32px] border border-gray-100 shadow-2xl p-8 overflow-hidden">
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h4 className="text-lg font-bold text-dark">Kathmandu Tomato Trend</h4>
                  <p className="text-sm text-dark/40">Real-time AI Analysis</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">+12.4%</p>
                  <p className="text-xs text-emerald-500 font-bold uppercase">Forecasted Spike</p>
                </div>
              </div>
              
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dummyChartData}>
                    <Line 
                      type="monotone" 
                      dataKey="val" 
                      stroke="#166534" 
                      strokeWidth={4} 
                      dot={false}
                      animationDuration={2000}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-3 gap-4 mt-8">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${30 * i}%` }}
                      transition={{ duration: 1, delay: 1 + (i * 0.2) }}
                      className="h-full bg-primary/20"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Floaties */}
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute -top-6 -right-6 bg-white p-4 rounded-2xl shadow-xl border border-gray-50 flex items-center gap-3"
            >
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                <CloudSun className="w-6 h-6" />
              </div>
              <div>
                <p className="text-xs font-bold text-dark/40 uppercase">Weather Impact</p>
                <p className="text-sm font-bold text-dark">High Rainfall Predicted</p>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-32 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl font-extrabold text-dark mb-6 tracking-tight">How FarmPriceNepal Works</h2>
            <p className="text-lg text-dark/50">Combining satellite weather data with historical market trends to provide unprecedented price transparency.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="group">
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-white">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-4">Price Forecasting</h3>
              <p className="text-dark/50 leading-relaxed">Predict future prices for vegetables and fruits with up to 30-day horizons using local ML models.</p>
            </Card>
            <Card className="group" delay={0.1}>
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-white">
                <ShieldCheck className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-4">Supply Shock Alerts</h3>
              <p className="text-dark/50 leading-relaxed">Receive instant notifications about upcoming price volatility caused by festivals or road blockades.</p>
            </Card>
            <Card className="group" delay={0.2}>
              <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-primary mb-6 transition-colors group-hover:bg-primary group-hover:text-white">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-xl font-bold text-dark mb-4">Fintech Integration</h3>
              <p className="text-dark/50 leading-relaxed">APIs for lenders and insurers to trigger micro-loans or insurance claims based on market volatility.</p>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-gray-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center text-white font-bold">F</div>
            <span className="text-xl font-extrabold tracking-tight text-dark">FarmPriceNepal</span>
          </div>
          <p className="text-sm text-dark/40">© 2026 FarmPriceNepal. Empowering the backbone of Nepal.</p>
          <div className="flex gap-6 text-sm font-medium text-dark/60">
            <a href="#" className="hover:text-primary transition-colors">Privacy</a>
            <a href="#" className="hover:text-primary transition-colors">Terms</a>
            <a href="#" className="hover:text-primary transition-colors">API Docs</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
