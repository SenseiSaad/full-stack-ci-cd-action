from datetime import date

from django.core.management.base import BaseCommand

from projects.models import Project
from work_exp.models import WorkExp


PROJECTS = [
    {
        'title': 'Full-Stack Portfolio Platform on AWS EC2',
        'short_description': 'Live portfolio platform at slancer.site with a Django REST API, admin-managed content, Docker, Nginx, PostgreSQL/RDS, Terraform infrastructure, Certbot HTTPS, and GitHub Actions deployment.',
        'long_description': (
            '<p>Built the current live portfolio as a backend-driven platform instead of a hardcoded site. Django Admin manages projects, work experience, writings/logs, and contact messages, while the frontend renders data through REST API endpoints.</p>'
            '<p>Containerized the backend and frontend with Docker, served the frontend through Nginx, and routed API, admin, static, media, and health-check traffic cleanly between services.</p>'
            '<p>Provisioned production infrastructure with Terraform, including VPC, EC2, ECR, RDS PostgreSQL, IAM, security groups, S3 support, and deployment outputs for CI/CD secrets.</p>'
            '<p>Configured GitHub Actions to run backend checks/tests, build Docker images, push to ECR, SSH into EC2, pull the latest images, recreate containers, and reload Nginx.</p>'
        ),
        'tech_stack': 'Python, Django, DRF, AWS EC2, AWS RDS, AWS ECR, Docker, Nginx, PostgreSQL, Terraform, GitHub Actions',
        'live_url': 'https://slancer.site',
    },
    {
        'title': 'Serverless Cloud Infrastructure',
        'short_description': 'Responsive static frontend on AWS Amplify with CloudFront edge caching, Cognito identity infrastructure, GitHub Actions, Route 53, and SSL.',
        'long_description': (
            '<p>Implemented a responsive static frontend on AWS Amplify, supporting sub-second page loads and triggering automated CI/CD builds on repository pushes.</p>'
            '<p>Improved global asset load times by 45% by configuring AWS CloudFront CDN for edge caching.</p>'
            '<p>Managed identity infrastructure supporting 100+ secure user sessions via AWS Cognito integration in protected site areas.</p>'
            '<p>Accomplished custom domain routing through AWS Route 53 with provisioned SSL via Amplify.</p>'
        ),
        'tech_stack': 'AWS Amplify, CloudFront, Cognito, GitHub Actions, Route 53, SSL',
        'live_url': 'https://slancer.site',
    },
]


EXPERIENCES = [
    {
        'title': 'Freelance Web Developer',
        'company_name': 'Celestial Church of Christ',
        'short_description': 'Built and deployed a 10+ page church website with custom HTML/CSS, WordPress CMS support, Vercel hosting, DNS optimization, event listings, staff profiles, service schedules, and stakeholder coordination.',
        'long_description': (
            '<p>Implemented a 10+ page church website covering departments, staff profiles, service schedules, and event listings, establishing a digital presence from the ground up.</p>'
            '<p>Managed custom HTML/CSS alongside a WordPress CMS, enabling non-technical staff to update content with 80% less developer intervention.</p>'
            '<p>Accomplished full deployment to Vercel, achieving 99.9% uptime and reducing page load times by 30% through optimized DNS routing.</p>'
            '<p>Directed stakeholder requirement gathering across time zones to deliver a complete digital transition within a strict 90-day lifecycle.</p>'
        ),
        'tech_stack': 'HTML5, CSS3, WordPress, Vercel, DNS',
        'start_date': date(2024, 6, 1),
        'end_date': date(2024, 8, 31),
    },
    {
        'title': 'Frontend Web Developer',
        'company_name': 'Minecraft-Themed Game Portal',
        'short_description': 'Developed a custom Minecraft-themed webpage for hosting an Unreal Engine game through browser-based iframe delivery, themed assets, and player-focused onboarding.',
        'long_description': (
            '<p>Managed the development of a custom Minecraft-themed webpage designed specifically to host an Unreal Engine game, supporting up to 500+ concurrent players.</p>'
            '<p>Implemented seamless browser-based game delivery via iframe embedding, eliminating downloads and improving player onboarding.</p>'
            '<p>Directed interface design using custom-themed assets to match the game mechanics and presentation.</p>'
        ),
        'tech_stack': 'HTML5, CSS3, JavaScript, Unreal Engine, iframe',
        'start_date': date(2025, 5, 1),
        'end_date': date(2025, 6, 30),
    },
    {
        'title': 'Freelance Game Developer',
        'company_name': 'Private Client',
        'short_description': 'Managed end-to-end development of a commercial 2D adventure title in Unity using C#, including enemy AI behaviors and performance optimization.',
        'long_description': (
            '<p>Managed the end-to-end development of a commercial 2D adventure title in Unity using C#.</p>'
            '<p>Scripted 15+ complex enemy AI behaviors and optimized frame rates to a stable 60 FPS on low-end devices.</p>'
        ),
        'tech_stack': 'Unity 2D, C#, Game Development, AI Behaviors, Performance Optimization',
        'start_date': date(2025, 9, 1),
        'end_date': date(2026, 1, 31),
    },
]


PLACEHOLDER_PROJECT_TITLES = [
    'RAG Portfolio Assistant',
    'AWS CI/CD Portfolio Platform',
    'Cloud Infrastructure Lab',
    'Django Admin CMS API',
    'Fake Project 1',
]

PLACEHOLDER_EXPERIENCE_TITLES = [
    'Church Website - WordPress Build',
    'Church Website - Custom Coded Version',
    'Web-Based Game Portal',
    'Game Development Collaboration',
]


class Command(BaseCommand):
    help = 'Seed portfolio projects and work experience from the 2026 resume.'

    def add_arguments(self, parser):
        parser.add_argument(
            '--prune-placeholders',
            action='store_true',
            help='Remove known demo project and experience rows while preserving other admin-managed content.',
        )

    def handle(self, *args, **options):
        project_count = 0
        experience_count = 0
        pruned_projects = 0
        pruned_experience = 0

        if options['prune_placeholders']:
            pruned_projects, _ = Project.objects.filter(title__in=PLACEHOLDER_PROJECT_TITLES).delete()
            pruned_experience, _ = WorkExp.objects.filter(title__in=PLACEHOLDER_EXPERIENCE_TITLES).delete()

        for item in PROJECTS:
            Project.objects.update_or_create(
                title=item['title'],
                defaults=item,
            )
            project_count += 1

        for item in EXPERIENCES:
            WorkExp.objects.update_or_create(
                title=item['title'],
                company_name=item['company_name'],
                defaults=item,
            )
            experience_count += 1

        message = f'Seeded {project_count} resume projects and {experience_count} resume work experiences.'
        if options['prune_placeholders']:
            message += f' Pruned {pruned_projects} placeholder projects and {pruned_experience} placeholder work experiences.'

        self.stdout.write(self.style.SUCCESS(message))
