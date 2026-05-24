from rest_framework import serializers
from .models import ContactMessage
from portfolio.sanitizers import sanitize_plain_text

# This converts ContactMessage data to/from JSON format
class ContactMessageSerializer(serializers.ModelSerializer):
    # Meta class tells serializer which model to use
    class Meta:
        # Specify the model we're serializing
        model = ContactMessage
        # Include all fields from the model
        fields = '__all__'
        read_only_fields = ('id', 'created_at')

    def validate(self, attrs):
        for field in ('name', 'email', 'subject', 'message'):
            if field in attrs:
                attrs[field] = sanitize_plain_text(attrs[field])

        if 'email' in attrs:
            attrs['email'] = attrs['email'].lower()

        return attrs

    def to_representation(self, message):
        data = super().to_representation(message)
        data['name'] = sanitize_plain_text(message.name)
        data['email'] = sanitize_plain_text(message.email).lower()
        data['subject'] = sanitize_plain_text(message.subject)
        data['message'] = sanitize_plain_text(message.message)
        return data
