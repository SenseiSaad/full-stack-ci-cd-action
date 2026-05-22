from django.test import TestCase, Client
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status


class HealthCheckTest(TestCase):
    """Test health check endpoint"""
    
    def setUp(self):
        self.client = Client()
    
    def test_health_check_status(self):
        """Health check should return 200 OK"""
        response = self.client.get('/health/')
        self.assertEqual(response.status_code, 200)


class APIRoutingTest(TestCase):
    """The backend should serve APIs, admin, and health checks only."""
    
    def setUp(self):
        self.client = Client()
    
    def test_root_is_not_a_django_template_page(self):
        response = self.client.get('/')
        self.assertEqual(response.status_code, 404)


class APIEndpointsTest(APITestCase):
    """Test all API endpoints"""
    
    def test_experience_list_endpoint(self):
        """Experience list endpoint should return 200"""
        response = self.client.get('/api/experience/')
        self.assertEqual(response.status_code, 200)
    
    def test_projects_list_endpoint(self):
        """Projects list endpoint should return 200"""
        response = self.client.get('/api/projects/')
        self.assertEqual(response.status_code, 200)
    
    def test_logs_list_endpoint(self):
        """Logs list endpoint should return 200"""
        response = self.client.get('/api/logs/')
        self.assertEqual(response.status_code, 200)
    
    def test_messages_list_endpoint(self):
        """Messages list endpoint should return 200"""
        response = self.client.get('/api/messages/')
        self.assertEqual(response.status_code, 200)
