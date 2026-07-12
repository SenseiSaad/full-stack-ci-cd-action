# SaadOps Portfolio Project Review

This file is a full start-to-end review of the project: what was built, what tools were used, how the infrastructure works, what problems happened during deployment, and how to explain the project in an interview.

## 1. Project Summary

This is a full-stack portfolio project built with a separate backend and frontend.

The backend is a Django and Django REST Framework API. It stores portfolio data such as projects, work experience, blog/log entries, and contact messages. Django Admin is used as the content management panel, so the site owner can add or update content without editing frontend code.

The frontend is a static HTML/CSS/JavaScript site served by Nginx. It fetches data from the backend API and renders dynamic sections such as projects, work experience, writings, and contact form submission.

The project is containerized with Docker, deployed on AWS EC2, stores production data in AWS RDS PostgreSQL, stores container images in ECR, and uses GitHub Actions for CI/CD.

Current live domain status as of May 26, 2026:

- `https://saadops.site/` is the main frontend domain and returns `200 OK`.
- `https://www.saadops.site/` is covered by the same Certbot certificate.
- `https://api.saadops.site/` is the backend/API/admin domain.
- The EC2 public IP is `3.215.214.8`.
- Docker containers are healthy/reachable on EC2:
  - frontend: `127.0.0.1:3000` -> container port `80`
  - backend: `127.0.0.1:8000` -> Gunicorn port `8000`
- The domain is registered at Namecheap, but DNS is managed through Route 53.

## 2. What Backend Did I Build?

The backend is a REST API built with:

- Python
- Django
- Django REST Framework
- PostgreSQL in production
- SQLite fallback for simple local development
- Django Admin
- Gunicorn
- Whitenoise for static files
- django-cors-headers
- django-storages and boto3 for optional S3 storage

The backend is not serving the frontend template anymore. Earlier, the backend had a template-based page, but the frontend was separated into its own static Nginx service. This is cleaner because the backend only handles APIs/admin/health checks, while the frontend handles UI.

## 3. Backend Apps

The Django project has these main apps:

### portfolio

This is the main Django project folder. It contains:

- `settings.py`
- root URL routing
- health check endpoint
- API root endpoint
- WSGI/ASGI configuration

Important endpoints:

- `/health/`
- `/api/`
- `/admin/`

The health check returns a small JSON response showing that the backend process is alive.

### projects

This app stores portfolio projects.

Current fields:

- `title`: required
- `short_description`: required
- `long_description`: optional
- `tech_stack`: optional
- `live_url`: optional
- `github_link`: optional
- `created_at`
- `updated_at`

The frontend preview shows only the title, short description, and tech stack. When someone clicks the project, the full detail view opens inside the same page.

### work_exp

This app stores work experience.

Current fields:

- `title`: required
- `short_description`: required
- `long_description`: optional
- `tech_stack`: optional
- `live_url`: optional
- `github_link`: optional
- `company_name`: optional
- `start_date`: optional
- `end_date`: optional

This structure lets work experience behave like project cards: short preview first, then full detail on click.

### logs

This app stores writings, blogs, or project logs.

Current fields:

- `title`: required
- `short_description`: required
- `long_description`: optional rich text
- `tech_stack`: optional
- `live_url`: optional
- `github_link`: optional
- `category`: optional
- `created_at`
- `updated_at`

The `long_description` is sanitized before saving/returning so unsafe HTML is removed. This is important because rich text can otherwise create XSS security risks.

### messages_app

This app stores contact form messages.

Fields:

- `name`
- `email`
- `subject`
- `message`
- `created_at`

The frontend contact form posts to the backend API, and the message is stored in the database.

## 4. DRF Logic

Django REST Framework is used to convert model objects into JSON and accept JSON input from the frontend.

Example flow for projects:

1. The browser requests `/api/projects/`.
2. Django routes the request to `project_list`.
3. The view queries `Project.objects.all()`.
4. `ProjectSerializer(projects, many=True)` converts the queryset into JSON.
5. DRF returns a JSON response.
6. The frontend reads that JSON and renders project cards.

Typical DRF pieces used:

- `@api_view`
- `Response`
- `ModelSerializer`
- CRUD endpoints

The project uses function-based DRF views. For a junior-level project, this is acceptable and easy to explain. A more advanced version could use DRF generic views or ViewSets with routers.

## 5. Authentication

This project uses Django's built-in authentication for Django Admin.

Important point: this project does not currently use JWT.

There is no `djangorestframework-simplejwt` dependency and no JWT login/refresh endpoints configured. If asked in an interview, the correct answer is:

> The project currently uses Django's built-in admin/session authentication for content management. Public API endpoints are mostly read-focused for frontend display, and the admin panel is protected by Django authentication. JWT is not implemented yet, but it could be added later for a user-facing authenticated API.

The admin user is seeded through a custom command:

```bash
python manage.py seed_admin
```

In local Docker Compose, the default seed credentials are:

- username: `admin`
- password: `admin123`

In production, these should come from environment variables or GitHub secrets. Do not hardcode production admin credentials in code.

## 6. Database

The backend can use SQLite or PostgreSQL.

Local/simple mode:

- SQLite can be used when no PostgreSQL host is configured.

Docker local mode:

- PostgreSQL runs as a `db` container.
- Backend connects to `DB_HOST=db`.

Production mode:

- PostgreSQL runs on AWS RDS.
- Backend connects using `DB_HOST`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, and `DB_PORT`.

Normal PostgreSQL port:

```text
5432
```

## 7. Frontend

The frontend is now a static site:

- `frontend/index.html`
- `frontend/assets/styles.css`
- `frontend/nginx.conf`
- `frontend/Dockerfile`

The frontend does not hardcode project/work/blog cards anymore. It calls backend APIs:

- `/api/projects/`
- `/api/experience/`
- `/api/logs/`
- `/api/messages/create/`

The frontend is served by Nginx inside its own Docker container.

The frontend container listens internally on port `80`.

Locally or on EC2, Docker maps a host port to container port `80`.

Production mapping:

```yaml
frontend:
  ports:
    - "3000:80"
```

This means:

- host port `3000`
- container port `80`

When someone visits the EC2 host Nginx on port `80`, host Nginx proxies to `127.0.0.1:3000`, which then reaches the frontend container.

## 8. Docker

The project uses Docker for repeatable builds and deployment.

### Backend Dockerfile

The backend image:

1. Uses `python:3.12-slim`.
2. Installs Python dependencies in a virtual environment.
3. Copies the Django code.
4. Runs as a non-root `django` user.
5. Exposes port `8000`.
6. Defines a health check against `/health/`.
7. Runs:

```bash
python manage.py collectstatic --noinput
python manage.py migrate
python manage.py seed_admin
gunicorn --bind 0.0.0.0:8000 portfolio.wsgi:application
```

### Frontend Dockerfile

The frontend image:

1. Uses `nginx:1.27-alpine`.
2. Copies `nginx.conf`.
3. Copies `index.html`.
4. Copies `assets/styles.css`.
5. Exposes port `80`.

This is simple and stable because it does not require Node, npm, Tailwind CDN, or a build step during deployment.

## 9. Docker Compose

Local Compose has three services:

- backend
- frontend
- db

Local default ports:

```text
backend:  localhost:8000 -> container:8000
frontend: localhost:3000 -> container:80
db:       internal only, PostgreSQL on 5432
```

EC2 Compose has two services:

- backend
- frontend

Production database is not a Compose container because it is AWS RDS.

EC2 production ports:

```text
backend:  host 8000 -> container 8000
frontend: host 3000 -> container 80
```

## 10. Why 8001 and 3002 Were Used Locally

Normal development ports were:

- backend: `8000`
- frontend: `3000`

At one point, those ports were already occupied locally. To avoid conflicts, alternate host ports were used:

- backend: `8001`
- frontend: `3002`

This was okay for local testing. The important detail is that these are host-side ports. The containers still run internally on their normal ports:

- backend container: `8000`
- frontend container: `80`

The later mistake was that Nginx on EC2 still had a stale proxy configuration pointing to the local/testing frontend port `3002`. On EC2, the frontend was actually running on host port `3000`, so Nginx returned `502 Bad Gateway`.

## 11. Port Map Cheat Sheet

| Thing | Normal Port | In This Project |
| --- | --- | --- |
| Django dev server | 8000 | 8000 |
| Gunicorn backend container | 8000 | 8000 |
| Frontend dev/static host | 3000 | 3000 |
| Frontend container Nginx | 80 | 80 |
| EC2 public HTTP | 80 | 80 |
| EC2 public HTTPS | 443 | 443 |
| PostgreSQL | 5432 | 5432 |
| SSH | 22 | 22 |
| Temporary local backend alternate | custom | 8001 |
| Temporary local frontend alternate | custom | 3002 |

## 12. AWS Services Used

### EC2

EC2 is the virtual server that runs Docker, Docker Compose, AWS CLI, and host Nginx.

The containers run on EC2:

- backend container
- frontend container

Host Nginx runs directly on EC2 and reverse proxies traffic to the containers.

Current production routing:

```text
saadops.site      -> host Nginx 443 -> 127.0.0.1:3000 -> frontend container
www.saadops.site  -> host Nginx 443 -> 127.0.0.1:3000 -> frontend container
api.saadops.site  -> host Nginx 443 -> 127.0.0.1:8000 -> backend container
```

HTTP traffic on port `80` redirects to HTTPS after Certbot is installed.

### ECR

ECR stores Docker images.

There are two repositories:

- `portfolio-backend`
- `portfolio-frontend`

GitHub Actions builds images and pushes them to ECR. EC2 pulls those images during deployment.

### RDS PostgreSQL

RDS stores production data.

It is private, not publicly accessible. The RDS security group allows PostgreSQL traffic only from the EC2 app security group.

### S3

S3 is configured as a private bucket for app assets/media storage if enabled through environment variables.

### IAM

IAM gives EC2 permission to pull from ECR and access the S3 bucket.

The EC2 instance has an instance profile with:

- ECR read access
- CloudWatch agent policy
- app S3 bucket access

### VPC

The Terraform creates a VPC with:

- one public subnet for EC2
- private subnets for RDS
- internet gateway
- route table for public internet access

### Security Groups

The EC2 security group allows:

- port 22 for SSH
- port 80 for HTTP
- port 443 for HTTPS
- optional temporary port 8000 from allowed IP for direct backend testing

The RDS security group allows:

- port 5432 only from the EC2 security group

## 13. Terraform Basics

Terraform is Infrastructure as Code. Instead of manually creating infrastructure in AWS Console, Terraform files describe what resources should exist.

Common commands:

```bash
terraform init
terraform plan
terraform apply
terraform destroy
```

### terraform init

Downloads providers, such as the AWS provider.

### terraform plan

Shows what Terraform will create, update, or destroy.

### terraform apply

Actually creates or updates the infrastructure.

### terraform destroy

Deletes the infrastructure managed by Terraform.

### Important Terraform Files

- `provider.tf`: AWS provider and region setup.
- `variables.tf`: configurable inputs.
- `terraform.tfvars`: real values for variables.
- `vpc.tf`: VPC, subnets, route table, internet gateway.
- `security.tf`: EC2 and RDS security groups.
- `ec2.tf`: EC2 server and bootstrapping script.
- `rds.tf`: PostgreSQL database.
- `ecr.tf`: Docker image repositories.
- `s3.tf`: private S3 bucket.
- `iam.tf`: EC2 role and permissions.
- `outputs.tf`: useful output values like EC2 IP, ECR URLs, RDS host.

Security note: `terraform.tfvars` and `terraform.tfstate` can contain secrets. They should not be committed to a public repository.

## 14. Deployment Flow Before GitHub Actions

Manual deployment worked like this:

1. Build backend and frontend Docker images.
2. Push images to ECR.
3. SSH into EC2.
4. Install Docker, Docker Compose, AWS CLI, and Nginx.
5. Login to ECR from EC2.
6. Create `.env` file on EC2.
7. Create `docker-compose.yml` on EC2.
8. Pull images from ECR.
9. Run `docker compose up -d`.
10. Configure host Nginx to proxy traffic to containers.

This proved that the project could run live before automation was added.

## 15. GitHub Actions CI/CD Flow

The workflow is `.github/workflows/deploy.yml`.

It runs on:

- push to `main`
- push to `develop`
- pull request into `main` or `develop`
- manual workflow dispatch

### backend_checks job

This job:

1. Checks out code.
2. Sets up Python 3.12.
3. Installs backend dependencies.
4. Runs `python manage.py check`.
5. Runs migrations.
6. Runs tests.

This verifies that the Django project can load and pass tests.

### docker_builds job

This job:

1. Builds backend image.
2. Smoke-tests backend image.
3. Builds frontend image.

This catches Dockerfile problems before deployment.

### publish_images job

This runs only for:

- push to main
- manual workflow dispatch

It:

1. Configures AWS credentials.
2. Logs in to ECR.
3. Builds and pushes backend image.
4. Builds and pushes frontend image.

### deploy job

This:

1. SSHs into EC2.
2. Logs EC2 into ECR.
3. Writes `/home/ubuntu/app/.env`.
4. Writes `/home/ubuntu/app/docker-compose.yml`.
5. Pulls latest images.
6. Runs `docker compose up -d --force-recreate`.
7. Rewrites EC2 Nginx config.
8. Reloads Nginx.

The deploy workflow is certificate-aware:

- Before Certbot certificates exist, it writes an HTTP Nginx config so `saadops.site` can work on port `80`.
- After certificates exist at `/etc/letsencrypt/live/saadops.site/` and `/etc/letsencrypt/live/api.saadops.site/`, it writes the HTTPS Nginx config with `443 ssl`.

## 16. GitHub Secrets Used

Important secrets:

- `AWS_ACCESS_KEY_ID`
- `AWS_SECRET_ACCESS_KEY`
- `SECRET_KEY`
- `ALLOWED_HOSTS`
- `CORS_ALLOWED_ORIGINS`
- `DB_NAME`
- `DB_USER`
- `DB_PASSWORD`
- `DB_HOST`
- `DB_PORT`
- `AWS_STORAGE_BUCKET_NAME`
- `AWS_S3_REGION_NAME`
- `EC2_HOST`
- `EC2_USER`
- `EC2_SSH_KEY`
- `EC2_SSH_PORT`
- `ECR_REGISTRY`
- `ECR_BACKEND_URL`
- `ECR_FRONTEND_URL`

The important mistake was missing or incorrect secrets, especially:

- `EC2_HOST`
- `DB_HOST`

When `EC2_HOST` was missing or wrong, SSH failed.

When `DB_HOST` was missing, the backend could not connect properly to RDS.

## 17. Problems Faced and Fixes

### Problem 1: Two workflow files

There were two GitHub workflow files, so multiple workflows were running and confusing the deployment.

Fix:

Keep one workflow: `deploy.yml`.

Reason:

One clear CI/CD file is easier to understand and debug for a solo project.

### Problem 2: Missing GitHub secrets

The workflow needed secrets for AWS, EC2 SSH, ECR, Django, and RDS.

Fix:

Add missing secrets, especially `EC2_HOST` and `DB_HOST`.

### Problem 3: SSH connection refused or timeout

Common causes:

- wrong EC2 host/IP
- security group not allowing port 22
- wrong EC2 user
- wrong private key
- instance not reachable

Fix:

Use the correct EC2 public IP or Elastic IP in `EC2_HOST`, allow SSH in the EC2 security group, use `ubuntu` as the user for Ubuntu AMI, and paste the full private key into `EC2_SSH_KEY`.

### Problem 4: Docker container name conflict

Error:

```text
container name "/portfolio-backend" is already in use
```

Meaning:

A previous container already existed with that name.

Fix:

Remove old containers or use `docker compose down`, then redeploy.

### Problem 5: Docker login warning

Warning:

```text
credentials are stored unencrypted
```

Meaning:

Docker stored ECR login credentials in the user's Docker config file.

This was a warning, not the deployment failure.

The real failure was the container name conflict.

### Problem 6: 502 Bad Gateway

Error:

```text
502 Bad Gateway nginx/1.18.0
```

Meaning:

Host Nginx could not reach the upstream service.

Actual cause:

Nginx was proxying to stale port `3002`, but the frontend container on EC2 was running on port `3000`.

Fix:

Update Nginx proxy target from:

```nginx
proxy_pass http://127.0.0.1:3002/;
```

to:

```nginx
proxy_pass http://127.0.0.1:3000/;
```

Then run:

```bash
sudo nginx -t
sudo systemctl restart nginx
```

Later, the GitHub Actions deploy script was updated to rewrite Nginx automatically, so the same stale-port issue should not come back.

### Problem 7: Backend unhealthy

Docker showed backend as unhealthy because `/health/` returned `400`.

Likely cause:

Django rejected the request due to `ALLOWED_HOSTS`.

Fix:

Include required hosts:

- `saadops.site`
- `www.saadops.site`
- `api.saadops.site`
- EC2 IP, currently `3.215.214.8`
- `localhost`
- `127.0.0.1`
- `backend`

Current production value should look like:

```env
ALLOWED_HOSTS=3.215.214.8,saadops.site,www.saadops.site,api.saadops.site,localhost,127.0.0.1,backend
```

### Problem 8: Elastic IP and domain routing

The EC2 public IP can change when an instance stops/starts. An Elastic IP gives a stable IP.

Fix:

Attach Elastic IP to EC2 and point Route 53 records to that Elastic IP.

Desired routing:

- `saadops.site` -> frontend
- `www.saadops.site` -> frontend
- `api.saadops.site` -> Django admin/backend

Nginx handles this with two server blocks:

- frontend server block proxies to `127.0.0.1:3000`
- backend/admin server block proxies to `127.0.0.1:8000`

Actual Route 53 records should be:

```text
saadops.site      A  3.215.214.8
www.saadops.site  A  3.215.214.8
api.saadops.site  A  3.215.214.8
```

Because the domain was bought at Namecheap, Namecheap must use the Route 53 hosted zone nameservers. Route 53 records only matter if the domain delegates DNS to Route 53.

### Problem 9: IP 404 and domain loading loop

Symptoms:

```text
http://EC2_IP/ -> 404 Not Found nginx/1.18.0 (Ubuntu)
https://saadops.site/ -> loading loop or timeout
```

What the checks showed:

```text
docker ps -> frontend and backend containers were running
curl -I http://127.0.0.1:3000/ -> 200 OK
curl -I http://127.0.0.1:8000/health/ -> 405 Method Not Allowed
```

The `405` was not a backend failure. It happened because `curl -I` sends a `HEAD` request, while the health endpoint allows `GET` and `OPTIONS`. The correct health test is:

```bash
curl http://127.0.0.1:8000/health/
```

Root cause:

Host Nginx and DNS/HTTPS routing needed to be corrected. The app containers were already healthy.

Fix:

1. Remove the default Nginx site.
2. Enable `/etc/nginx/sites-available/portfolio`.
3. Make sure host Nginx proxies frontend traffic to `127.0.0.1:3000`.
4. Make sure host Nginx proxies backend/API traffic to `127.0.0.1:8000`.
5. Install/reinstall Certbot certificates for:
  - `saadops.site`
  - `www.saadops.site`
  - `api.saadops.site`
6. Confirm Route 53 points all three records to the EC2 IP.

Important command results:

```text
curl -4 ifconfig.me -> 3.215.214.8
dig +short saadops.site -> 3.215.214.8
dig +short www.saadops.site -> 3.215.214.8
dig +short api.saadops.site -> 3.215.214.8
sudo ss -tlnp | grep ':443' -> nginx listening on 0.0.0.0:443
sudo ufw status -> inactive
```

After fixing Nginx/Certbot:

```text
curl -Ik https://saadops.site/ -> 200 OK
```

Remaining API/admin issue:

```text
curl -Ik https://api.saadops.site/admin/ -> 400 Bad Request
```

Likely cause:

Django backend container environment did not include `api.saadops.site` in `ALLOWED_HOSTS`, or the backend container had not been recreated after `.env` was updated.

Fix:

```bash
sudo nano /home/ubuntu/app/.env
```

Set:

```env
ALLOWED_HOSTS=3.215.214.8,saadops.site,www.saadops.site,api.saadops.site,localhost,127.0.0.1,backend
CORS_ALLOWED_ORIGINS=https://saadops.site,https://www.saadops.site,http://saadops.site,http://www.saadops.site
```

Then recreate backend:

```bash
cd /home/ubuntu/app
docker compose up -d --force-recreate backend
```

Retest:

```bash
curl -Ik https://api.saadops.site/admin/
curl https://api.saadops.site/health/
```

## 18. Current Condition of the Project

This is a strong junior-level project because it includes:

- Django backend
- DRF APIs
- admin-managed content
- contact form persistence
- database models and migrations
- Dockerization
- local Compose
- production EC2 deployment
- RDS PostgreSQL
- ECR image registry
- Terraform infrastructure
- GitHub Actions CI/CD
- Nginx reverse proxy
- HTTPS with Certbot
- Namecheap domain delegated to Route 53
- real debugging experience

What is not included yet:

- JWT authentication
- user registration/login APIs
- permission classes for write endpoints
- automated frontend tests
- ALB/ECS production architecture
- remote Terraform backend
- secrets manager integration
- monitoring/alerts

This is enough to explain for a junior backend/cloud role. For a stronger version, add authentication permissions, HTTPS, better tests, and cleanup around secrets/state.

## 19. Interview-Style Questions and Answers

### Q1. What did you build?

I built a full-stack portfolio platform with a Django REST API backend and a separate static frontend. The backend stores projects, work experience, writings, and contact messages. The frontend fetches that data from APIs and renders it dynamically. I deployed it with Docker on AWS EC2, used RDS PostgreSQL for production data, ECR for Docker images, Terraform for infrastructure, and GitHub Actions for CI/CD.

### Q2. Why did you separate frontend and backend?

Separating them makes the backend focus on API, admin, database, and business logic. The frontend becomes a static client that consumes the API. This also matches many real deployments where frontend and backend are separate services.

### Q3. What is Django REST Framework doing here?

DRF converts Django model data into JSON and validates incoming JSON. For example, `ProjectSerializer` turns project rows into API responses that the frontend can render.

### Q4. Did you use JWT?

No. This project currently uses Django's built-in admin/session authentication for admin access. JWT is not implemented yet. If I needed user-facing login APIs, I would add `djangorestframework-simplejwt`, create login/refresh endpoints, and protect write APIs with permissions.

### Q5. What is a serializer?

A serializer converts complex data like Django model instances into JSON and validates JSON before saving it to the database.

Example:

```python
serializer = ProjectSerializer(projects, many=True)
return Response(serializer.data)
```

### Q6. What is a migration?

A migration is Django's way of versioning database schema changes. When I add or rename model fields, Django creates migration files. Running `python manage.py migrate` applies those changes to the database.

### Q7. What is Gunicorn?

Gunicorn is a production WSGI server for Python web apps. Django's development server is not meant for production, so the backend container runs Django through Gunicorn.

### Q8. What is Nginx doing?

There are two Nginx roles:

1. Frontend container Nginx serves the static frontend files.
2. Host EC2 Nginx receives public HTTP/HTTPS traffic, redirects HTTP to HTTPS after Certbot is installed, and proxies requests to either the frontend container or backend container.

### Q9. What is Docker Compose?

Docker Compose runs multiple containers together using one YAML file. Locally it runs backend, frontend, and database. On EC2 it runs backend and frontend because the database is RDS.

### Q10. Why did 502 happen?

Nginx was trying to reach an upstream service on the wrong port. It pointed to `127.0.0.1:3002`, but on EC2 the frontend was running on `127.0.0.1:3000`. Nginx could not connect, so it returned `502 Bad Gateway`.

### Q11. What is Terraform?

Terraform is Infrastructure as Code. It lets me define AWS resources in `.tf` files and create them with `terraform apply`.

### Q12. What AWS resources did Terraform create?

It created VPC, subnets, route table, internet gateway, EC2, security groups, RDS PostgreSQL, ECR repositories, S3 bucket, IAM role, and outputs.

### Q13. Why use ECR?

ECR is AWS's Docker image registry. GitHub Actions pushes backend and frontend images to ECR, and EC2 pulls those images during deployment.

### Q14. Why use RDS instead of a database container in production?

RDS is managed PostgreSQL. AWS handles database reliability features better than a simple database container on the same EC2 instance. It also keeps data separate from the app server.

### Q15. What is a security group?

A security group is a virtual firewall for AWS resources. The EC2 security group controls SSH, HTTP, and HTTPS access. The RDS security group only allows database traffic from the EC2 app security group.

### Q16. Why did you need an Elastic IP?

An EC2 public IP can change after stop/start. An Elastic IP stays stable, so Route 53 DNS records can point to it reliably.

### Q17. What happens when you push to main?

GitHub Actions runs checks, builds Docker images, pushes them to ECR, SSHs into EC2, pulls the latest images, recreates containers, and reloads Nginx.

### Q18. What happens when you push to develop?

The workflow runs checks and Docker builds, but it does not publish/deploy images unless it is a main push or manual workflow dispatch.

### Q19. What was the biggest debugging lesson?

Read logs carefully and separate warnings from real errors. For example, Docker's unencrypted credential message was only a warning. The real failure was the container name conflict. For 502, Nginx logs showed the real upstream port problem.

### Q20. What would you improve next?

I would protect write APIs with permission classes, add JWT only if user-facing login APIs are needed, add more tests, move secrets to AWS Secrets Manager or GitHub Environments, add monitoring/alerts, consider ALB/ECS for a larger production setup, and move Terraform state to an S3 backend with DynamoDB locking.

## 20. Commands Worth Knowing

### Docker

```bash
docker compose up --build -d
docker compose ps
docker compose logs backend
docker compose logs frontend
docker compose down
docker pull IMAGE_URL:latest
docker ps
docker logs CONTAINER_NAME
```

### Django

```bash
python manage.py check
python manage.py makemigrations
python manage.py migrate
python manage.py test
python manage.py createsuperuser
python manage.py seed_admin
```

### Nginx

```bash
sudo nginx -t
sudo systemctl reload nginx
sudo systemctl restart nginx
sudo tail -n 50 /var/log/nginx/error.log
sudo grep -R "proxy_pass" /etc/nginx/sites-available /etc/nginx/sites-enabled
```

### Terraform

```bash
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
terraform output
```

### EC2 Debugging

```bash
cd /home/ubuntu/app
docker compose ps
docker compose logs backend
docker compose logs frontend
curl -I http://127.0.0.1:3000
curl http://127.0.0.1:8000/health/
curl -I http://127.0.0.1
curl -Ik https://saadops.site/
curl -Ik https://api.saadops.site/admin/
```

## 21. Short Interview Pitch

I built a Dockerized Django REST Framework portfolio backend with a separate static frontend. The backend has multiple apps for projects, work experience, writings, and contact messages, all managed through Django Admin and exposed through REST APIs. I deployed it on AWS using Terraform for EC2, RDS, ECR, S3, IAM, VPC, and security groups. The live frontend runs on `https://saadops.site/`, while backend/admin traffic is routed through `https://api.saadops.site/`. GitHub Actions runs checks, builds Docker images, pushes them to ECR, and deploys to EC2 over SSH. During deployment I debugged real issues like missing GitHub secrets, SSH/security group problems, Docker container conflicts, stale Nginx proxy ports, DNS/Certbot routing, and Django `ALLOWED_HOSTS` failures.
