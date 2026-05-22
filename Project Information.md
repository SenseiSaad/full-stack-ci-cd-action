# Project Information

This repository contains a Django portfolio API and a separate static portfolio frontend.

## Architecture

- Backend: Django, Django REST Framework, Gunicorn
- Frontend: static HTML served by the `frontend` Nginx container
- Database: PostgreSQL locally through Compose or AWS RDS in production
- Containers: one backend Docker image and one frontend Docker image
- Cloud: Terraform provisions VPC, EC2, ECR, RDS, IAM, security groups, and optional Route53 record

## Production Flow

1. Provision infrastructure with Terraform.
2. Build and push the backend and frontend images to ECR.
3. SSH into EC2, login to ECR, pull the images, and start the containers.
4. Add GitHub Actions secrets, including the Terraform `ecr_backend_url` and `ecr_frontend_url` outputs.
5. Let GitHub Actions rebuild, push, and redeploy automatically on future pushes.

## Runtime Routes

- `/` serves the portfolio UI.
- `/api/` serves API endpoints.
- `/admin/` serves Django admin.
- `/health/` serves the container health check.
