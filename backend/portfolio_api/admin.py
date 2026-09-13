from django.contrib import admin
from .models import ContactMessage, Experience, Log, ProcessStep, Project, SiteProfile, Skill, SocialLink


class PublishedAdmin(admin.ModelAdmin):
    list_display = ('__str__', 'order', 'is_published')
    list_editable = ('order', 'is_published')
    list_filter = ('is_published',)


@admin.register(SiteProfile)
class SiteProfileAdmin(admin.ModelAdmin):
    fieldsets = ((None, {'fields': ('name', 'role', 'tagline', 'status', 'email', 'location')}), ('About', {'fields': ('summary', 'current_work', 'future_direction')}))


for model in (SocialLink, Skill, Experience, Project, Log, ProcessStep):
    admin.site.register(model, PublishedAdmin)


@admin.register(ContactMessage)
class ContactMessageAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'created_at', 'is_read')
    list_filter = ('is_read', 'created_at')
    list_editable = ('is_read',)
    search_fields = ('name', 'email', 'message')
    readonly_fields = ('created_at',)