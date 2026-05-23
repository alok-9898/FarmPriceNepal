import React from 'react';
import { motion } from 'framer-motion';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const Card = ({ children, className, delay = 0 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay }}
      whileHover={{ y: -5, boxShadow: '0 10px 30px rgba(0,0,0,0.08)' }}
      className={cn(
        'bg-white/90 backdrop-blur-sm rounded-[24px] border border-white/20 shadow-[0_8px_32px_rgba(0,0,0,0.04)] p-6 transition-all duration-300 ring-1 ring-black/[0.02]',
        className
      )}
    >
      {children}
    </motion.div>
  );
};

export default Card;
