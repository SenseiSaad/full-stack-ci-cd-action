import os

from django.contrib.auth import get_user_model
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Create or update the explicitly configured local admin user.'

    def handle(self, *args, **options):
        username = os.getenv('SEED_ADMIN_USERNAME')
        password = os.getenv('SEED_ADMIN_PASSWORD')
        email = os.getenv('SEED_ADMIN_EMAIL', '')

        if not username or not password:
            self.stdout.write('Admin seed skipped; seed credentials are not configured.')
            return

        user_model = get_user_model()
        user, created = user_model.objects.get_or_create(
            username=username,
            defaults={'email': email},
        )

        user.email = email
        user.is_staff = True
        user.is_superuser = True
        user.set_password(password)
        user.save(update_fields=['email', 'is_staff', 'is_superuser', 'password'])

        action = 'Created' if created else 'Updated'
        self.stdout.write(self.style.SUCCESS(f'{action} admin user "{username}".'))
