import React from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, RotateCcw } from 'lucide-react';

export const PresetButtons = ({ onSelectPreset, onClear }) => {
  const lowRiskSample = {
    vintage: 2101,
    age: 45,
    gender: 'Male',
    dependents: 0,
    occupation: 'salaried',
    city: 187,
    customer_nw_category: 2,
    branch_code: 755,
    current_balance: 1458.71,
    previous_month_end_balance: 1458.71,
    average_monthly_balance_prevQ: 1458.71,
    average_monthly_balance_prevQ2: 1449.07,
    current_month_credit: 0.20,
    previous_month_credit: 0.20,
    current_month_debit: 0.20,
    previous_month_debit: 0.20,
    current_month_balance: 1458.71,
    previous_month_balance: 1458.71,
    last_transaction: '2019-05-21'
  };

  const highRiskSample = {
    vintage: 500,
    age: 28,
    gender: 'Female',
    dependents: 2,
    occupation: 'self_employed',
    city: 1020,
    customer_nw_category: 1,
    branch_code: 102,
    current_balance: 50.00,
    previous_month_end_balance: 2500.00,
    average_monthly_balance_prevQ: 3200.00,
    average_monthly_balance_prevQ2: 4500.00,
    current_month_credit: 10.00,
    previous_month_credit: 50.00,
    current_month_debit: 2450.00,
    previous_month_debit: 1800.00,
    current_month_balance: 150.00,
    previous_month_balance: 2100.00,
    last_transaction: '2018-01-10'
  };

  return (
    <div style={{ marginBottom: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
        <Sparkles size={16} color="#3b82f6" />
        <span style={{ fontSize: '0.875rem', fontWeight: 600, color: '#94a3b8' }}>Quick 1-Click Demo Testing Presets:</span>
      </div>
      <div className="preset-container">
        <button
          type="button"
          className="preset-btn"
          onClick={() => onSelectPreset(lowRiskSample)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderLeft: '3px solid #10b981' }}
        >
          <CheckCircle2 size={14} color="#10b981" />
          Load Low Risk Sample
        </button>

        <button
          type="button"
          className="preset-btn"
          onClick={() => onSelectPreset(highRiskSample)}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', borderLeft: '3px solid #ef4444' }}
        >
          <AlertTriangle size={14} color="#ef4444" />
          Load High Risk Sample
        </button>

        <button
          type="button"
          className="preset-btn"
          onClick={onClear}
          style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          <RotateCcw size={14} />
          Reset Form
        </button>
      </div>
    </div>
  );
};
