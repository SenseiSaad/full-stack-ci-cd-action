from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import Project
from .serializers import ProjectSerializer
# Get all projects



@api_view(['GET'])
def project_list(request):
    # Fetch all projects from the database
    projects = Project.objects.all()
    
    # Serialize the entire queryset at once
    serializer = ProjectSerializer(projects, many=True)
    
    # Return the plain list of data in the response
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
