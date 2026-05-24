from django import forms
from django.contrib import admin

from .models import Log
from portfolio.admin_widgets import RichTextContentWidget


class LogAdminForm(forms.ModelForm):
    class Meta:
        model = Log
        fields = '__all__'
        widgets = {
            'long_description': RichTextContentWidget(
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
    search_fields = ('title', 'category', 'short_description', 'long_description', 'tech_stack')
