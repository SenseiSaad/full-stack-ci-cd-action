from unittest.mock import patch

from django.contrib.auth import get_user_model
from django.core.management import call_command
from django.test import TestCase


class SeedAdminCommandTest(TestCase):
    def test_seed_admin_creates_configured_superuser(self):
        env = {
            'SEED_ADMIN_USERNAME': 'admin',
            'SEED_ADMIN_PASSWORD': 'admin123',
            'SEED_ADMIN_EMAIL': 'admin@example.local',
        }

        with patch.dict('os.environ', env, clear=False):
            call_command('seed_admin')

        user = get_user_model().objects.get(username='admin')
        self.assertTrue(user.is_staff)
        self.assertTrue(user.is_superuser)
        self.assertEqual(user.email, 'admin@example.local')
        self.assertTrue(user.check_password('admin123'))
