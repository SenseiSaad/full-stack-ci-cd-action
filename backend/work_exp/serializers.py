from rest_framework import serializers
from .models import WorkExp
from portfolio.sanitizers import sanitize_plain_text, sanitize_rich_text

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExp
        fields = '__all__'

    def validate(self, attrs):
        for field in ('title', 'short_description', 'tech_stack', 'company_name'):
            if field in attrs:
                attrs[field] = sanitize_plain_text(attrs[field])

        if 'long_description' in attrs:
            attrs['long_description'] = sanitize_rich_text(attrs['long_description'])

        return attrs

    def to_representation(self, experience):
        data = super().to_representation(experience)
        data['title'] = sanitize_plain_text(experience.title)
        data['short_description'] = sanitize_plain_text(experience.short_description)
        data['tech_stack'] = sanitize_plain_text(experience.tech_stack)
        data['company_name'] = sanitize_plain_text(experience.company_name)
        data['long_description'] = sanitize_rich_text(experience.long_description)
        return data
