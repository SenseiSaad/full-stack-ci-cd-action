from datetime import date
from django.core.management.base import BaseCommand
from portfolio_api.models import Experience, Log, ProcessStep, Project, SiteProfile, Skill, SocialLink


class Command(BaseCommand):
    help = 'Create the initial editable portfolio records.'

    def handle(self, *args, **options):
        SiteProfile.objects.update_or_create(id=1, defaults={
            'name': 'Saad Waseem', 'role': 'Django Backend Developer | AWS & DevOps',
            'tagline': 'Cloud and DevOps focused developer building reliable Django services, AWS infrastructure, and repeatable delivery pipelines.',
            'status': 'Available for junior DevOps / Cloud Engineer opportunities', 'email': 'obsks23@gmail.com', 'location': 'Lahore, Pakistan',
            'summary': 'Cloud and DevOps focused developer with 2+ years of freelance delivery for international clients. I build Django and Django REST Framework services, containerise applications, provision AWS infrastructure, and troubleshoot live Linux workloads.',
            'current_work': 'Currently working hands-on with backend APIs, Docker, Terraform, GitHub Actions, AWS EC2/ECS/Fargate, RDS, S3, Nginx, and production debugging.',
            'future_direction': 'My next step is to grow into a junior DevOps or Cloud Engineer role where I can own reliable delivery pipelines, improve observability and infrastructure, and keep backend engineering close to real production systems.',
        })
        self.stdout.write(self.style.SUCCESS('Profile created.'))
        social = [
            ('Email', 'obsks23@gmail.com', 'mailto:obsks23@gmail.com', '✉'),
            ('GitHub', 'github.com/SenseiSaad', 'https://github.com/SenseiSaad', '⌘'),
            ('LinkedIn', 'linkedin.com/in/saadwaseemcloud', 'https://www.linkedin.com/in/saadwaseemcloud', 'in'),
            ('Resume', 'Download resume', '/resume.pdf', '↓'),
        ]
        for order, (label, value, url, icon) in enumerate(social):
            SocialLink.objects.update_or_create(label=label, defaults={'value': value, 'url': url, 'icon': icon, 'order': order, 'is_published': True})
        SocialLink.objects.filter(label__in=['Fiverr', 'Upwork']).delete()

        skills = [
            ('backend', 'Backend Architecture', 'Python, Django & DRF', '#ff2a85', 'Building maintainable Django and Django REST Framework APIs with JWT authentication, role-based access control, pagination, filtering, Swagger/OpenAPI documentation, and PostgreSQL-backed data models.'),
            ('aws', 'AWS Cloud Infra', 'EC2, ECS/Fargate & RDS', '#00e5ff', 'Deploying containerised workloads across AWS EC2 and ECS/Fargate with ECR, RDS PostgreSQL, S3, CloudFront, Route 53, IAM, CloudWatch, Secrets Manager, and private networking.'),
            ('devops', 'DevOps & CI/CD', 'Terraform & Docker', '#ff7b00', 'Provisioning repeatable infrastructure with Terraform, packaging services with Docker, and automating build, image publishing, and deployment workflows through GitHub Actions.'),
        ]
        for order, (key, primary, secondary, color, description) in enumerate(skills):
            Skill.objects.update_or_create(key=key, defaults={'title_primary': primary, 'title_secondary': secondary, 'accent_color': color, 'description': description, 'order': order})

        experiences = [
            ('thinkwell-backend-devops', 'Thinkwell', 'Backend & DevOps Engineer (Freelance)', 'Jun 2026 — Aug 2026', 'Remote · US client', 'Production Node.js Operations on AWS EC2', 'Operated and stabilised a production Node.js/TypeScript backend on Ubuntu, covering Nginx, PM2, Redis, DNS, SSL/TLS, and deployment troubleshooting.', ['Resolved an out-of-memory build failure on an EC2 instance with roughly 908 MB of usable RAM.', 'Traced a PM2 startup failure to an application entry-path mismatch and restored the service.', 'Migrated the server environment with an EC2 AMI snapshot while sequencing DNS and certificate changes to minimise downtime.', 'Documented deployment, logging, recovery, and verification steps for independent client operations.'], ['Node.js', 'TypeScript', 'AWS EC2', 'Ubuntu', 'Nginx', 'PM2', 'Redis'], 'Production troubleshooting & recovery'),
            ('freelance-web-cloud', 'Freelance Clients', 'Freelance Web & Cloud Developer', '2024 — Present', 'Remote · US, Portugal & direct clients', 'Full-Stack Delivery from Website to AWS Deployment', 'Deliver responsive websites and backend services while handling hosting, deployment, production debugging, and repeatable delivery workflows end to end.', ['Built responsive WordPress and custom HTML/CSS/JavaScript websites, including domain, hosting, theme, plugin, and content setup.', 'Containerised Django applications and deployed them to AWS EC2 behind Nginx and Gunicorn with S3 storage and Certbot HTTPS.', 'Debugged live production defects through local reproduction, root-cause isolation, and Git pull requests.', 'Replaced manual deployment steps with Docker and GitHub Actions pipelines.'], ['Python', 'Django REST', 'Docker', 'AWS EC2', 'Nginx', 'Gunicorn', 'GitHub Actions'], '2+ years freelance delivery'),
        ]
        for order, item in enumerate(experiences):
            slug, company, role, period, location, headline, description, deliverables, tech, metric = item
            Experience.objects.update_or_create(slug=slug, defaults={'company': company, 'role': role, 'period': period, 'location': location, 'headline': headline, 'description': description, 'deliverables': deliverables, 'tech': tech, 'metric': metric, 'order': order})

        projects = [
            ('mycraft-theme', 'MyCraft Theme Web Application', 'frontend', 'Web Development', 'RESPONSIVE WEB APPLICATION', 'Interactive Minecraft-themed web application with a custom responsive interface, themed UI components, embedded gameplay functionality, and optimised client-side assets.', ['HTML5', 'CSS3', 'JavaScript', 'Responsive Design'], 'Desktop & mobile ready', True),
            ('saadops-platform', 'Personal Portfolio Platform', 'cloud', 'Cloud & DevOps', 'REACT / DJANGO / AWS', 'Decoupled React/Vite and Django REST Framework platform with admin-managed projects, blogs, and experience, deployed with Docker and Terraform.', ['React/Vite', 'Django REST', 'Docker', 'AWS EC2', 'Terraform', 'GitHub Actions'], 'Automated build & deployment', True),
            ('django-rest-infrastructure', 'Django REST API · AWS Container Infrastructure', 'cloud', 'Cloud & DevOps', 'ECR / ECS / TERRAFORM', 'Containerised Django REST Framework application with reproducible Terraform infrastructure and GitHub Actions automation for ECR image publishing and ECS deployment.', ['Django REST Framework', 'Docker', 'Terraform', 'AWS ECR', 'AWS ECS', 'GitHub Actions'], 'Reproducible infrastructure workflow', True),
            ('thinkwell-platform', 'ThinkWell · Production Django REST Platform', 'backend', 'Backend Development', 'ECS FARGATE / RDS / CI/CD', 'Production-oriented Django REST platform using Docker and Terraform, with ECS Fargate, ECR, RDS PostgreSQL, and automated GitHub Actions deployment.', ['Django REST', 'Docker', 'Terraform', 'AWS ECS Fargate', 'ECR', 'RDS', 'GitHub Actions'], 'Scalable container deployment', True),
            ('ecommerce-infrastructure', 'E-Commerce Platform · AWS Production Infrastructure', 'cloud', 'Cloud & DevOps', 'OBSERVABILITY & AUTOSCALING', 'Containerised e-commerce infrastructure with Terraform-managed AWS networking, ECS Fargate, RDS PostgreSQL, Secrets Manager, CI/CD, autoscaling, and observability.', ['Django REST', 'Terraform', 'ECS Fargate', 'RDS', 'Secrets Manager', 'Helm', 'Prometheus', 'Grafana', 'Loki'], 'Monitored scalable workload', False),
        ]
        for order, item in enumerate(projects):
            slug, title, category, category_label, tag, description, tech, metrics, featured = item
            case_studies = {
                'mycraft-theme': 'Developed an interactive Minecraft-themed web application with custom responsive layouts, themed UI components, embedded gameplay functionality, and optimised client-side assets for desktop and mobile users.',
                'saadops-platform': 'Built a decoupled React/Vite and Django REST Framework portfolio platform so projects, blogs, and professional experience can be managed through Django admin. Containerised the backend with Docker, provisioned AWS infrastructure with Terraform, and automated delivery with GitHub Actions.',
                'django-rest-infrastructure': 'Developed and containerised a Django REST Framework application, then provisioned its AWS infrastructure as code with Terraform. ECR, ECS, and GitHub Actions provide a reproducible image publishing and deployment workflow.',
                'thinkwell-platform': 'Built a production-oriented Django REST Framework platform with Docker and Terraform. ECR and ECS Fargate provide scalable container deployment, while RDS PostgreSQL and GitHub Actions support the application and delivery pipeline.',
                'ecommerce-infrastructure': 'Built a containerised e-commerce platform on Terraform-managed AWS infrastructure with ECS Fargate, ECR, RDS PostgreSQL, private networking, NAT Gateway, Secrets Manager, Helm, and GitHub Actions. Added Prometheus, Grafana, Loki, and autoscaling for observability and changing demand.',
            }
            Project.objects.update_or_create(slug=slug, defaults={'title': title, 'category': category, 'category_label': category_label, 'tag': tag, 'description': description, 'tech': tech, 'metrics': metrics, 'case_study': case_studies[slug], 'featured': featured, 'order': order})

        logs = [
            ('building-reliable-django-deployments', 'Building Reliable Django Deployments on AWS', '2026-08-28', 'Django · AWS · DevOps', 'A practical checklist for taking a Django service from a working container to a repeatable, observable production deployment.', ['A production deployment is more than getting a container to start. It needs a predictable build, explicit configuration, useful logs, health checks, and a recovery path.', 'My baseline is a Django REST service packaged with Docker, PostgreSQL hosted on RDS, object storage on S3, and a CI/CD workflow that builds and publishes an immutable image before deployment.', 'The final step is operational clarity: document the commands, alarms, rollback process, and verification checks so the system can be operated by someone else without guessing.']),
            ('debugging-low-memory-ec2-builds', 'Debugging Low-Memory EC2 Builds', '2026-08-12', 'AWS · Linux · Troubleshooting', 'What I check when a small EC2 instance fails during dependency installation or an application build.', ['When a build fails on a small instance, I first separate application errors from resource exhaustion. Kernel messages, process status, and available memory usually make the cause clear.', 'A temporary swap file can provide breathing room, but it is not a substitute for right-sizing the instance or moving builds into CI. The durable fix should reduce production risk rather than hide it.', 'I also record the exact build command, memory usage, instance size, and recovery steps. That turns a one-off incident into a repeatable runbook.']),
        ]
        for order, (slug, title, published, category, excerpt, content) in enumerate(logs):
            Log.objects.update_or_create(slug=slug, defaults={'title': title, 'date': date.fromisoformat(published), 'category': category, 'excerpt': excerpt, 'content': content, 'order': order})

        steps = [('01', 'Understand the workload', 'I start with the product, traffic, deployment constraints, and failure modes so the architecture solves the real problem—not just the visible symptom.', 'Requirements · Architecture · Risk review'), ('02', 'Build a reliable foundation', 'I develop maintainable Django/DRF services, containerise them with Docker, and keep application configuration separate from reusable Terraform infrastructure.', 'Python · Django REST · Docker · Terraform'), ('03', 'Automate the path to production', 'I connect GitHub Actions with AWS services such as ECR, ECS/Fargate, EC2, RDS, and S3 so every release is repeatable, observable, and easy to recover.', 'GitHub Actions · AWS · CI/CD · IaC'), ('04', 'Operate and hand over clearly', 'I troubleshoot from logs and metrics, harden Nginx/Gunicorn and Linux workloads, then document deployment, recovery, and verification steps for the team.', 'Linux · Nginx · Monitoring · Runbooks')]
        for order, (number, title, description, tools) in enumerate(steps):
            ProcessStep.objects.update_or_create(number=number, defaults={'title': title, 'description': description, 'tools': tools, 'order': order})
        self.stdout.write(self.style.SUCCESS('Portfolio seed data created/updated.'))