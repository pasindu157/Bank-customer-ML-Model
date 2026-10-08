import React from 'react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { TrendingDown, TrendingUp, BarChart2 } from 'lucide-react';

export const BalanceChart = ({ formData }) => {
  // If the user hasn't generated a prediction or filled enough data, show a placeholder
  if (!formData || formData.current_balance === '') {
    return null;
  }

  // Construct timeline data points from the form inputs for the chart
  const data = [
    {
      name: 'Q2 Avg',
      balance: Number(formData.average_monthly_balance_prevQ2) || 0,
    },
    {
      name: 'Q1 Avg',
      balance: Number(formData.average_monthly_balance_prevQ) || 0,
    },
    {
      name: 'Prev Month',
      balance: Number(formData.previous_month_end_balance) || 0,
    },
    {
      name: 'Current',
      balance: Number(formData.current_balance) || 0,
    }
  ];

  // Determine trend direction (Current vs Q2 Avg)
  const isDeclining = data[3].balance < data[0].balance;

  // Custom styling for the tooltip
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{
          backgroundColor: '#0f172a',
          padding: '10px 14px',
          border: '1px solid #334155',
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
          color: '#f8fafc'
        }}>
          <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>{label} Balance</p>
          <p style={{ margin: 0, fontWeight: 'bold' }}>Rs. {payload[0].value.toFixed(2)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="glass-card result-card" style={{ marginTop: '1.5rem', animation: 'fadeIn 0.5s ease' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: '#e2e8f0', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <BarChart2 size={18} color="#3b82f6" />
            Balance History Trend
          </h3>
          <p style={{ fontSize: '0.825rem', color: '#94a3b8', marginTop: '0.2rem' }}>Tracks 6-month account trajectory</p>
        </div>
        
        {/* Trend Indicator Badge */}
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '4px',
          padding: '4px 8px', 
          borderRadius: '6px', 
          fontSize: '0.8rem', 
          fontWeight: 600,
          backgroundColor: isDeclining ? 'rgba(239, 68, 68, 0.15)' : 'rgba(16, 185, 129, 0.15)',
          color: isDeclining ? '#ef4444' : '#10b981'
        }}>
          {isDeclining ? <TrendingDown size={14} /> : <TrendingUp size={14} />}
          {isDeclining ? 'Declining' : 'Stable / Growing'}
        </div>
      </div>

      <div style={{ width: '100%', height: 200, marginTop: '1rem' }}>
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorBalance" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isDeclining ? "#ef4444" : "#3b82f6"} stopOpacity={0.4}/>
                <stop offset="95%" stopColor={isDeclining ? "#ef4444" : "#3b82f6"} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis 
              dataKey="name" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }} 
              dy={10} 
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 12 }}
              tickFormatter={(value) => `Rs ${value}`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="balance" 
              stroke={isDeclining ? "#ef4444" : "#3b82f6"} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorBalance)" 
              animationDuration={1500}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
