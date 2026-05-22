from rest_framework import serializers
from .models import WorkExp

class ExperienceSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkExp
        fields = '__all__'