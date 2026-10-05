import React from 'react';
import { ShieldAlert, Activity } from 'lucide-react';

export const Header = ({ isHealthy }) => {
  return (
    <header className="navbar glass-card">
      <div className="brand">
        <div className="brand-icon">
          <ShieldAlert size={24} />
        </div>
        <div>
          <h1 className="brand-title">Bank Customer Churn AI</h1>
          <p style={{ fontSize: '0.8rem', color: '#94a3b8' }}>Real-time Risk Prediction & Intelligence</p>
        </div>
      </div>
      
      <div className={`status-badge ${isHealthy ? 'status-online' : 'status-offline'}`}>
        <span className="status-dot"></span>
        <Activity size={14} />
        <span>{isHealthy ? 'Django API Connected' : 'Django API Offline'}</span>
      </div>
    </header>
  );
};
