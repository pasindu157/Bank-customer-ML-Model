import json
import urllib.request
import urllib.error
import pandas as pd

API_URL = "http://127.0.0.1:8000/api/predict/"
CSV_PATH = "d:/Y3S2/FDM/sample_test_customers.csv"

def run_test_suite():
    print(f"Reading test customers from: {CSV_PATH}")
    df = pd.read_csv(CSV_PATH)
    
    print("\n" + "="*80)
    print(f"{'ID':<6} | {'AGE':<4} | {'BALANCE (Rs)':<12} | {'EXPECTED':<12} | {'PREDICTED':<12} | {'PROBABILITY':<11} | {'STATUS'}")
    print("="*80)

    for _, row in df.iterrows():
        cust_id = int(row['customer_id'])
        payload = {
            'vintage': int(row['vintage']),
            'age': int(row['age']),
            'gender': str(row['gender']),
            'dependents': float(row['dependents']),
            'occupation': str(row['occupation']),
            'city': float(row['city']),
            'customer_nw_category': int(row['customer_nw_category']),
            'branch_code': int(row['branch_code']),
            'current_balance': float(row['current_balance']),
            'previous_month_end_balance': float(row['previous_month_end_balance']),
            'average_monthly_balance_prevQ': float(row['average_monthly_balance_prevQ']),
            'average_monthly_balance_prevQ2': float(row['average_monthly_balance_prevQ2']),
            'current_month_credit': float(row['current_month_credit']),
            'previous_month_credit': float(row['previous_month_credit']),
            'current_month_debit': float(row['current_month_debit']),
            'previous_month_debit': float(row['previous_month_debit']),
            'current_month_balance': float(row['current_month_balance']),
            'previous_month_balance': float(row['previous_month_balance']),
            'last_transaction': str(row['last_transaction'])
        }

        req = urllib.request.Request(
            API_URL,
            data=json.dumps(payload).encode('utf-8'),
            headers={'Content-Type': 'application/json'}
        )

        try:
            with urllib.request.urlopen(req) as response:
                res_data = json.loads(response.read().decode('utf-8'))
                result = res_data['data']
                pred_status = result['churn_status']
                prob = result['probability']
                risk = result['risk_level']
                expected = row['expected_risk']
                
                print(f"{cust_id:<6} | {row['age']:<4} | {row['current_balance']:<12.2f} | {expected:<12} | {risk:<12} | {prob*100:>5.1f}%      | {pred_status}")
        except urllib.error.URLError as e:
            print(f"Error connecting to backend for customer {cust_id}: {e}")
            print("Please make sure Django server is running: python manage.py runserver 8000")
            break

    print("="*80 + "\n")

if __name__ == '__main__':
    run_test_suite()
