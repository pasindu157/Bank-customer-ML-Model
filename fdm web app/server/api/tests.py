import json
from django.test import TestCase, Client
from django.urls import reverse

class ChurnApiTestCase(TestCase):
    def setUp(self):
        self.client = Client()

    def test_health_check_endpoint(self):
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, 200)
        data = response.json()
        self.assertEqual(data['status'], 'healthy')
        self.assertTrue(data['model_loaded'])

    def test_predict_endpoint_valid_payload(self):
        payload = {
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
        }

        response = self.client.post(
            '/api/predict/',
            data=json.dumps(payload),
            content_type='application/json'
        )

        self.assertEqual(response.status_code, 200)
        json_resp = response.json()
        self.assertEqual(json_resp['status'], 'success')
        data = json_resp['data']
        self.assertIn('prediction', data)
        self.assertIn('churn_status', data)
        self.assertIn('probability', data)
        self.assertIn('risk_level', data)
        self.assertIn('recommendation', data)
        print("\nTest Predict API Output:")
        print(json.dumps(data, indent=2))

    def test_predict_endpoint_missing_required_fields(self):
        payload = {
            'age': 40
            # missing vintage, gender, occupation, current_balance
        }
        response = self.client.post(
            '/api/predict/',
            data=json.dumps(payload),
            content_type='application/json'
        )
        self.assertEqual(response.status_code, 400)
        json_resp = response.json()
        self.assertIn('error', json_resp)
