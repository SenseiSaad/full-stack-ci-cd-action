output "ec2_public_ip" {
  description = "Public IP of the app EC2 instance"
  value       = aws_instance.app_server.public_ip
}

output "backend_url" {
  description = "Backend API URL through the EC2-hosted Nginx reverse proxy"
  value       = "http://${aws_instance.app_server.public_ip}/api"
}

output "app_url" {
  description = "Application URL served by the EC2-hosted frontend container"
  value       = "http://${aws_instance.app_server.public_ip}"
}

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.postgres.endpoint
}

output "rds_host" {
  description = "RDS hostname without port for DB_HOST"
  value       = aws_db_instance.postgres.address
}

output "vpc_id" {
  description = "VPC id"
  value       = aws_vpc.main.id
}

output "ecr_backend_url" {
  description = "Backend ECR repository URL"
  value       = aws_ecr_repository.backend.repository_url
}

output "ecr_frontend_url" {
  description = "Frontend ECR repository URL"
  value       = aws_ecr_repository.frontend.repository_url
}

output "s3_bucket_name" {
  description = "S3 bucket for Django static/media assets"
  value       = aws_s3_bucket.app_assets.bucket
}

output "ec2_security_group_id" {
  description = "EC2 security group ID"
  value       = aws_security_group.app_sg.id
}

output "rds_security_group_id" {
  description = "RDS security group ID"
  value       = aws_security_group.rds_sg.id
}
