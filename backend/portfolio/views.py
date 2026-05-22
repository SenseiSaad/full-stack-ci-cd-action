from rest_framework.response import Response
from rest_framework.decorators import api_view

# Health check endpoint for Docker/AWS
@api_view(['GET'])
def health_check(request):
    """
    Health check endpoint - used by Docker HEALTHCHECK and AWS load balancers
    Returns 200 OK if app is working
    """
    return Response({
        "status": "healthy",
        "service": "portfolio-api",
        "timestamp": str(request.headers.get('date', 'N/A'))
    })


@api_view(['GET'])
def api_root(request):
    return Response({
        "service": "portfolio-api",
        "endpoints": [
            "/api/experience/",
            "/api/projects/",
            "/api/logs/",
            "/api/messages/",
        ],
    })
