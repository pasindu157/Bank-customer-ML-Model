const API_BASE_URL = 'http://127.0.0.1:8000/api';

export const checkHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health/`);
    if (!response.ok) return { healthy: false };
    const data = await response.json();
    return { healthy: data.status === 'healthy' && data.model_loaded };
  } catch (error) {
    return { healthy: false };
  }
};

export const predictChurn = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to generate prediction');
    }

    return data.data;
  } catch (error) {
    throw error;
  }
};
