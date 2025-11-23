import pytest
from rest_framework.test import APIClient
from rest_framework import status
from django.contrib.auth.models import User
import json

@pytest.mark.django_db
class TestPrediction:
    def setup_method(self):
        self.client = APIClient()
        self.predict_url = '/api/predict_home_price/'
        self.locations_url = '/api/get_location_names/'
        self.user = User.objects.create_user(username='testuser', password='testpassword')

    def test_get_location_names(self):
        response = self.client.get(self.locations_url)
        assert response.status_code == status.HTTP_200_OK
        data = json.loads(response.content)
        assert 'locations' in data
        assert isinstance(data['locations'], list)

    def test_predict_home_price(self):
        self.client.force_authenticate(user=self.user)
        # Assuming 'Electronic City' is a valid location from columns.json
        # If not, this test might fail depending on how the model handles unknown locations
        # ideally we should mock the model or ensure the location exists
        payload = {
            'total_sqft': 1000,
            'bhk': 2,
            'bath': 2,
            'location': 'Electronic City'
        }
        response = self.client.post(self.predict_url, payload, format='json')
        assert response.status_code == status.HTTP_200_OK
        data = json.loads(response.content)
        assert 'estimated_price' in data
