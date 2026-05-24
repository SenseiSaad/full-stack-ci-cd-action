from django import forms
from django.contrib import admin
from .models import Project
from portfolio.admin_widgets import RichTextContentWidget


class ProjectAdminForm(forms.ModelForm):
    class Meta:
        model = Project
        fields = '__all__'
        widgets = {
            'long_description': RichTextContentWidget(
                attrs={
                    'class': 'rich-text-source',
                    'rows': 18,
                }
            ),
        }


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    form = ProjectAdminForm
    list_display = ('title', 'tech_stack', 'created_at', 'updated_at')
    search_fields = ('title', 'short_description', 'long_description', 'tech_stack')
