# Deployment Shape

This project now deploys as one Django application container.

- Django serves the portfolio UI from `backend/templates/frontend/index.html`.
- Django keeps API routes under `/api/`.
- Django admin remains under `/admin/`.
- Docker builds only the backend image from `backend/Dockerfile`.
- EC2 runs one container mapped as `80:8000`.
- RDS is configured through environment variables.

Typical flow:

```bash
cd infrastructure
terraform apply
terraform output
```

Then build/push the backend image to ECR and run it on EC2 with `docker-compose.ec2.yml`.
