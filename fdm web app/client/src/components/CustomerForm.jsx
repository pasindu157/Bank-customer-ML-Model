import React from 'react';
import { User, Wallet, ArrowLeftRight, Play } from 'lucide-react';

export const CustomerForm = ({ formData, onChange, onSubmit, isLoading }) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <form onSubmit={onSubmit} className="glass-card" style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      {/* SECTION 1: Customer Profile */}
      <div>
        <div className="section-header">
          <User size={18} color="#3b82f6" />
          <span>Customer Demographic & Account Profile</span>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Vintage (Days as Customer)</label>
            <input
              type="number"
              name="vintage"
              value={formData.vintage}
              onChange={handleChange}
              placeholder="e.g. 2101"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Age (Years)</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="e.g. 45"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Gender</label>
            <select name="gender" value={formData.gender} onChange={handleChange} className="form-select" required>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Occupation</label>
            <select name="occupation" value={formData.occupation} onChange={handleChange} className="form-select" required>
              <option value="salaried">Salaried</option>
              <option value="self_employed">Self Employed</option>
              <option value="retired">Retired</option>
              <option value="student">Student</option>
              <option value="company">Company</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Dependents</label>
            <input
              type="number"
              name="dependents"
              value={formData.dependents}
              onChange={handleChange}
              placeholder="0"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">City Code</label>
            <input
              type="number"
              name="city"
              value={formData.city}
              onChange={handleChange}
              placeholder="e.g. 187"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Net Worth Category</label>
            <select name="customer_nw_category" value={formData.customer_nw_category} onChange={handleChange} className="form-select">
              <option value={1}>1 (Low NW)</option>
              <option value={2}>2 (Medium NW)</option>
              <option value={3}>3 (High NW)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Branch Code</label>
            <input
              type="number"
              name="branch_code"
              value={formData.branch_code}
              onChange={handleChange}
              placeholder="e.g. 755"
              className="form-input"
            />
          </div>
        </div>
      </div>

      {/* SECTION 2: Account Balances */}
      <div>
        <div className="section-header">
          <Wallet size={18} color="#10b981" />
          <span>Account Balances (Rs.)</span>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Current Balance</label>
            <input
              type="number"
              step="any"
              name="current_balance"
              value={formData.current_balance}
              onChange={handleChange}
              placeholder="1458.71"
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">Prev Month End Balance</label>
            <input
              type="number"
              step="any"
              name="previous_month_end_balance"
              value={formData.previous_month_end_balance}
              onChange={handleChange}
              placeholder="1458.71"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Avg Monthly Balance Prev Quarter (Q1)</label>
            <input
              type="number"
              step="any"
              name="average_monthly_balance_prevQ"
              value={formData.average_monthly_balance_prevQ}
              onChange={handleChange}
              placeholder="1458.71"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Avg Monthly Balance Prev Quarter (Q2)</label>
            <input
              type="number"
              step="any"
              name="average_monthly_balance_prevQ2"
              value={formData.average_monthly_balance_prevQ2}
              onChange={handleChange}
              placeholder="1449.07"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Current Month Balance</label>
            <input
              type="number"
              step="any"
              name="current_month_balance"
              value={formData.current_month_balance}
              onChange={handleChange}
              placeholder="1458.71"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Previous Month Balance</label>
            <input
              type="number"
              step="any"
              name="previous_month_balance"
              value={formData.previous_month_balance}
              onChange={handleChange}
              placeholder="1458.71"
              className="form-input"
            />
          </div>
        </div>
      </div>

      {/* SECTION 3: Transaction History */}
      <div>
        <div className="section-header">
          <ArrowLeftRight size={18} color="#8b5cf6" />
          <span>Transaction Activity & Recency</span>
        </div>
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label">Current Month Credit</label>
            <input
              type="number"
              step="any"
              name="current_month_credit"
              value={formData.current_month_credit}
              onChange={handleChange}
              placeholder="0.20"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Previous Month Credit</label>
            <input
              type="number"
              step="any"
              name="previous_month_credit"
              value={formData.previous_month_credit}
              onChange={handleChange}
              placeholder="0.20"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Current Month Debit</label>
            <input
              type="number"
              step="any"
              name="current_month_debit"
              value={formData.current_month_debit}
              onChange={handleChange}
              placeholder="0.20"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Previous Month Debit</label>
            <input
              type="number"
              step="any"
              name="previous_month_debit"
              value={formData.previous_month_debit}
              onChange={handleChange}
              placeholder="0.20"
              className="form-input"
            />
          </div>

          <div className="form-group" style={{ gridColumn: '1 / -1' }}>
            <label className="form-label">Last Transaction Date</label>
            <input
              type="date"
              name="last_transaction"
              value={formData.last_transaction}
              onChange={handleChange}
              className="form-input"
            />
          </div>
        </div>
      </div>

      <button type="submit" className="btn btn-primary" disabled={isLoading} style={{ marginTop: '0.5rem' }}>
        {isLoading ? (
          <>
            <span className="loading-spinner"></span>
            <span>Running Prediction Model...</span>
          </>
        ) : (
          <>
            <Play size={18} />
            <span>Generate Churn Risk Prediction</span>
          </>
        )}
      </button>
    </form>
  );
};
