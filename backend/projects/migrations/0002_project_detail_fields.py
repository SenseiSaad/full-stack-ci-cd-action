from django.db import migrations, models


class Migration(migrations.Migration):
    dependencies = [
        ('projects', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='project',
            old_name='description',
            new_name='short_description',
        ),
        migrations.RenameField(
            model_name='project',
            old_name='technologies',
            new_name='tech_stack',
        ),
        migrations.RenameField(
            model_name='project',
            old_name='live_link',
            new_name='live_url',
        ),
        migrations.AddField(
            model_name='project',
            name='long_description',
            field=models.TextField(blank=True),
        ),
        migrations.AlterField(
            model_name='project',
            name='tech_stack',
            field=models.CharField(blank=True, max_length=255),
        ),
    ]
