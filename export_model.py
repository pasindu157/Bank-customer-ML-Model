import os
import pandas as pd
import numpy as np
import joblib
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from imblearn.over_sampling import SMOTE
from sklearn.ensemble import RandomForestClassifier

def main():
    print("Loading dataset...")
    df = pd.read_csv('D:/Y3S2/FDM/churn_prediction.csv')

    # Train-test split matching notebook (20% test, stratify=y, random_state=42)
    X = df.drop(columns=['churn', 'customer_id'])
    y = df['churn']

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.20, random_state=42, stratify=y
    )

    # 1. Missing Values Imputation Statistics (computed on X_train only)
    gender_mode = X_train['gender'].mode()[0]
    occupation_mode = X_train['occupation'].mode()[0]
    city_mode = X_train['city'].mode()[0]
    dependents_median = X_train['dependents'].median()

    X_train['gender'] = X_train['gender'].fillna(gender_mode)
    X_train['occupation'] = X_train['occupation'].fillna(occupation_mode)
    X_train['city'] = X_train['city'].fillna(city_mode)
    X_train['dependents'] = X_train['dependents'].fillna(dependents_median)

    # 2. Recency Feature Engineering
    X_train['last_transaction_dt'] = pd.to_datetime(X_train['last_transaction'], errors='coerce')
    max_date = X_train['last_transaction_dt'].max()
    X_train['last_transaction_dt'] = X_train['last_transaction_dt'].fillna(max_date)
    X_train['days_since_last_transaction'] = (max_date - X_train['last_transaction_dt']).dt.days
    X_train = X_train.drop(columns=['last_transaction', 'last_transaction_dt'])

    # 3. Categorical Encoding (One-Hot Encoding)
    categorical_cols = ['gender', 'occupation']
    X_train_encoded = pd.get_dummies(X_train, columns=categorical_cols, drop_first=True)
    feature_columns = list(X_train_encoded.columns)

    # 4. Feature Scaling
    cols_to_scale = [
        'vintage', 'age', 'dependents', 'city', 'customer_nw_category', 'branch_code',
        'current_balance', 'previous_month_end_balance', 'average_monthly_balance_prevQ',
        'average_monthly_balance_prevQ2', 'current_month_credit', 'previous_month_credit',
        'current_month_debit', 'previous_month_debit', 'current_month_balance',
        'previous_month_balance', 'days_since_last_transaction'
    ]
    scaler = StandardScaler()
    X_train_scaled = X_train_encoded.copy()
    X_train_scaled[cols_to_scale] = scaler.fit_transform(X_train_encoded[cols_to_scale])

    # 5. SMOTE Oversampling on training data
    smote = SMOTE(random_state=42)
    X_train_resampled, y_train_resampled = smote.fit_resample(X_train_scaled, y_train)

    # 6. Train Final Tuned Random Forest Model
    print("Training Tuned Random Forest Classifier...")
    best_rf_model = RandomForestClassifier(
        n_estimators=100,
        max_depth=15,
        min_samples_split=5,
        min_samples_leaf=4,
        class_weight='balanced',
        random_state=42
    )
    best_rf_model.fit(X_train_resampled, y_train_resampled)

    # Package model and metadata into a single dictionary pipeline
    pipeline_artifact = {
        'model': best_rf_model,
        'scaler': scaler,
        'cols_to_scale': cols_to_scale,
        'feature_columns': feature_columns,
        'imputation': {
            'gender_mode': gender_mode,
            'occupation_mode': occupation_mode,
            'city_mode': city_mode,
            'dependents_median': dependents_median
        },
        'max_date': max_date
    }

    # Ensure output directory exists
    output_dir = 'D:/Y3S2/FDM/fdm web app/server'
    os.makedirs(output_dir, exist_ok=True)
    output_path = os.path.join(output_dir, 'model.joblib')

    joblib.dump(pipeline_artifact, output_path)
    print(f"Successfully saved trained model pipeline to: {output_path}")

if __name__ == '__main__':
    main()
