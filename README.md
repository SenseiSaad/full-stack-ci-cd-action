# SaadOps Portfolio

A Dockerized Django REST Framework portfolio backend with a separate static frontend, AWS infrastructure, and GitHub Actions CI/CD.

The project is built as a practical backend/cloud deployment project: content is managed from Django Admin, exposed through REST APIs, rendered by a static frontend, containerized with Docker, deployed on EC2, and backed by RDS PostgreSQL.

## Features

- Django REST Framework API
- Django Admin content management
- Projects, work experience, writings/logs, and contact messages
- Rich text support for writing long descriptions
- Static frontend served by Nginx
- Frontend fetches backend API data dynamically
- Dockerized backend and frontend
- Local Docker Compose setup with PostgreSQL
- AWS infrastructure with Terraform
- ECR image publishing
- EC2 deployment with Docker Compose
- RDS PostgreSQL production database
- GitHub Actions CI/CD pipeline
- Host Nginx reverse proxy for frontend and backend/admin routing

## Tech Stack

### Backend

- Python
- Django
- Django REST Framework
- PostgreSQL
- Gunicorn
- Whitenoise

### Frontend

- HTML
- CSS
- JavaScript
- Nginx

### DevOps and Cloud

- Docker
- Docker Compose
- AWS EC2
- AWS RDS PostgreSQL
- AWS ECR
- AWS S3
- AWS IAM
- AWS VPC and Security Groups
- Terraform
- GitHub Actions

## Project Structure

```text
.
├── backend/
│   ├── portfolio/          # Django project settings, URLs, health/API root
│   ├── projects/           # Project API and admin model
│   ├── work_exp/           # Work experience API and admin model
│   ├── logs/               # Writings/logs API with rich text sanitization
│   ├── messages_app/       # Contact form message API
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── index.html
│   ├── assets/styles.css
│   ├── nginx.conf
│   └── Dockerfile
├── infrastructure/
│   ├── ec2.tf
│   ├── ecr.tf
│   ├── iam.tf
│   ├── rds.tf
│   ├── s3.tf
│   ├── security.tf
│   ├── vpc.tf
│   ├── variables.tf
│   └── outputs.tf
├── .github/workflows/deploy.yml
├── docker-compose.yml
├── docker-compose.ec2.yml
└── review.md
```

## Backend Apps

### Projects

Stores portfolio projects with:

- title
- short description
- long description
- tech stack
- live URL
- GitHub link

### Work Experience

Stores experience cards with:

- title
- company
- dates
- short description
- long description
- tech stack
- optional links

### Logs

Stores writings or project logs with:

- title
- short description
- rich long description
- category
- optional tech stack and links

### Messages

Stores contact form submissions from the frontend.

## API Endpoints

```text
GET  /health/
GET  /api/
GET  /api/projects/
POST /api/projects/create/
GET  /api/projects/<id>/
PUT  /api/projects/<id>/update/
DELETE /api/projects/<id>/delete/

GET  /api/experience/
POST /api/experience/create/
GET  /api/experience/<id>/
PUT  /api/experience/<id>/update/
DELETE /api/experience/<id>/delete/

GET  /api/logs/
POST /api/logs/create/
GET  /api/logs/<id>/
PUT  /api/logs/<id>/update/
DELETE /api/logs/<id>/delete/

GET  /api/messages/
POST /api/messages/create/
GET  /api/messages/<id>/
DELETE /api/messages/<id>/delete/
```

## Authentication

The project currently uses Django's built-in authentication for Django Admin.

JWT is not currently implemented. Public frontend data is fetched from API endpoints, while content management is done through the protected Django Admin panel.

## Local Development

Create an environment file from the example if needed:

```bash
cp .env.example .env
```

Start the full local stack:

```bash
docker compose up --build -d
```

Default local URLs:

```text
Frontend: http://localhost:3000
Backend:  http://localhost:8000
Admin:    http://localhost:8000/admin/
Health:   http://localhost:8000/health/
```

Default local admin seed:

```text
username: admin
password: admin123
```

Check containers:

```bash
docker compose ps
docker compose logs backend
docker compose logs frontend
```

Stop containers:

```bash
docker compose down
```

## Docker Ports

Local default mappings:

```text
backend:  8000:8000
frontend: 3000:80
database: internal PostgreSQL 5432
```

Production EC2 mappings:

```text
backend:  8000:8000
frontend: 3000:80
```

Host Nginx receives public traffic and proxies to the Docker containers:

```text
slancer.site     -> 127.0.0.1:3000
www.slancer.site -> 127.0.0.1:3000
api.slancer.site -> 127.0.0.1:8000
```

## CI/CD

GitHub Actions workflow:

```text
.github/workflows/deploy.yml
```

Pipeline stages:

1. Install backend dependencies.
2. Run Django checks.
3. Run migrations in CI.
4. Run backend tests.
5. Build backend Docker image.
6. Build frontend Docker image.
7. Push images to ECR on `main` or manual dispatch.
8. SSH into EC2.
9. Pull latest images.
10. Recreate containers.
11. Rewrite and reload Nginx config.

## Required GitHub Secrets

```text
AWS_ACCESS_KEY_ID
AWS_SECRET_ACCESS_KEY
SECRET_KEY
ALLOWED_HOSTS
CORS_ALLOWED_ORIGINS
DB_NAME
DB_USER
DB_PASSWORD
DB_HOST
DB_PORT
AWS_STORAGE_BUCKET_NAME
AWS_S3_REGION_NAME
EC2_HOST
EC2_USER
EC2_SSH_KEY
EC2_SSH_PORT
ECR_REGISTRY
ECR_BACKEND_URL
ECR_FRONTEND_URL
```

## Terraform Infrastructure

Terraform creates:

- VPC
- public subnet for EC2
- private subnets for RDS
- internet gateway
- route table
- EC2 instance
- EC2 security group
- RDS PostgreSQL
- RDS security group
- ECR backend repository
- ECR frontend repository
- S3 bucket
- IAM role and instance profile

Common Terraform commands:

```bash
cd infrastructure
terraform init
terraform fmt
terraform validate
terraform plan
terraform apply
terraform output
```

## Deployment Notes

The EC2 instance runs:

- Docker
- Docker Compose plugin
- AWS CLI
- Nginx
- Certbot with the Nginx plugin

The deployment workflow writes these files on EC2:

```text
/home/ubuntu/app/.env
/home/ubuntu/app/docker-compose.yml
/etc/nginx/sites-available/portfolio
```

Then it runs:

```bash
docker pull <backend-image>
docker pull <frontend-image>
docker compose up -d --force-recreate
sudo nginx -t
sudo systemctl reload nginx
```

### EC2 Domain and HTTPS Cutover

1. Point DNS records to the EC2 public IP:

```text
A slancer.site     -> <EC2_PUBLIC_IP>
A www.slancer.site -> <EC2_PUBLIC_IP>
A api.slancer.site -> <EC2_PUBLIC_IP>
```

2. In the EC2 security group, allow inbound traffic:

```text
22/tcp  from your IP
80/tcp  from 0.0.0.0/0
443/tcp from 0.0.0.0/0
```

3. Set GitHub Actions secrets for Django:

```text
ALLOWED_HOSTS=<EC2_PUBLIC_IP>,slancer.site,www.slancer.site,api.slancer.site,localhost,127.0.0.1,backend
CORS_ALLOWED_ORIGINS=http://<EC2_PUBLIC_IP>,http://slancer.site,http://www.slancer.site,https://slancer.site,https://www.slancer.site
```

4. Deploy once so Docker containers and the HTTP Nginx config are live.

5. SSH into EC2 and install/issue certificates after DNS resolves:

```bash
sudo apt-get update
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d slancer.site -d www.slancer.site
sudo certbot --nginx -d api.slancer.site
sudo nginx -t
sudo systemctl reload nginx
```

6. After HTTPS works, update the GitHub secret:

```text
CORS_ALLOWED_ORIGINS=https://slancer.site,https://www.slancer.site
```

Keep `deploy/nginx-no-ssl.conf` for the first HTTP deployment. Use `deploy/nginx-ssl.conf` as the final reference config after Certbot has created certificates.

The GitHub Actions deployment is certificate-aware: before Certbot it writes the HTTP config, and after `/etc/letsencrypt/live/slancer.site/` plus `/etc/letsencrypt/live/api.slancer.site/` exist, it writes the HTTPS config automatically.

## Important Debugging Lessons

- `502 Bad Gateway` usually means Nginx cannot reach the upstream container.
- A Docker credential warning is not always the real failure.
- Container name conflicts happen when old containers still exist.
- GitHub Actions SSH failures are often caused by wrong EC2 host, wrong key, wrong user, or security group rules.
- Django health checks can fail with `400` if `ALLOWED_HOSTS` is incomplete.
- Local alternate ports like `3002` and `8001` should not leak into production Nginx config.

## Security Notes

Do not commit real secrets.

These files can contain sensitive values and should stay private:

```text
terraform.tfvars
terraform.tfstate
backend/.env
.env
private SSH keys
```

For a production-grade setup, move Terraform state to an S3 backend with locking and store application secrets in AWS Secrets Manager or GitHub Environments.

## Future Improvements

- Add automated certificate renewal checks to deployment monitoring.
- Add JWT authentication if user login APIs are needed.
- Add DRF permission classes for write endpoints.
- Add frontend tests.
- Add monitoring and alerts.
- Move Terraform state to remote S3 backend.
- Add automated database backups and stronger deletion protection.
