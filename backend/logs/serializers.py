from rest_framework import serializers
from .models import Log
from .sanitizers import sanitize_rich_text

# Serializer converts Log data to/from JSON
class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = '__all__'

    def to_representation(self, log):
        data = super().to_representation(log)
        data['long_description'] = sanitize_rich_text(log.long_description)
        return data
