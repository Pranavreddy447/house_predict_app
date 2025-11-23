from django.urls import path
from . import views

urlpatterns = [
    path('get_location_names/', views.get_location_names, name='get_location_names'),
    path('predict_home_price/', views.predict_home_price, name='predict_home_price'),
]
