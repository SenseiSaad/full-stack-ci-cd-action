# Project Information

This repository contains a Django portfolio application with a server-rendered frontend template.

## Architecture

- Backend: Django, Django REST Framework, Gunicorn
- Frontend: Django template at `backend/templates/frontend/index.html`
- Database: PostgreSQL locally through Compose or AWS RDS in production
- Container: one backend Docker image
- Cloud: Terraform provisions VPC, EC2, ECR, RDS, IAM, security groups, and optional Route53 record

## Production Flow

1. Provision infrastructure with Terraform.
2. Build and push the backend image to ECR.
3. SSH into EC2, login to ECR, pull the image, and start the container.
4. Add GitHub Actions secrets.
5. Let GitHub Actions rebuild, push, and redeploy automatically on future pushes.

## Runtime Routes

- `/` serves the portfolio UI.
- `/api/` serves API endpoints.
- `/admin/` serves Django admin.
- `/health/` serves the container health check.
