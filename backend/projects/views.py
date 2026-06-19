from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Project
from .serializers import ProjectSerializer
from rest_framework.pagination import PageNumberPagination
# Get all projects


class Pageination_projects(PageNumberPagination):
    page_size=3
    page_size_query_description="page_size"
    max_page_size=6


@api_view(['GET'])
def project_list(request):
    projects = Project.objects.all()
    serializer = ProjectSerializer(projects, many=True)
    return Response(serializer.data)

# Create new project
@api_view(['POST'])
def project_create(request):
    serializer = ProjectSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

# Get one project by ID
@api_view(['GET'])
def project_detail(request, id):
    project = Project.objects.get(id=id)
    serializer = ProjectSerializer(project)
    return Response(serializer.data)

# Update project by ID
@api_view(['PUT'])
def project_update(request, id):
    project = Project.objects.get(id=id)
    serializer = ProjectSerializer(project, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=400)

# Delete project by ID
@api_view(['DELETE'])
def project_delete(request, id):
    project = Project.objects.get(id=id)
    project.delete()
    return Response(status=204)
