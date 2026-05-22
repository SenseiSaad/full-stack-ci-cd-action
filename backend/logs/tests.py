from django.test import TestCase

from .models import Log
from .serializers import LogSerializer


class LogRichTextTest(TestCase):
    def test_log_save_sanitizes_rich_text_content(self):
        log = Log.objects.create(
            title='Rich content',
            category='Notes',
            content='<h2>Title</h2><script>alert(1)</script><p>Safe text</p>',
        )

        self.assertEqual(log.content, '<h2>Title</h2>alert(1)<p>Safe text</p>')

    def test_serializer_sanitizes_existing_content(self):
        log = Log.objects.create(
            title='Stored content',
            category='Notes',
            content='<p>Safe</p>',
        )
        Log.objects.filter(pk=log.pk).update(content='<p>Safe</p><iframe>unsafe</iframe>')
        log.refresh_from_db()

        self.assertEqual(LogSerializer(log).data['content'], '<p>Safe</p>unsafe')
