from django.test import TestCase

from .models import Log
from .serializers import LogSerializer


class LogRichTextTest(TestCase):
    def test_log_save_sanitizes_long_description(self):
        log = Log.objects.create(
            title='Rich content',
            short_description='Rich preview',
            category='Notes',
            long_description='<h2>Title</h2><script>alert(1)</script><p>Safe text</p>',
        )

        self.assertEqual(log.long_description, '<h2>Title</h2>alert(1)<p>Safe text</p>')

    def test_serializer_sanitizes_existing_long_description(self):
        log = Log.objects.create(
            title='Stored content',
            short_description='Stored preview',
            category='Notes',
            long_description='<p>Safe</p>',
        )
        Log.objects.filter(pk=log.pk).update(long_description='<p>Safe</p><iframe>unsafe</iframe>')
        log.refresh_from_db()

        self.assertEqual(LogSerializer(log).data['long_description'], '<p>Safe</p>unsafe')
