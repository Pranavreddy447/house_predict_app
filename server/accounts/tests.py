import pytest
from django.contrib.auth.models import User
from rest_framework.test import APIClient
from rest_framework import status

@pytest.mark.django_db
class TestAccounts:
    def setup_method(self):
        self.client = APIClient()
        self.signup_url = '/api/auth/signup/'
        self.login_url = '/api/auth/login/'
        self.user_data = {
            'username': 'testuser',
            'password': 'testpassword123',
            'email': 'test@example.com'
        }

    def test_signup_success(self):
        response = self.client.post(self.signup_url, self.user_data)
        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(username='testuser').exists()

    def test_signup_duplicate_username(self):
        User.objects.create_user(**self.user_data)
        response = self.client.post(self.signup_url, self.user_data)
        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_login_success(self):
        User.objects.create_user(**self.user_data)
        login_data = {
            'username': 'testuser',
            'password': 'testpassword123'
        }
        response = self.client.post(self.login_url, login_data)
        assert response.status_code == status.HTTP_200_OK
        assert 'token' in response.data

    def test_login_invalid_credentials(self):
        User.objects.create_user(**self.user_data)
        login_data = {
            'username': 'testuser',
            'password': 'wrongpassword'
        }
        response = self.client.post(self.login_url, login_data)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
