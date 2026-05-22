from django.contrib import admin
from .models import Project


@admin.register(Project)
class ProjectAdmin(admin.ModelAdmin):
    list_display = ('title', 'tech_stack', 'created_at', 'updated_at')
    search_fields = ('title', 'short_description', 'long_description', 'tech_stack')
