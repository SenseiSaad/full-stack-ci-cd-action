# Deployment Shape

This project now deploys as separate frontend and Django backend containers.

- Nginx serves the portfolio UI from the `frontend` image.
- Django keeps API routes under `/api/`.
- Django admin remains under `/admin/`.
- Docker builds backend and frontend images.
- EC2 Nginx proxies port 80 to the frontend container on `3000`.
- RDS is configured through environment variables.

Typical flow:

```bash
cd infrastructure
terraform apply
terraform output
```

Then build/push the backend and frontend images to ECR and run them on EC2 with `docker-compose.ec2.yml`.
