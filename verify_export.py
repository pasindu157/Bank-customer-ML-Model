import joblib
import pandas as pd

def test_load_and_predict():
    model_path = 'D:/Y3S2/FDM/fdm web app/server/model.joblib'
    print(f"Loading pipeline from {model_path}...")
    pipeline = joblib.load(model_path)

    model = pipeline['model']
    scaler = pipeline['scaler']
    cols_to_scale = pipeline['cols_to_scale']
    feature_columns = pipeline['feature_columns']
    imputation = pipeline['imputation']
    max_date = pipeline['max_date']

    print("Pipeline contents loaded successfully:")
    print(f"- Model: {type(model).__name__}")
    print(f"- Feature Columns Count: {len(feature_columns)}")
    print(f"- Imputation Stats: {imputation}")
    print(f"- Max Date: {max_date}")

    # Create dummy user input sample dataframe matching raw schema
    sample_input = pd.DataFrame([{
        'vintage': 2101,
        'age': 66,
        'gender': 'Male',
        'dependents': 0.0,
        'occupation': 'self_employed',
        'city': 187.0,
        'customer_nw_category': 2,
        'branch_code': 755,
        'current_balance': 1458.71,
        'previous_month_end_balance': 1458.71,
        'average_monthly_balance_prevQ': 1458.71,
        'average_monthly_balance_prevQ2': 1449.07,
        'current_month_credit': 0.20,
        'previous_month_credit': 0.20,
        'current_month_debit': 0.20,
        'previous_month_debit': 0.20,
        'current_month_balance': 1458.71,
        'previous_month_balance': 1458.71,
        'last_transaction': '5/21/2019'
    }])

    # Preprocessing transformation on sample input
    sample_input['gender'] = sample_input['gender'].fillna(imputation['gender_mode'])
    sample_input['occupation'] = sample_input['occupation'].fillna(imputation['occupation_mode'])
    sample_input['city'] = sample_input['city'].fillna(imputation['city_mode'])
    sample_input['dependents'] = sample_input['dependents'].fillna(imputation['dependents_median'])

    sample_input['last_transaction_dt'] = pd.to_datetime(sample_input['last_transaction'], errors='coerce')
    sample_input['last_transaction_dt'] = sample_input['last_transaction_dt'].fillna(max_date)
    sample_input['days_since_last_transaction'] = (max_date - sample_input['last_transaction_dt']).dt.days
    sample_input = sample_input.drop(columns=['last_transaction', 'last_transaction_dt'])

    sample_encoded = pd.get_dummies(sample_input, columns=['gender', 'occupation'], drop_first=True)
    sample_encoded = sample_encoded.reindex(columns=feature_columns, fill_value=0)

    sample_encoded[cols_to_scale] = scaler.transform(sample_encoded[cols_to_scale])

    prediction = model.predict(sample_encoded)[0]
    probability = model.predict_proba(sample_encoded)[0][1]

    print(f"\nSample Input Prediction Result:")
    print(f"Predicted Class (Churn): {prediction}")
    print(f"Churn Probability: {probability:.4f}")

if __name__ == '__main__':
    test_load_and_predict()
