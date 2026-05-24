from django import forms
from django.contrib import admin
from .models import WorkExp
from portfolio.admin_widgets import RichTextContentWidget


class WorkExpAdminForm(forms.ModelForm):
    class Meta:
        model = WorkExp
        fields = '__all__'
        widgets = {
            'long_description': RichTextContentWidget(
                attrs={
                    'class': 'rich-text-source',
                    'rows': 18,
                }
            ),
        }


@admin.register(WorkExp)
class WorkExpAdmin(admin.ModelAdmin):
    form = WorkExpAdminForm
    list_display = ('title', 'company_name', 'start_date', 'end_date')
    search_fields = ('title', 'company_name', 'short_description', 'long_description', 'tech_stack')
