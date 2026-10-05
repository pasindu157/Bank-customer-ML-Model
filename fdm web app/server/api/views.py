import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .predictor import ChurnPredictor

def health_check(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
    try:
        predictor = ChurnPredictor.get_instance()
        return JsonResponse({
            'status': 'healthy',
            'message': 'Django Backend API is running',
            'model_loaded': True
        }, status=200)
    except Exception as e:
        return JsonResponse({
            'status': 'unhealthy',
            'error': str(e),
            'model_loaded': False
        }, status=500)

@csrf_exempt
def predict_churn_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed. Please send a POST request.'}, status=405)

    try:
        data = json.loads(request.body.decode('utf-8'))
    except Exception:
        return JsonResponse({'error': 'Invalid JSON format in request body.'}, status=400)

    # Required key validation check
    required_fields = ['vintage', 'age', 'gender', 'occupation', 'current_balance']
    missing_fields = [field for field in required_fields if field not in data or data[field] is None or data[field] == '']
    if missing_fields:
        return JsonResponse({
            'error': f"Missing required fields: {', '.join(missing_fields)}"
        }, status=400)

    try:
        predictor = ChurnPredictor.get_instance()
        result = predictor.predict(data)
        return JsonResponse({
            'status': 'success',
            'data': result
        }, status=200)
    except Exception as e:
        return JsonResponse({
            'error': f"Prediction error: {str(e)}"
        }, status=500)
