import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { PresetButtons } from './components/PresetButtons';
import { CustomerForm } from './components/CustomerForm';
import { ResultCard } from './components/ResultCard';
import { BalanceChart } from './components/BalanceChart';
import { checkHealth, predictChurn } from './services/api';

const defaultFormData = {
  vintage: '',
  age: '',
  gender: 'Male',
  dependents: 0,
  occupation: 'salaried',
  city: '',
  customer_nw_category: 2,
  branch_code: '',
  current_balance: '',
  previous_month_end_balance: '',
  average_monthly_balance_prevQ: '',
  average_monthly_balance_prevQ2: '',
  current_month_credit: '',
  previous_month_credit: '',
  current_month_debit: '',
  previous_month_debit: '',
  current_month_balance: '',
  previous_month_balance: '',
  last_transaction: ''
};

export function App() {
  const [formData, setFormData] = useState(defaultFormData);
  const [isHealthy, setIsHealthy] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const verifyBackend = async () => {
      const res = await checkHealth();
      setIsHealthy(res.healthy);
    };
    verifyBackend();
    const interval = setInterval(verifyBackend, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSelectPreset = (presetData) => {
    setFormData(presetData);
    setError(null);
  };

  const handleClear = () => {
    setFormData(defaultFormData);
    setPredictionResult(null);
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...formData,
        vintage: Number(formData.vintage) || 0,
        age: Number(formData.age) || 0,
        dependents: Number(formData.dependents) || 0,
        city: Number(formData.city) || 0,
        customer_nw_category: Number(formData.customer_nw_category) || 1,
        branch_code: Number(formData.branch_code) || 0,
        current_balance: Number(formData.current_balance) || 0,
        previous_month_end_balance: Number(formData.previous_month_end_balance) || 0,
        average_monthly_balance_prevQ: Number(formData.average_monthly_balance_prevQ) || 0,
        average_monthly_balance_prevQ2: Number(formData.average_monthly_balance_prevQ2) || 0,
        current_month_credit: Number(formData.current_month_credit) || 0,
        previous_month_credit: Number(formData.previous_month_credit) || 0,
        current_month_debit: Number(formData.current_month_debit) || 0,
        previous_month_debit: Number(formData.previous_month_debit) || 0,
        current_month_balance: Number(formData.current_month_balance) || 0,
        previous_month_balance: Number(formData.previous_month_balance) || 0
      };

      const result = await predictChurn(payload);
      setPredictionResult(result);
    } catch (err) {
      setError(err.message || 'Error communicating with prediction server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="app-container">
      <Header isHealthy={isHealthy} />
      
      <PresetButtons onSelectPreset={handleSelectPreset} onClear={handleClear} />

      <div className="main-grid">
        <CustomerForm
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          isLoading={isLoading}
        />

        <div>
          <div style={{ position: 'sticky', top: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <ResultCard result={predictionResult} error={error} />
            <BalanceChart formData={formData} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
