from django.contrib import admin
from .models import WorkExp


@admin.register(WorkExp)
class WorkExpAdmin(admin.ModelAdmin):
    list_display = ('title', 'company_name', 'start_date', 'end_date')
    search_fields = ('title', 'company_name', 'short_description', 'long_description', 'tech_stack')
