import re
from html import unescape

from django.db import migrations, models


def create_short_descriptions(apps, schema_editor):
    Log = apps.get_model('logs', 'Log')

    for log in Log.objects.all():
        text = re.sub(r'<[^>]+>', ' ', log.long_description or '')
        text = re.sub(r'\s+', ' ', unescape(text)).strip()
        log.short_description = text[:320] or log.title
        log.save(update_fields=['short_description'])


class Migration(migrations.Migration):
    dependencies = [
        ('logs', '0002_project_deployment_log'),
    ]

    operations = [
        migrations.RenameField(
            model_name='log',
            old_name='content',
            new_name='long_description',
        ),
        migrations.AddField(
            model_name='log',
            name='short_description',
            field=models.TextField(default=''),
            preserve_default=False,
        ),
        migrations.AddField(
            model_name='log',
            name='tech_stack',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AddField(
            model_name='log',
            name='live_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='log',
            name='github_link',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.RunPython(create_short_descriptions, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='log',
            name='category',
            field=models.CharField(blank=True, max_length=100),
        ),
        migrations.AlterField(
            model_name='log',
            name='long_description',
            field=models.TextField(blank=True),
        ),
    ]
