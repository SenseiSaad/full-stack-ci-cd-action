from django import forms
from django.contrib import admin

from .models import Log


class RichTextContentWidget(forms.Textarea):
    class Media:
        css = {
            'all': ('logs/richtext_admin.css',),
        }
        js = ('logs/richtext_admin.js',)


class LogAdminForm(forms.ModelForm):
    class Meta:
        model = Log
        fields = '__all__'
        widgets = {
            'content': RichTextContentWidget(
                attrs={
                    'class': 'rich-text-source',
                    'rows': 18,
                }
            ),
        }


@admin.register(Log)
class LogAdmin(admin.ModelAdmin):
    form = LogAdminForm
    list_display = ('title', 'category', 'created_at', 'updated_at')
    list_filter = ('category', 'created_at')
    search_fields = ('title', 'category', 'content')
