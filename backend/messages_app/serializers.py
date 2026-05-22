from rest_framework import serializers
from .models import ContactMessage

# This converts ContactMessage data to/from JSON format
class ContactMessageSerializer(serializers.ModelSerializer):
    # Meta class tells serializer which model to use
    class Meta:
        # Specify the model we're serializing
        model = ContactMessage
        # Include all fields from the model
        fields = '__all__'
