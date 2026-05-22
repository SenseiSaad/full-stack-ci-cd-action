from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import WorkExp
from .serializers import ExperienceSerializer

@api_view(['GET'])
def experience_list(request):
    experience = WorkExp.objects.all()
    serializer = ExperienceSerializer(experience, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def experience_create(request):
    serializer = ExperienceSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['GET'])
def experience_one(request, id):
    serializers=WorkExp.objects.get(id=id)
    serializer=ExperienceSerializer(serializers)
    return Response(serializer.data)

@api_view(['PUT'])
def experience_update(request, id):
    serializers=WorkExp.objects.get(id=id)
    serializer=ExperienceSerializer(serializers, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
def experience_delete(request, id):
    serializers=WorkExp.objects.get(id=id)
    serializers.delete()
    return Response(status=204)
