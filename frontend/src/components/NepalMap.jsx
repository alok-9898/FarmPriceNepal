import React from 'react';
import { motion } from 'framer-motion';

const NepalMap = ({ activeProvince, onProvinceClick }) => {
  // Simplified SVG paths for Nepal Provinces
  const provinces = [
    { id: 1, name: 'Koshi', path: 'M10 10 L40 10 L50 30 L30 50 L10 40 Z' },
    { id: 2, name: 'Madhesh', path: 'M50 30 L80 40 L70 60 L40 50 Z' },
    { id: 3, name: 'Bagmati', path: 'M40 50 L70 60 L60 80 L30 70 Z' },
    { id: 4, name: 'Gandaki', path: 'M30 70 L60 80 L50 100 L20 90 Z' },
    { id: 5, name: 'Lumbini', path: 'M20 90 L50 100 L40 120 L10 110 Z' },
    { id: 6, name: 'Karnali', path: 'M10 110 L40 120 L30 140 L0 130 Z' },
    { id: 7, name: 'Sudurpashchim', path: 'M0 130 L30 140 L20 160 L-10 150 Z' },
  ];

  // NOTE: In a real app, we'd use a GeoJSON TopoJSON or a detailed SVG file.
  // For this hackathon demo, I'll use a stylized abstract representation.

  return (
    <div className="relative w-full aspect-[2/1] bg-emerald-50/30 rounded-[32px] border border-emerald-100/50 p-8 flex items-center justify-center overflow-hidden">
      <svg viewBox="0 0 200 100" className="w-full h-full drop-shadow-2xl">
        <g transform="translate(20, 10) scale(0.8)">
          {/* Stylized Nepal Map Shape */}
          <motion.path
            d="M0,40 L30,30 L60,35 L90,20 L120,25 L150,15 L180,25 L200,45 L190,70 L160,85 L130,75 L100,80 L70,70 L40,85 L10,75 Z"
            fill="#e2e8f0"
            stroke="#cbd5e1"
            strokeWidth="1"
          />
          
          {/* Animated Province Nodes */}
          {[
            { x: 30, y: 55, name: 'Sudurpashchim' },
            { x: 60, y: 45, name: 'Karnali' },
            { x: 90, y: 60, name: 'Lumbini' },
            { x: 105, y: 40, name: 'Gandaki' },
            { x: 135, y: 55, name: 'Bagmati' },
            { x: 155, y: 70, name: 'Madhesh' },
            { x: 175, y: 45, name: 'Koshi' },
          ].map((node, i) => (
            <motion.g
              key={node.name}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: i * 0.1 }}
              className="cursor-pointer"
              onClick={() => onProvinceClick(node.name)}
            >
              <motion.circle
                cx={node.x}
                cy={node.y}
                r="4"
                fill={activeProvince === node.name ? '#166534' : '#64748b'}
                whileHover={{ r: 6 }}
              />
              <motion.text
                x={node.x}
                y={node.y - 8}
                textAnchor="middle"
                className="text-[5px] font-bold fill-dark/40 uppercase tracking-tighter"
              >
                {node.name}
              </motion.text>
            </motion.g>
          ))}
        </g>
      </svg>
      
      <div className="absolute bottom-6 left-6 flex items-center gap-2">
        <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
        <span className="text-[10px] font-bold text-dark/40 uppercase tracking-widest">Live Market Feed</span>
      </div>
    </div>
  );
};

export default NepalMap;
