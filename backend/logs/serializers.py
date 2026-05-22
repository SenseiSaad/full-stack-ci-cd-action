from rest_framework import serializers
from .models import Log
from .sanitizers import sanitize_rich_text

# Serializer converts Log data to/from JSON
class LogSerializer(serializers.ModelSerializer):
    content = serializers.SerializerMethodField()

    class Meta:
        model = Log
        fields = '__all__'

    def get_content(self, log):
        return sanitize_rich_text(log.content)
