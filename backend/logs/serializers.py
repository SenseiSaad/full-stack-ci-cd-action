from rest_framework import serializers
from .models import Log
from portfolio.sanitizers import sanitize_plain_text, sanitize_rich_text

# Serializer converts Log data to/from JSON
class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = '__all__'

    def validate(self, attrs):
        for field in ('title', 'short_description', 'tech_stack', 'category'):
            if field in attrs:
                attrs[field] = sanitize_plain_text(attrs[field])

        if 'long_description' in attrs:
            attrs['long_description'] = sanitize_rich_text(attrs['long_description'])

        return attrs

    def to_representation(self, log):
        data = super().to_representation(log)
        data['title'] = sanitize_plain_text(log.title)
        data['short_description'] = sanitize_plain_text(log.short_description)
        data['tech_stack'] = sanitize_plain_text(log.tech_stack)
        data['category'] = sanitize_plain_text(log.category)
        data['long_description'] = sanitize_rich_text(log.long_description)
        return data
