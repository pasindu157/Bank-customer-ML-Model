import React from 'react';
import { CheckCircle, AlertOctagon, Info, TrendingUp } from 'lucide-react';

export const ResultCard = ({ result, error }) => {
  if (error) {
    return (
      <div className="glass-card" style={{ borderColor: 'rgba(239, 68, 68, 0.4)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: '#ef4444' }}>
          <AlertOctagon size={24} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Prediction Error</h3>
        </div>
        <p style={{ marginTop: '0.5rem', color: '#cbd5e1', fontSize: '0.9rem' }}>{error}</p>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="glass-card" style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#94a3b8' }}>
        <TrendingUp size={48} style={{ margin: '0 auto 1rem', opacity: 0.4, color: '#3b82f6' }} />
        <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#e2e8f0', marginBottom: '0.5rem' }}>
          Ready for Prediction
        </h3>
        <p style={{ fontSize: '0.875rem', maxWidth: '280px', margin: '0 auto' }}>
          Enter customer details or click one of the quick test presets above to analyze churn risk.
        </p>
      </div>
    );
  }

  const { prediction, churn_status, probability, risk_level, recommendation, risk_drivers } = result;
  const probPercentage = (probability * 100).toFixed(1);

  let fillClass = 'fill-low';
  let tagClass = 'tag-low';
  if (risk_level === 'High Risk') {
    fillClass = 'fill-high';
    tagClass = 'tag-high';
  } else if (risk_level === 'Medium Risk') {
    fillClass = 'fill-medium';
    tagClass = 'tag-medium';
  }

  return (
    <div className="glass-card result-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 600, color: '#94a3b8' }}>Model Analytics Result</h3>
        <span className={`risk-level-tag ${tagClass}`}>{risk_level}</span>
      </div>

      <div className={`result-badge ${prediction === 1 ? 'result-churn' : 'result-retain'}`}>
        {prediction === 1 ? <AlertOctagon size={28} /> : <CheckCircle size={28} />}
        <span>{churn_status === 'Churn Likely' ? 'High Risk of Churn' : 'Retain Customer'}</span>
      </div>

      <div className="probability-container">
        <div className="probability-header">
          <span style={{ color: '#cbd5e1' }}>Churn Risk Probability</span>
          <span style={{ color: '#f8fafc', fontWeight: 700 }}>{probPercentage}%</span>
        </div>
        <div className="progress-bar-bg">
          <div className={`progress-bar-fill ${fillClass}`} style={{ width: `${probPercentage}%` }}></div>
        </div>
      </div>

      {risk_drivers && risk_drivers.length > 0 && (
        <div style={{ marginTop: '0.2rem', backgroundColor: 'rgba(0,0,0,0.2)', padding: '0.75rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
            <AlertOctagon size={14} color="#f59e0b" />
            <span>Top Risk Drivers (Explainable AI)</span>
          </div>
          <ul style={{ listStyleType: 'none', padding: 0, margin: 0, fontSize: '0.85rem', color: '#e2e8f0' }}>
            {risk_drivers.map((driver, idx) => (
              <li key={idx} style={{ padding: '0.3rem 0', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: idx !== 2 ? '1px dashed rgba(255,255,255,0.05)' : 'none' }}>
                <span style={{ color: '#ef4444', fontWeight: 'bold' }}>#{idx + 1}</span> 
                {driver}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="recommendation-box">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: 600, color: '#3b82f6', marginBottom: '0.35rem' }}>
          <Info size={16} />
          <span>Recommended Action</span>
        </div>
        <p>{recommendation}</p>
      </div>
    </div>
  );
};
