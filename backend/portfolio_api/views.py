import json
from datetime import date
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import ContactMessage, Experience, Log, ProcessStep, Project, SiteProfile, Skill, SocialLink


def visible(queryset):
    return queryset.filter(is_published=True)


def portfolio(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    profile = SiteProfile.objects.first()
    if not profile:
        return JsonResponse({'error': 'Portfolio profile has not been configured in admin.'}, status=503)
    response = JsonResponse({
        'profile': {field: getattr(profile, field) for field in ('name', 'role', 'tagline', 'status', 'email', 'location', 'summary', 'current_work', 'future_direction')},
        'social': [{'label': x.label, 'value': x.value, 'href': x.url or '#', 'icon': x.icon} for x in visible(SocialLink.objects.all())],
        'skills': [{'id': x.key, 'accentColor': x.accent_color, 'titlePrimary': x.title_primary, 'titleSecondary': x.title_secondary, 'description': x.description} for x in visible(Skill.objects.all())],
        'experiences': [{'id': x.slug, 'company': x.company, 'role': x.role, 'period': x.period, 'location': x.location, 'url': x.url, 'headline': x.headline, 'description': x.description, 'deliverables': x.deliverables, 'tech': x.tech, 'metric': x.metric} for x in visible(Experience.objects.all())],
        'projects': [{'id': x.slug, 'title': x.title, 'category': x.category, 'categoryLabel': x.category_label, 'tag': x.tag, 'description': x.description, 'tech': x.tech, 'metrics': x.metrics, 'caseStudy': x.case_study, 'featured': x.featured} for x in visible(Project.objects.all())],
        'logs': [{'id': x.slug, 'title': x.title, 'date': x.date.isoformat(), 'category': x.category, 'excerpt': x.excerpt, 'content': x.content} for x in visible(Log.objects.all())],
        'process': [{'number': x.number, 'title': x.title, 'description': x.description, 'tools': x.tools} for x in visible(ProcessStep.objects.all())],
    })
    response['Access-Control-Allow-Origin'] = '*'
    return response


@csrf_exempt
def messages(request):
    if request.method == 'OPTIONS':
        response = JsonResponse({}, status=204)
        response['Access-Control-Allow-Origin'] = '*'
        response['Access-Control-Allow-Headers'] = 'Content-Type'
        response['Access-Control-Allow-Methods'] = 'POST, OPTIONS'
        return response
    if request.method != 'POST':
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    try:
        payload = json.loads(request.body or '{}')
    except json.JSONDecodeError:
        return JsonResponse({'error': 'Invalid JSON'}, status=400)
    name, email, message = (str(payload.get(key, '')).strip() for key in ('name', 'email', 'message'))
    if not name or not email or not message or '@' not in email:
        return JsonResponse({'error': 'Name, valid email, and message are required.'}, status=400)
    ContactMessage.objects.create(name=name, email=email, message=message)
    response = JsonResponse({'ok': True}, status=201)
    response['Access-Control-Allow-Origin'] = '*'
    return response