from rest_framework import serializers
from .models import Project
from portfolio.sanitizers import sanitize_plain_text, sanitize_rich_text

# Serializer converts Project data to/from JSON
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'

    def validate(self, attrs):
        for field in ('title', 'short_description', 'tech_stack'):
            if field in attrs:
                attrs[field] = sanitize_plain_text(attrs[field])

        if 'long_description' in attrs:
            attrs['long_description'] = sanitize_rich_text(attrs['long_description'])

        return attrs

    def to_representation(self, project):
        data = super().to_representation(project)
        data['title'] = sanitize_plain_text(project.title)
        data['short_description'] = sanitize_plain_text(project.short_description)
        data['tech_stack'] = sanitize_plain_text(project.tech_stack)
        data['long_description'] = sanitize_rich_text(project.long_description)
        return data
