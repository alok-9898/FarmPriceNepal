import React from 'react';

const StatCard = ({ title, value, icon, trend, trendValue }) => {
  return (
    <div className="glass-card animate-fade-in" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h3 style={{ fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px', color: 'var(--text-muted)' }}>{title}</h3>
        <span style={{ fontSize: '1.5rem' }}>{icon}</span>
      </div>
      <div style={{ fontSize: '1.8rem', fontWeight: '800', marginBottom: '0.5rem' }}>{value}</div>
      {trend && (
        <div style={{ fontSize: '0.85rem', color: trend === 'up' ? 'var(--success)' : 'var(--danger)', fontWeight: '600' }}>
          {trend === 'up' ? '↑' : '↓'} {trendValue} <span style={{ color: 'var(--text-muted)', fontWeight: '400' }}>from last week</span>
        </div>
      )}
    </div>
  );
};

export default StatCard;
