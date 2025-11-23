import json
import pickle
import os
import numpy as np
import pandas as pd
from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.conf import settings

# Global variables
__locations = None
__model = None
__scaler = None
__ohe = None

def load_saved_artifacts():
    global __locations
    global __model
    global __scaler
    global __ohe

    print("Loading saved artifacts...start")
    
    path = os.path.join(settings.BASE_DIR, "house_price_prediction_model.pkl")
    if __model is None:
        with open(path, 'rb') as f:
            artifacts = pickle.load(f)
            __model = artifacts['model']
            __scaler = artifacts['scaler']
            __ohe = artifacts['ohe']
            __locations = artifacts['locations']
            
    print("Loading saved artifacts...done")

def get_location_names(request):
    if __locations is None:
        load_saved_artifacts()
    # Ensure locations are strings and sorted
    locs = sorted([str(l) for l in __locations])
    response = JsonResponse({'locations': locs})
    return response

from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated

@csrf_exempt
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def predict_home_price(request):
    if request.method == 'POST':
        if __model is None:
            load_saved_artifacts()
            
        try:
            data = json.loads(request.body)
            total_sqft = float(data['total_sqft'])
            location = data['location']
            bhk = int(data['bhk'])
            bath = int(data['bath'])
        except (KeyError, ValueError) as e:
             return JsonResponse({'error': f"Invalid input: {str(e)}"}, status=400)

        # Prepare input dataframe for scaler
        # Columns must match what was used during fit: ['total_sqft', 'bath', 'bedroom']
        input_df = pd.DataFrame([[total_sqft, bath, bhk]], columns=['total_sqft', 'bath', 'bedroom'])
        
        try:
            scaled_features = __scaler.transform(input_df)
        except Exception as e:
            return JsonResponse({'error': f"Scaling error: {str(e)}"}, status=500)
            
        # Prepare location for OHE
        loc_df = pd.DataFrame([[location]], columns=['location'])
        try:
            encoded_loc = __ohe.transform(loc_df)
        except Exception as e:
            # Handle unseen location if necessary, though handle_unknown='ignore' was set
            return JsonResponse({'error': f"Encoding error: {str(e)}"}, status=500)
            
        # Concatenate
        x = np.hstack((scaled_features, encoded_loc))
        
        try:
            prediction = __model.predict(x)[0]
        except Exception as e:
            return JsonResponse({'error': f"Prediction error: {str(e)}"}, status=500)

        return JsonResponse({'estimated_price': float(prediction)})
    else:
        return JsonResponse({'error': 'POST method required'}, status=405)
