from rest_framework import serializers
from .models import Log

# Serializer converts Log data to/from JSON
class LogSerializer(serializers.ModelSerializer):
    class Meta:
        model = Log
        fields = '__all__'
