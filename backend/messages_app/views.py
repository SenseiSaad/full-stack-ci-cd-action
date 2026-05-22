from rest_framework.response import Response
from rest_framework.decorators import api_view
from .models import ContactMessage
from .serializers import ContactMessageSerializer

# Get all messages from the database
@api_view(['GET'])
def message_list(request):
    # Get all ContactMessage objects from database
    messages = ContactMessage.objects.all()
    # Convert to JSON using serializer (many=True because multiple items)
    serializer = ContactMessageSerializer(messages, many=True)
    # Return the JSON data
    return Response(serializer.data)

# Create a new message from contact form
@api_view(['POST'])
def message_create(request):
    # Take the data sent from frontend
    serializer = ContactMessageSerializer(data=request.data)
    # Check if data is valid (has all required fields)
    if serializer.is_valid():
        # Save to database
        serializer.save()
        # Return saved data with status 201 (Created)
        return Response(serializer.data, status=201)
    # If data is invalid, return error messages
    return Response(serializer.errors, status=400)

# Get one specific message by ID
@api_view(['GET'])
def message_detail(request, id):
    # Get message with specific ID from database
    message = ContactMessage.objects.get(id=id)
    # Convert to JSON
    serializer = ContactMessageSerializer(message)
    # Return the data
    return Response(serializer.data)

# Delete a message by ID
@api_view(['DELETE'])
def message_delete(request, id):
    # Get message with specific ID from database
    message = ContactMessage.objects.get(id=id)
    # Delete it from database
    message.delete()
    # Return empty response with status 204 (No Content)
    return Response(status=204)
