from django.urls import path
from . import views

urlpatterns = [
    path('health/', views.health_check, name='health_check'),
    path('predict/', views.predict_churn_view, name='predict_churn'),
]
