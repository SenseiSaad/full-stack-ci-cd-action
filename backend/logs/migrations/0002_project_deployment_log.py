from django.db import migrations


PROJECT_LOG_TITLE = 'Building SaadOps: Django, Docker, Terraform, AWS, and CI/CD'

PROJECT_LOG_CONTENT = """
<p>This portfolio became more than a static page. I built it to practice the full path from backend code to a service running on the internet.</p>

<h2>What I built</h2>
<ul>
    <li>A Django and Django REST Framework backend for projects, work experience, writings, and contact messages.</li>
    <li>A separate frontend that reads portfolio content from backend APIs instead of hardcoded cards.</li>
    <li>Local Docker Compose services for the frontend, backend, and PostgreSQL database.</li>
    <li>AWS infrastructure with Terraform, including EC2, RDS PostgreSQL, ECR, S3, IAM, VPC networking, and security groups.</li>
    <li>A GitHub Actions pipeline that checks the backend, builds Docker images, publishes them to ECR, and deploys to EC2.</li>
</ul>

<h2>How the system works</h2>
<p>Django Admin is the content desk. When I add a project, work experience item, or writing, the backend stores it in the database and exposes it through REST endpoints. The frontend fetches those endpoints and renders the latest content.</p>
<p>For deployment, the backend and frontend are built as separate Docker images. GitHub Actions pushes those images to Amazon ECR, then EC2 pulls them and starts them with Docker Compose. Nginx sits in front of the containers and routes public requests to the correct service.</p>

<h2>Problems that taught me the most</h2>
<ol>
    <li>GitHub Actions secrets must match the workflow exactly. A missing EC2 host or DB host breaks deployment before application code is even involved.</li>
    <li>Security groups decide whether automation can reach the instance. SSH access for my laptop and SSH access for a hosted CI runner are different network paths.</li>
    <li>Images and containers are not the same thing. ECR image pulls can succeed while an old container name still blocks a new Compose deployment.</li>
    <li>A 502 from Nginx usually points to an upstream problem. In my case, host Nginx was still targeting an alternate local frontend port instead of the EC2 port.</li>
    <li>Health checks are configuration too. Django can be running while a health probe fails because the request host is not allowed.</li>
</ol>

<h2>What I learned</h2>
<p>The feature code matters, but shipping it teaches a different set of skills: infrastructure state, environment variables, logs, network reachability, reverse proxies, and repeatable deployment steps.</p>
<blockquote>This project made the backend feel real because I had to explain every hop between a browser request and the running service.</blockquote>
"""


def add_project_log(apps, schema_editor):
    Log = apps.get_model('logs', 'Log')
    Log.objects.get_or_create(
        title=PROJECT_LOG_TITLE,
        defaults={
            'category': 'Project Notes',
            'content': PROJECT_LOG_CONTENT,
        },
    )


def remove_project_log(apps, schema_editor):
    Log = apps.get_model('logs', 'Log')
    Log.objects.filter(title=PROJECT_LOG_TITLE).delete()


class Migration(migrations.Migration):
    dependencies = [
        ('logs', '0001_initial'),
    ]

    operations = [
        migrations.RunPython(add_project_log, remove_project_log),
    ]
