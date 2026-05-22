from django.db import migrations, models


def fill_required_previews(apps, schema_editor):
    WorkExp = apps.get_model('work_exp', 'WorkExp')

    for experience in WorkExp.objects.all():
        fields_to_update = []

        if not experience.short_description:
            experience.short_description = experience.title
            fields_to_update.append('short_description')

        if experience.tech_stack is None:
            experience.tech_stack = ''
            fields_to_update.append('tech_stack')

        if fields_to_update:
            experience.save(update_fields=fields_to_update)


class Migration(migrations.Migration):
    dependencies = [
        ('work_exp', '0001_initial'),
    ]

    operations = [
        migrations.RenameField(
            model_name='workexp',
            old_name='position',
            new_name='title',
        ),
        migrations.RenameField(
            model_name='workexp',
            old_name='description',
            new_name='short_description',
        ),
        migrations.RenameField(
            model_name='workexp',
            old_name='tool_stack',
            new_name='tech_stack',
        ),
        migrations.AddField(
            model_name='workexp',
            name='github_link',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='workexp',
            name='live_url',
            field=models.URLField(blank=True, null=True),
        ),
        migrations.AddField(
            model_name='workexp',
            name='long_description',
            field=models.TextField(blank=True),
        ),
        migrations.RunPython(fill_required_previews, migrations.RunPython.noop),
        migrations.AlterField(
            model_name='workexp',
            name='short_description',
            field=models.TextField(),
        ),
        migrations.AlterField(
            model_name='workexp',
            name='tech_stack',
            field=models.CharField(blank=True, max_length=255),
        ),
        migrations.AlterField(
            model_name='workexp',
            name='start_date',
            field=models.DateField(blank=True, null=True),
        ),
    ]
