import os
import joblib
import pandas as pd
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
MODEL_PATH = BASE_DIR / 'model.joblib'

class ChurnPredictor:
    _instance = None

    def __init__(self):
        if not MODEL_PATH.exists():
            raise FileNotFoundError(f"Model pipeline file not found at: {MODEL_PATH}")
        
        pipeline = joblib.load(MODEL_PATH)
        self.model = pipeline['model']
        self.scaler = pipeline['scaler']
        self.cols_to_scale = pipeline['cols_to_scale']
        self.feature_columns = pipeline['feature_columns']
        self.imputation = pipeline['imputation']
        self.max_date = pipeline['max_date']

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = ChurnPredictor()
        return cls._instance

    def predict(self, raw_data: dict):
        # Convert dictionary to DataFrame
        input_df = pd.DataFrame([raw_data])

        # 1. Impute missing fields if needed
        input_df['gender'] = input_df['gender'].fillna(self.imputation['gender_mode']) if 'gender' in input_df else self.imputation['gender_mode']
        input_df['occupation'] = input_df['occupation'].fillna(self.imputation['occupation_mode']) if 'occupation' in input_df else self.imputation['occupation_mode']
        input_df['city'] = input_df['city'].fillna(self.imputation['city_mode']) if 'city' in input_df else self.imputation['city_mode']
        input_df['dependents'] = input_df['dependents'].fillna(self.imputation['dependents_median']) if 'dependents' in input_df else self.imputation['dependents_median']

        # Ensure numerical types
        numeric_fields = ['vintage', 'age', 'dependents', 'city', 'customer_nw_category', 'branch_code',
                          'current_balance', 'previous_month_end_balance', 'average_monthly_balance_prevQ',
                          'average_monthly_balance_prevQ2', 'current_month_credit', 'previous_month_credit',
                          'current_month_debit', 'previous_month_debit', 'current_month_balance', 'previous_month_balance']
        
        for field in numeric_fields:
            if field in input_df:
                input_df[field] = pd.to_numeric(input_df[field], errors='coerce')

        # 2. Recency calculation
        last_tx = input_df.get('last_transaction', pd.Series([None])).iloc[0]
        tx_dt = pd.to_datetime(last_tx, errors='coerce')
        if pd.isna(tx_dt):
            tx_dt = self.max_date
        
        input_df['days_since_last_transaction'] = (self.max_date - tx_dt).days
        if 'last_transaction' in input_df:
            input_df = input_df.drop(columns=['last_transaction'])

        # 3. Categorical encoding
        encoded_df = pd.get_dummies(input_df, columns=['gender', 'occupation'], drop_first=True)
        encoded_df = encoded_df.reindex(columns=self.feature_columns, fill_value=0)

        # 4. Feature scaling
        encoded_df[self.cols_to_scale] = self.scaler.transform(encoded_df[self.cols_to_scale])

        # 5. Prediction & probability
        pred_class = int(self.model.predict(encoded_df)[0])
        pred_prob = float(self.model.predict_proba(encoded_df)[0][1])

        # Risk Classification
        if pred_prob >= 0.60:
            risk_level = "High Risk"
            recommendation = "High risk of churn detected. Immediate engagement and retention offer recommended."
        elif pred_prob >= 0.35:
            risk_level = "Medium Risk"
            recommendation = "Moderate churn risk. Monitor account activity and send promotional incentives."
        else:
            risk_level = "Low Risk"
            recommendation = "Customer engagement is healthy. Standard relationship maintenance."

        return {
            'prediction': pred_class,
            'churn_status': "Churn Likely" if pred_class == 1 else "Retain",
            'probability': round(pred_prob, 4),
            'risk_level': risk_level,
            'recommendation': recommendation
        }
