from rest_framework import serializers
from .models import Project

# Serializer converts Project data to/from JSON
class ProjectSerializer(serializers.ModelSerializer):
    class Meta:
        model = Project
        fields = '__all__'
