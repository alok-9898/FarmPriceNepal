import React from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area 
} from 'recharts';

const ForecastChart = ({ data, historicalData }) => {
  const combinedData = [
    ...historicalData.map(d => ({ 
      ...d, 
      price: d.price_npr, 
      isHistorical: true 
    })),
    ...data.map(d => ({ 
      ...d, 
      price: d.predicted_price, 
      isHistorical: false 
    }))
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-white p-4 rounded-2xl shadow-2xl border border-gray-100 min-w-[200px]">
          <p className="text-[10px] font-bold text-dark/40 uppercase tracking-widest mb-2">
            {new Date(label).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-sm font-bold text-dark">Price</span>
              <span className="text-lg font-black text-primary">Rs {item.price.toFixed(1)}</span>
            </div>
            {item.upper_bound && (
              <div className="flex justify-between items-center pt-2 border-t border-gray-50 mt-2">
                <span className="text-[10px] font-bold text-dark/30 uppercase">Range</span>
                <span className="text-xs font-bold text-dark/60">
                  {item.lower_bound.toFixed(0)} - {item.upper_bound.toFixed(0)}
                </span>
              </div>
            )}
            <div className={`text-[10px] font-bold uppercase mt-2 ${item.isHistorical ? 'text-dark/30' : 'text-primary'}`}>
              {item.isHistorical ? 'Historical Data' : 'AI Prediction'}
            </div>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{ width: '100%', height: '100%' }}>
      <ResponsiveContainer>
        <AreaChart data={combinedData} margin={{ top: 20, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorForecast" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#166534" stopOpacity={0.15}/>
              <stop offset="95%" stopColor="#166534" stopOpacity={0}/>
            </linearGradient>
            <linearGradient id="colorHistorical" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#9ca3af" stopOpacity={0.05}/>
              <stop offset="95%" stopColor="#9ca3af" stopOpacity={0}/>
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
          <XAxis 
            dataKey="date" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }}
            tickFormatter={(str) => new Date(str).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 600 }}
            tickFormatter={(val) => `Rs ${val}`}
          />
          <Tooltip content={<CustomTooltip />} />
          
          {/* Confidence Interval Area */}
          <Area 
            type="monotone" 
            dataKey="upper_bound" 
            stroke="none" 
            fill="#166534" 
            fillOpacity={0.05} 
            name="Upper Bound"
            connectNulls
          />
          <Area 
            type="monotone" 
            dataKey="lower_bound" 
            stroke="none" 
            fill="#166534" 
            fillOpacity={0.05} 
            name="Lower Bound"
            connectNulls
          />

          <Area 
            type="monotone" 
            dataKey="price" 
            stroke={combinedData[combinedData.length-1]?.isHistorical ? "#9ca3af" : "#166534"}
            strokeWidth={4} 
            fill="url(#colorForecast)"
            fillOpacity={1}
            animationDuration={1500}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ForecastChart;
