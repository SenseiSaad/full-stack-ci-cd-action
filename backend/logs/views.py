from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Log
from .serializers import LogSerializer

# Get all blog posts
@api_view(['GET'])
def log_list(request):
    logs = Log.objects.all()
    serializer = LogSerializer(logs, many=True)
    return Response(serializer.data)

# Create new blog post
@api_view(['POST'])
def log_create(request):
    serializer = LogSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# Get one blog post by ID
@api_view(['GET'])
def log_detail(request, id):
    log = Log.objects.get(id=id)
    serializer = LogSerializer(log)
    return Response(serializer.data)

# Update blog post by ID
@api_view(['PUT'])
def log_update(request, id):
    log = Log.objects.get(id=id)
    serializer = LogSerializer(log, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

# Delete blog post by ID
@api_view(['DELETE'])
def log_delete(request, id):
    log = Log.objects.get(id=id)
    log.delete()
    return Response(status=204)
